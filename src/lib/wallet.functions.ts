import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { DEMO_TOPUPS } from "./demo-money";

// DEMO top-up: adds play DSC to the signed-in account. No card, no real money.
export const mockBuyPack = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { packId: string; nonce: string }) => input)
  .handler(async ({ data, context }) => {
    const pack = DEMO_TOPUPS.find((p) => p.id === data.packId);
    if (!pack) throw new Error("Unknown demo amount");
    if (!/^[a-zA-Z0-9-]{8,64}$/.test(data.nonce)) throw new Error("Invalid request");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("post_transfer", {
      _key: `demo:${context.userId}:${data.nonce}`, _type: "purchase",
      _desc: `Demo top-up · ${pack.amount.toLocaleString("en")} DSC`,
      _from_user: null as unknown as string, _from_system: "demo_issuance",
      _to_user: context.userId, _to_system: null as unknown as string,
      _bucket: "restricted", _amount: pack.amount,
    });
    if (error) throw new Error("Top-up failed");
    return { dsc: pack.amount };
  });
