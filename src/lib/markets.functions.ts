import { createServerFn } from "@tanstack/react-start";
import { assertFinancialActionAllowed } from "@/lib/programme";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
    assertFinancialActionAllowed();
    const slug = data.marketSlug.trim().toLowerCase();
    const side = data.side;
    const price = Math.round(data.priceCents);
    const shares = Math.round(data.shares);

    if (!/^[a-z0-9-]{3,64}$/.test(slug)) throw new Error("Unknown market");
    if (side !== "yes" && side !== "no") throw new Error("Pick YES or NO");
    if (!(price >= 1 && price <= 99)) throw new Error("Price must be between 1 and 99 cents");
    if (!(shares >= 1 && shares <= 1_000_000)) throw new Error("Shares must be between 1 and 1,000,000");

    const { error } = await context.supabase.from("orders").insert({
      user_id: context.userId,
      market_slug: slug,
      market_question: data.marketQuestion.trim().slice(0, 200),
      market_category: data.marketCategory.trim().slice(0, 60),
      side,
      price_cents: price,
      shares,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const cancelOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { orderId: string }) => input)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", data.orderId)
      .eq("user_id", context.userId)
      .eq("status", "open");
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
