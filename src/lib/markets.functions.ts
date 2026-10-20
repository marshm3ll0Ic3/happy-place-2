import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
// Legacy orders remain archived. New orders use the atomic demo_money_action.
export const placeOrder = createServerFn({method:"POST"})
 .middleware([requireSupabaseAuth])
 .handler(async () => { throw new Error("Legacy order creation is disabled. Use demo forecasts."); });
export const cancelOrder = createServerFn({method:"POST"})
 .middleware([requireSupabaseAuth])
 .inputValidator((input: {orderId: string}) => input)
 .handler(async () => { throw new Error("Legacy intentions are archived, not funded demo orders."); });
