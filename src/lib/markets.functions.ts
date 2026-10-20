import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type PlaceInput = {
  marketSlug: string;
  marketQuestion: string;
  marketCategory: string;
  side: "yes" | "no";
  priceCents: number;
  shares: number;
};

type Bucket = "promotional" | "restricted";

// Demo trading: 1 DSC = 1¢ of share price. Orders spend promotional credits
// first, then restricted (purchased demo) credits; cancelling refunds them.
export function orderCost(priceCents: number, shares: number) {
  return Math.ceil((priceCents * shares) / 100);
}

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
    const { data: bals } = await context.supabase.from("my_balances").select("*");
    const bal = { promotional: 0, restricted: 0, convertible: 0 };
    bals?.forEach((r) => r.bucket && (bal[r.bucket] = r.balance ?? 0));
    const promo = Math.min(bal.promotional, cost);
    const restricted = cost - promo;
    if (restricted > (bal.restricted)) throw new Error(`Not enough DSC — this order needs ${cost.toLocaleString()} DSC. Buy demo credits in your Wallet.`);

    const { data: order, error } = await context.supabase.from("orders").insert({
      user_id: context.userId,
      market_slug: slug,
      market_question: data.marketQuestion.trim().slice(0, 200),
      market_category: data.marketCategory.trim().slice(0, 60),
      side,
      price_cents: price,
      shares,
    }).select("id").single();
    if (error) throw new Error(error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const parts: [Bucket, number][] = [["promotional", promo], ["restricted", restricted]];
    for (const [bucket, amount] of parts) {
      if (amount <= 0) continue;
      const { error: e } = await supabaseAdmin.rpc("post_transfer", {
        _key: `order:${order.id}:${bucket}`, _type: "trade_debit",
        _desc: `${side.toUpperCase()} · ${data.marketQuestion.trim().slice(0, 80)}`,
        _from_user: context.userId, _from_system: null as unknown as string,
        _to_user: null as unknown as string, _to_system: "trade_escrow",
        _bucket: bucket, _amount: amount,
      });
      if (e) throw new Error(e.message);
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
      .eq("status", "open")
      .select("id");
    if (error) throw new Error(error.message);
    if (!rows?.length) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: debits } = await supabaseAdmin
      .from("ledger_entries")
      .select("amount, bucket, transactions!inner(idempotency_key)")
      .eq("user_id", context.userId)
      .eq("direction", "debit")
      .like("transactions.idempotency_key", `order:${data.orderId}:%`);
    for (const d of debits ?? []) {
      const { error: e } = await supabaseAdmin.rpc("post_transfer", {
        _key: `refund:${data.orderId}:${d.bucket}`, _type: "refund", _desc: "Order cancelled · refund",
        _from_user: null as unknown as string, _from_system: "trade_escrow",
        _to_user: context.userId, _to_system: null as unknown as string,
        _bucket: d.bucket, _amount: d.amount,
      });
      if (e) throw new Error(e.message);
    }
    return { ok: true as const };
  });
