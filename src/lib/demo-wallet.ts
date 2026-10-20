import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export const demoWalletOptions = queryOptions({
 queryKey: ["demo-wallet"],
 queryFn: async () => {
  const [wallet, transactions] = await Promise.all([
   supabase.from("demo_wallets").select("forecast_cents,resource_cents").maybeSingle(),
   supabase.from("demo_transactions").select("*").order("created_at", {ascending:false}).limit(200),
  ]);
  if (wallet.error || transactions.error) throw new Error("Unable to load demo wallet");
  return { forecast: (wallet.data?.forecast_cents ?? 0)/100, resource: (wallet.data?.resource_cents ?? 0)/100, transactions: transactions.data ?? [] };
 }
});
