import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, BarChart3, ChevronDown, History, Share2, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/AppChrome";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — DiSTRUB" },
      { name: "description", content: "Track every open and closed attention contract, realized PnL and rank." },
      { property: "og:title", content: "Portfolio — DiSTRUB" },
      { property: "og:description", content: "Track every open and closed attention contract, realized PnL and rank." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

type C = { tag: string; q: string; side: "YES" | "NO"; a: number; b: number; shares: number; pnl: number };
const OPEN: C[] = [
  { tag: "Formula 1", q: "Will the title fight stay open until the final F1 race?", side: "YES", a: 58, b: 64, shares: 780, pnl: 468 },
  { tag: "AI Agents", q: "Will AI agents overtake crypto in global search interest?", side: "YES", a: 49, b: 57, shares: 620, pnl: 496 },
  { tag: "Northstar", q: "Will Northstar become the most-searched sports brand?", side: "NO", a: 48, b: 54, shares: 410, pnl: -246 },
  { tag: "Champions League", q: "Will the Champions League final exceed the attention record?", side: "YES", a: 44, b: 53, shares: 920, pnl: 828 },
];
const CLOSED: C[] = [
  { tag: "@MayaBloom", q: "Will @MayaBloom pass 1M followers before summer?", side: "YES", a: 36, b: 71, shares: 300, pnl: 1050 },
  { tag: "Box office", q: "Will the summer blockbuster top weekend attention?", side: "NO", a: 62, b: 80, shares: 380, pnl: -684 },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
      <span className="text-primary">[</span>{children}<span className="text-primary">]</span>
    </p>
  );
}

type DbOrder = { id: string; market_slug: string; market_question: string; market_category: string; side: string; price_cents: number; shares: number; status: string };

