import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { ShellPage } from "@/components/ShellPage";
import { CountUp } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { BuyCreditsSheet } from "@/components/BuyCreditsSheet";

export const Route = createFileRoute("/_authenticated/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — DiSTRUB" },
      { name: "description", content: "Your DSC balances and credit purchases." },
      { property: "og:title", content: "Wallet — DiSTRUB" },
      { property: "og:description", content: "Your DSC balances and credit purchases." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wallet,
});

function Wallet() {
  const { t } = useT();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const [b, e, w] = await Promise.all([
        supabase.from("my_balances").select("*"),
        supabase
          .from("ledger_entries")
          .select("id, amount, direction, bucket, created_at, transactions(type, description)")
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("conversion_waitlist").select("user_id").eq("user_id", u.user!.id).maybeSingle(),
      ]);
      const bal = { promotional: 0, restricted: 0, convertible: 0 };
      b.data?.forEach((r) => r.bucket && (bal[r.bucket] = r.balance ?? 0));
      return { bal, entries: e.data ?? [], waitlisted: !!w.data, userId: u.user!.id };
    },
  });

  async function joinWaitlist() {
    if (!data) return;
    const { error } = await supabase.from("conversion_waitlist").insert({ user_id: data.userId });
    if (error) toast.error(error.message);
    else {
      toast.success(t("wallet.waitlistJoined"));
      qc.invalidateQueries({ queryKey: ["wallet"] });
    }
  }

  if (isLoading || !data)
    return (
      <ShellPage titleKey="nav.wallet">
        <div className="mt-6 space-y-3">
          <div className="glass h-32 animate-pulse rounded-sm" />
          <div className="glass h-20 animate-pulse rounded-sm" />
        </div>
      </ShellPage>
    );

  const { bal, entries, waitlisted } = data;
  const total = bal.promotional + bal.restricted + bal.convertible;
  const rows = [
    ["wallet.promotional", bal.promotional],
    ["wallet.restricted", bal.restricted],
    ["wallet.convertible", 0],
  ] as const;

  return (
    <ShellPage titleKey="nav.wallet">
      <div className="glass mt-6 rounded-sm p-6">
        <p className="text-sm text-muted-foreground">{t("wallet.total")}</p>
        <p className="font-display mt-1 text-4xl font-bold md:text-5xl">
          <CountUp value={total} /> <span className="text-xl text-muted-foreground">DSC</span>
        </p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {rows.map(([k, v]) => (
          <div key={k} className="glass rounded-sm p-4">
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {k === "wallet.convertible" && <Lock className="size-3" />}
              {t(k)}
            </p>
            <p className="font-display mt-1 text-lg font-bold tabular md:text-2xl">
              <CountUp value={v} />
            </p>
          </div>
        ))}
      </div>
      <div className="glass mt-3 flex items-center justify-between gap-3 rounded-sm p-4">
        <p className="text-xs text-muted-foreground">{t("wallet.conversionLocked")}</p>
        <Button size="sm" variant="secondary" disabled={waitlisted} onClick={joinWaitlist} className="min-h-11 shrink-0 rounded-sm">
          {waitlisted ? t("wallet.waitlisted") : t("wallet.joinWaitlist")}
        </Button>
      </div>

      <h2 className="mt-8 text-xl font-bold">{t("wallet.history")}</h2>
      <ul className="mt-3 space-y-2">
        {entries.length === 0 && <li className="text-sm text-muted-foreground">{t("wallet.noHistory")}</li>}
        {entries.map((e) => (
          <li key={e.id} className="glass flex items-center justify-between gap-3 rounded-sm p-4">
            <div>
              <p className="text-sm font-medium">{e.transactions?.description ?? e.transactions?.type}</p>
              <p className="text-xs text-muted-foreground">
                {t(`wallet.${e.bucket}`)} · {new Date(e.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className={`font-display tabular font-bold ${e.direction === "credit" ? "text-yes" : "text-no"}`}>
              {e.direction === "credit" ? "+" : "−"}
              {e.amount.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="fixed inset-x-0 bottom-16 px-5 pb-2 md:static md:mt-6 md:px-0">
        <BuyCreditsSheet />
      </div>
    </ShellPage>
  );
}
