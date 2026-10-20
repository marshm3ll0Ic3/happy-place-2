import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { orderCost, splitSpend } from "./demo-money";

type PlaceInput = {
  marketSlug: string;
  marketQuestion: string;
  marketCategory: string;
  side: "yes" | "no";
  priceCents: number;
  shares: number;
};

// Orders are saved to the trader's own account. Credits only move once
// live trading opens, so nothing here touches the ledger yet.
export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: PlaceInput) => input)
  .handler(async ({ data, context }) => {
    const slug = data.marketSlug.trim().toLowerCase();
    const side = data.side;
    const price = Math.round(data.priceCents);
    const shares = Math.round(data.shares);

    if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new Error("Unknown market");
    if (side !== "yes" && side !== "no") throw new Error("Pick YES or NO");
    if (!(price >= 1 && price <= 99)) throw new Error("Price must be between 1 and 99 cents");
    if (!(shares >= 1 && shares <= 1_000_000)) throw new Error("Shares must be between 1 and 1,000,000");

    const cost = orderCost(price, shares);
    const { data: rows } = await context.supabase.from("my_balances").select("*");
    const bal = { promotional: 0, restricted: 0 };
    rows?.forEach((r) => { if (r.bucket === "promotional" || r.bucket === "restricted") bal[r.bucket] = r.balance ?? 0; });
    const split = splitSpend(cost, bal);
    if (!split) throw new Error(`Not enough demo DSC — this order needs ${cost.toLocaleString("en")}. Top up in Wallet.`);
    const { data: order, error } = await context.supabase.from("orders").insert({
      user_id: context.userId,
      market_slug: slug,
      market_question: data.marketQuestion.trim().slice(0, 200),
      market_category: data.marketCategory.trim().slice(0, 60),
      side,
      price_cents: price,
      shares,
    }).select("id").single();
    if (error || !order) throw new Error("Could not place order");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const bucket of ["promotional", "restricted"] as const) {
      if (!split[bucket]) continue;
      await supabaseAdmin.rpc("post_transfer", {
        _key: `order:${order.id}:${bucket}`, _type: "trade_debit", _desc: `Order · ${side.toUpperCase()} ${slug}`,
        _from_user: context.userId, _from_system: null as unknown as string,
        _to_user: null as unknown as string, _to_system: "demo_escrow", _bucket: bucket, _amount: split[bucket],
      });
    }
    return { ok: true as const, cost };
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", data.orderId)
      .eq("user_id", context.userId)
      .eq("status", "open").select("id");
    if (error) throw new Error(error.message);
    if (!rows?.length) return { ok: true as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: debits } = await supabaseAdmin.from("ledger_entries")
      .select("bucket, amount, transactions!inner(idempotency_key)")
      .eq("user_id", context.userId).eq("direction", "debit")
      .like("transactions.idempotency_key", `order:${data.orderId}:%`);
    for (const d of debits ?? []) {
      await supabaseAdmin.rpc("post_transfer", {
        _key: `refund:${data.orderId}:${d.bucket}`, _type: "refund", _desc: "Order cancelled · refund",
        _from_user: null as unknown as string, _from_system: "demo_escrow",
        _to_user: context.userId, _to_system: null as unknown as string, _bucket: d.bucket, _amount: d.amount,
      });
    }
    return { ok: true as const };
  });