function Portfolio() {
  const { t } = useT();
  const [tab, setTab] = useState<"open" | "closed">("open");

  const { data: me } = useQuery({
    queryKey: ["mk-me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const { data: b } = await supabase.from("my_balances").select("*");
      const bal = { promotional: 0, restricted: 0, convertible: 0 };
      b?.forEach((r) => r.bucket && (bal[r.bucket as keyof typeof bal] = r.balance ?? 0));
      return { userId: u.user.id, total: bal.promotional + bal.restricted + bal.convertible };
    },
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["mk-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) return [] as DbOrder[];
      return (data ?? []) as DbOrder[];
    },
    enabled: !!me,
  });

  const live = !!me;
  const toC = (o: DbOrder): C => {
    const cur = o.status === "cancelled" ? o.price_cents : currentPrice(o.market_slug, o.side, o.price_cents);
    return {
      tag: o.status === "cancelled" ? `${o.market_category} · ${t("pf.cancelled")}` : o.market_category,
      q: o.market_question, side: o.side === "no" ? "NO" : "YES",
      a: o.price_cents, b: cur, shares: o.shares,
      pnl: Math.round((o.shares * (cur - o.price_cents)) / 100),
    };
  };
  const openList = live ? orders.filter((o) => o.status === "open").map(toC) : OPEN;
  const closedList = live ? orders.filter((o) => o.status !== "open").map(toC) : CLOSED;
  const rows = tab === "open" ? openList : closedList;

  const exposure = live ? Math.round(orders.filter((o) => o.status === "open").reduce((s, o) => s + (o.shares * o.price_cents) / 100, 0)) : 3670;
  const pnl = live ? [...openList, ...closedList].reduce((s, c) => s + c.pnl, 0) : 1914;
  const value = live ? me!.total + pnl : 12740;
  const fmt = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toLocaleString()} DSC`;

  const stats = [
    { icon: BarChart3, k: "pf.pnl", v: <span className={pnl >= 0 ? "text-yes" : "text-no"}>{fmt(pnl)}</span>, s: t("pf.pnlSub") },
    { icon: Target, k: "pf.exposure", v: `${exposure.toLocaleString()} DSC`, s: t("pf.exposureSub") },
    { icon: Trophy, k: "pf.rank", v: live ? "—" : "#27", s: live ? t("pf.rankSoon") : `3,142 ${t("pf.participants")}` },
  ];

  return (
    <div className="grid-bg-wrap relative pb-28 md:pb-16">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 md:pt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t("pf.eyebrow")}</Eyebrow>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl">
              {t("pf.title")}
            </motion.h1>
            <p className="mt-5 max-w-lg text-muted-foreground">{t("pf.sub")}</p>
          </div>
          <Button asChild variant="outline" className="h-11 rounded-sm px-5">
            <Link to="/markets">{t("pf.find")} <ArrowRight /></Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="bg-card p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{t("pf.value")}</p>
            <p className="font-mono tabular mt-4 text-5xl font-medium">
              <CountUp value={12740} /> <span className="text-sm text-muted-foreground">DSC</span>
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <svg viewBox="0 0 80 24" preserveAspectRatio="none" className="h-10 flex-1 text-primary-glow">
                <polyline points="0,20 10,18 20,19 30,14 40,15 50,9 60,10 70,6 80,3" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="font-mono shrink-0 text-xs text-yes">+8.4% {t("pf.season")}</span>
            </div>
          </div>
          {stats.map(({ icon: Icon, k, v, s }) => (
            <div key={k} className="flex flex-col bg-card p-6">
              <Icon className="size-4 text-primary" />
              <p className="font-mono mt-auto pt-6 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{t(k)}</p>
              <p className="font-mono tabular mt-2 text-2xl font-medium">{v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{t("pf.contracts")}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{t("pf.contractsSub")}</p>
            </div>
            <div className="flex rounded-sm border border-border p-0.5">
              {(["open", "closed"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`font-mono flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs uppercase transition-colors ${tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t(`pf.${k}`)} <span className="opacity-70">{k === "open" ? OPEN.length : CLOSED.length}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="font-mono flex items-center gap-2 border-b border-border px-6 py-2.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            <ChevronDown className="size-3" /> {rows.length} {t("pf.count")}
          </p>
          <div className="max-h-[420px] divide-y divide-border overflow-y-auto">
            {rows.map((r, i) => (
              <motion.div
                key={tab + r.q}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-secondary md:grid-cols-[auto_minmax(0,2.2fr)_auto_1fr_0.7fr_1fr_auto]"
              >
                <span className="font-mono flex size-9 items-center justify-center rounded-sm border border-border text-[11px] text-primary">
                  {r.tag.replace("@", "").slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase text-muted-foreground">{r.tag}</p>
                  <p className="truncate text-sm font-medium">{r.q}</p>
                </div>
                <span className={`font-mono rounded-sm border px-2 py-0.5 text-[10px] ${r.side === "YES" ? "border-yes/40 text-yes" : "border-no/40 text-no"}`}>
                  {r.side}
                </span>
                <Cell label={t(tab === "open" ? "pf.entry" : "pf.exit")} value={`${r.a}¢ → ${r.b}¢`} />
                <Cell label={t("pf.shares")} value={r.shares.toLocaleString()} />
                <Cell
                  label={t(tab === "open" ? "pf.live" : "pf.realized")}
                  value={<span className={r.pnl >= 0 ? "text-yes" : "text-no"}>{r.pnl >= 0 ? "+" : "−"}{Math.abs(r.pnl)} DSC</span>}
                />
                <button
                  aria-label={t("pf.share")}
                  onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success(t("pf.copied")); }}
                  className="hidden size-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:text-foreground md:flex"
                >
                  <Share2 className="size-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-4 rounded-md border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border">
              <History className="size-4 text-primary" />
            </span>
            <div>
              <h3 className="font-semibold">{t("pf.history")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("pf.historySub")}</p>
            </div>
          </div>
          <Button variant="outline" className="h-11 rounded-sm px-5" onClick={() => setTab("closed")}>
            {t("pf.viewClosed")} <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="hidden md:block">
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
      <p className="font-mono tabular mt-1 text-sm">{value}</p>
    </div>
  );
}
