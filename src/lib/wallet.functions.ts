import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// MOCK top-up: credits restricted DSC instantly without a card payment.
// Replace with a real checkout + webhook before going live.
export const mockBuyPack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { packId: string; nonce: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: flag } = await supabaseAdmin
      .from("feature_flags").select("enabled").eq("key", "credit_purchase_enabled").single();
    if (!flag?.enabled) throw new Error("Credit purchases are disabled");
    const { data: pack } = await supabaseAdmin
      .from("credit_packs").select("*").eq("id", data.packId).eq("active", true).single();
    if (!pack) throw new Error("Pack not found");
    const key = `mock:${context.userId}:${data.nonce}`;
    const { error } = await supabaseAdmin.rpc("post_transfer", {
      _key: key, _type: "purchase", _desc: `${pack.name} pack`,
      _from_user: null as unknown as string, _from_system: "dsc_issuance",
      _to_user: context.userId, _to_system: null as unknown as string,
      _bucket: "restricted", _amount: pack.dsc_amount,
    });
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("payments").insert({
      user_id: context.userId, pack_id: pack.id, stripe_session_id: key,
      amount_cents: pack.price_cents, dsc_amount: pack.dsc_amount, status: "mock",
    });
    return { dsc: pack.dsc_amount };
  });
