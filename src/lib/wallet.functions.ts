import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertFinancialActionAllowed } from "@/lib/programme";
// Preserve the callable name for older clients, but never issue legacy credits.
export const mockBuyPack = createServerFn({ method: "POST" })
 .middleware([requireSupabaseAuth])
 .inputValidator((input: { packId: string; nonce: string }) => input)
 .handler(async () => { assertFinancialActionAllowed(); return { dsc: 0 }; });
