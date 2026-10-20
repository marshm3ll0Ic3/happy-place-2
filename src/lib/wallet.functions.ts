import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { demoActionSchema } from "./demo-money";

export const demoMoneyAction = createServerFn({ method: "POST" })
 .middleware([requireSupabaseAuth])
 .inputValidator(input => demoActionSchema.parse(input))
 .handler(async ({ data, context }) => {
  const { action, key, ...details } = data;
  const { error } = await context.supabase.rpc("demo_money_action", { p_action: action, p_key: key, p_data: details });
  if (error) throw new Error(error.message);
  return { ok: true as const };
 });
// Legacy issuance stays disabled; new demo balances never touch the real/legacy ledger.
export const mockBuyPack = createServerFn({ method: "POST" })
 .middleware([requireSupabaseAuth])
 .inputValidator((input: {packId: string; nonce: string}) => input)
 .handler(async () => { throw new Error("Legacy issuance is disabled. Use the free demo wallet."); });
