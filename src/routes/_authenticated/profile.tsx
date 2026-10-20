import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Eyebrow } from "@/components/Eyebrow";
import { LangSwitcher } from "@/components/AppChrome";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — DiSTRUB" },
      { name: "description", content: "Your DiSTRUB profile." },
      { property: "og:title", content: "Profile — DiSTRUB" },
      { property: "og:description", content: "Your DiSTRUB profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { t } = useT();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data } = useQuery({
    queryKey: ["profile-stats"],
    queryFn: async () => {
      const [b, o] = await Promise.all([
        supabase.from("my_balances").select("*"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "open"),
      ]);
      const total = (b.data ?? []).reduce((s, r) => s + (r.balance ?? 0), 0);
      return { total, open: o.count ?? 0 };
    },
  });
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  const joined = user.created_at ? new Date(user.created_at).toLocaleDateString() : "—";
  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 md:pb-16 md:pt-16">
      <Eyebrow>{t("pr.eyebrow")}</Eyebrow>
      <div className="mt-4 flex min-w-0 items-center gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-2xl font-bold text-primary-foreground">
          {(user.email ?? "?").charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold md:text-3xl">{user.email}</h1>
          <p className="text-xs text-muted-foreground">{t("pr.joined")} {joined}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
        <Link to="/wallet" className="min-w-0 bg-card p-5">
          <p className="text-[11px] text-muted-foreground">{t("wallet.total")}</p>
          <p className="font-mono mt-1 break-words text-2xl tabular">{(data?.total ?? 0).toLocaleString()} <span className="text-xs text-muted-foreground">DSC</span></p>
        </Link>
        <Link to="/portfolio" className="bg-card p-5">
          <p className="text-[11px] text-muted-foreground">{t("pr.openOrders")}</p>
          <p className="font-mono mt-1 text-2xl tabular">{data?.open ?? 0}</p>
        </Link>
      </div>

      <div className="glass mt-4 divide-y divide-border rounded-sm">
        <div className="flex items-center justify-between gap-3 p-4">
          <span className="text-sm">{t("lang")}</span>
          <LangSwitcher />
        </div>
        {([["/portfolio", "nav.portfolio"], ["/markets", "nav.markets"], ["/school", "nav.school"]] as const).map(([to, k]) => (
          <Link key={to} to={to} className="flex h-14 items-center justify-between px-4 text-sm">
            {t(k)} <span className="text-muted-foreground">→</span>
          </Link>
        ))}
      </div>
      <button onClick={signOut} className="mt-4 h-12 w-full rounded-sm border border-border text-sm text-no">
        {t("auth.signOut")}
      </button>
    </main>
  );
}
