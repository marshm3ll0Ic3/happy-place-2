import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Activity, ArrowRight, Clock, Flame, Info, Search, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";
import { cancelOrder, placeOrder } from "@/lib/markets.functions";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — DiSTRUB" },
      { name: "description", content: "Browse live YES/NO markets on creator attention, chart the price and place an order." },
      { property: "og:title", content: "Markets — DiSTRUB" },
      { property: "og:description", content: "Browse live YES/NO markets on creator attention, chart the price and place an order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Markets,
});

type Tag = "trending" | "closing" | "new" | "normal";
type M = {
  slug: string;
  cat: string;
  q: string;
  yes: number;
  vol: number;
  parts: number;
  closes: number;
  tag: Tag;
};

const MARKETS: M[] = [
  { slug: "ai-agents-overtake-crypto", cat: "AI Agents", q: "Will AI agents overtake crypto in global search interest?", yes: 49, vol: 2260000, parts: 5310, closes: 21, tag: "trending" },
  { slug: "ucl-final-attention-record", cat: "Football", q: "Will the Champions League final exceed the attention record?", yes: 44, vol: 3120000, parts: 7480, closes: 4, tag: "closing" },
  { slug: "f1-title-fight-final-race", cat: "Formula 1", q: "Will the title fight stay open until the final race?", yes: 58, vol: 1840000, parts: 4120, closes: 12, tag: "trending" },
  { slug: "shortform-overtakes-longform", cat: "Media", q: "Will short-form overtake long-form watch time this year?", yes: 68, vol: 1650000, parts: 4470, closes: 30, tag: "normal" },
  { slug: "northstar-most-searched-brand", cat: "Sports", q: "Will Northstar become the most-searched sports brand?", yes: 48, vol: 1320000, parts: 3640, closes: 34, tag: "normal" },
  { slug: "esports-major-viewers-5m", cat: "Gaming", q: "Will the esports major peak above 5M concurrent viewers?", yes: 55, vol: 1120000, parts: 3210, closes: 15, tag: "trending" },
  { slug: "mayabloom-1m-followers", cat: "Creators", q: "Will @MayaBloom pass 1M followers before summer?", yes: 71, vol: 940000, parts: 2870, closes: 6, tag: "closing" },
  { slug: "summer-blockbuster-top-weekend", cat: "Film", q: "Will the summer blockbuster top the weekend attention chart?", yes: 62, vol: 780000, parts: 1980, closes: 9, tag: "normal" },
  { slug: "stablecoin-fees-under-1cent", cat: "Crypto", q: "Will stablecoin transfer fees stay under 1 cent all month?", yes: 39, vol: 890000, parts: 2260, closes: 8, tag: "closing" },
  { slug: "indie-album-streaming-record", cat: "Music", q: "Will an indie album break the weekly streaming record?", yes: 33, vol: 560000, parts: 1420, closes: 27, tag: "new" },
  { slug: "creator-fund-100m-payouts", cat: "Creator economy", q: "Will creator funds pay out 100M DSC this quarter?", yes: 27, vol: 430000, parts: 990, closes: 41, tag: "new" },
  { slug: "ai-host-first-podcast-chart", cat: "AI Agents", q: "Will an AI-hosted podcast hit a national chart?", yes: 22, vol: 340000, parts: 860, closes: 45, tag: "new" },
];

const PATHS: Record<string, number[]> = Object.fromEntries(
  MARKETS.map((m) => [m.slug, path(m.slug, m.yes)]),
);

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Deterministic sample price path so the chart never jumps between renders.
function path(slug: string, end: number, n = 30) {
  let seed = hash(slug);
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const out: number[] = [];
  let v = Math.max(6, Math.min(94, end + (rnd() - 0.5) * 26));
  for (let i = 0; i < n; i++) {
    v += (end - v) * 0.09 + (rnd() - 0.5) * 5;
    v = Math.max(4, Math.min(96, v));
    out.push(v);
  }
  out[n - 1] = end;
  return out;
}

function Chart({ data }: { data: number[] }) {
  const W = 320, H = 120, P = 12;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const x = (i: number) => (i / (data.length - 1)) * W;
  const y = (v: number) => H - P - ((v - min) / span) * (H - P * 2);
  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = data.length - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-36 w-full">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="currentColor" strokeWidth="1" className="text-border" vectorEffect="non-scaling-stroke" />
      ))}
      <polygon points={`0,${H} ${pts} ${W},${H}`} className="fill-primary/10" />
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" vectorEffect="non-scaling-stroke" />
      <circle cx={x(last)} cy={y(data[last]!)} r="2.5" className="fill-primary" />
    </svg>
  );
}

function Spark({ data }: { data: number[] }) {
  const W = 64, H = 22;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${((i / (data.length - 1)) * W).toFixed(1)},${(H - ((v - min) / span) * (H - 4) - 2).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-5 w-16">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Money({ n }: { n: number }) {
  return <span className="font-mono tabular">{n.toLocaleString()}</span>;
}

type Order = {
  id: string;
  market_slug: string;
  market_question: string;
  market_category: string;
  side: string;
  price_cents: number;
  shares: number;
  status: string;
};

function Markets() {
  const { t } = useT();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Tag>("all");
  const [sort, setSort] = useState<"vol" | "move" | "time">("vol");
  const [slug, setSlug] = useState(MARKETS[0]!.slug);
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("500");
  const [busy, setBusy] = useState(false);

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
      if (error) return [] as Order[];
      return (data ?? []) as Order[];
    },
    enabled: !!me,
  });


  const rows = MARKETS.filter((m) => {
    const okFilter = filter === "all" || m.tag === filter;
    const s = q.trim().toLowerCase();
    const okQ = !s || m.q.toLowerCase().includes(s) || m.cat.toLowerCase().includes(s);
    return okFilter && okQ;
  }).sort((a, b) => {
    if (sort === "vol") return b.vol - a.vol;
    if (sort === "time") return a.closes - b.closes;
    const ma = Math.abs(PATHS[a.slug]![29]! - PATHS[a.slug]![0]!);
    const mb = Math.abs(PATHS[b.slug]![29]! - PATHS[b.slug]![0]!);
    return mb - ma;
  });

  const m = MARKETS.find((x) => x.slug === slug) ?? MARKETS[0]!;
  const series = PATHS[m.slug]!;
  const change = series[series.length - 1]! - series[0]!;
  const price = side === "yes" ? m.yes : 100 - m.yes;
  const amt = Math.max(0, Math.round(Number(amount) || 0));
  const shares = Math.floor((amt * 100) / price);
  const cost = (shares * price) / 100;
  const payout = shares;

  async function submit() {
    if (!me) {
      toast.info(t("mk.signInTrade"));
      return;
    }
    if (shares < 1) {
      toast.error(t("mk.noAmount"));
      return;
    }
    if (cost > me.total) {
      toast.error(t("mk.notEnough"));
      return;
    }
    setBusy(true);
    try {
      await placeOrder({
        data: {
          marketSlug: m.slug,
          marketQuestion: m.q,
          marketCategory: m.cat,
          side,
          priceCents: price,
          shares,
        },
      });
      toast.success(t("mk.placed"));
      qc.invalidateQueries({ queryKey: ["mk-orders"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("mk.error"));
    } finally {
      setBusy(false);
    }
  }

  async function cancel(id: string) {
    setBusy(true);
    try {
      await cancelOrder({ data: { orderId: id } });
      toast.success(t("mk.cancelledToast"));
      qc.invalidateQueries({ queryKey: ["mk-orders"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("mk.error"));
    } finally {
      setBusy(false);
    }
  }

  const stats = [
    { icon: Activity, k: "mk.statOpen", v: "128", s: t("mk.statOpenSub") },
    { icon: Flame, k: "mk.statVol", v: "14.2M", s: t("mk.statVolSub") },
    { icon: Sparkles, k: "mk.statMove", v: "+14¢", s: t("mk.statMoveSub") },
    { icon: Clock, k: "mk.statSettle", v: "Fri", s: t("mk.statSettleSub") },
  ];

  return (
    <div className="grid-bg-wrap relative pb-28 md:pb-16">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[480px]" />
      <div className="relative mx-auto max-w-6xl px-5 pt-14 md:pt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t("mk.eyebrow")}</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl"
            >
              {t("mk.title")}
            </motion.h1>
            <p className="mt-5 max-w-lg text-muted-foreground">{t("mk.sub")}</p>
          </div>
          <span className="font-mono flex h-9 w-fit items-center gap-2 rounded-sm border border-border px-3 text-[11px] uppercase text-muted-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            {t("mk.live")}
          </span>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, k, v, s }) => (
            <div key={k} className="flex min-w-0 flex-col bg-card p-4 sm:p-6">
              <Icon className="size-4 text-primary" />
              <p className="font-mono mt-auto pt-6 text-[10px] uppercase sm:text-[11px] tracking-[0.1em] text-muted-foreground">{t(k)}</p>
              <p className="font-mono tabular mt-2 truncate text-xl font-medium sm:text-2xl">{v}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-md border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-sm border border-border px-3">
            <Search className="size-3.5 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("mk.search")}
              className="font-mono w-full bg-transparent text-xs uppercase outline-none placeholder:text-muted-foreground"
            />
            {q && (
              <button aria-label={t("mk.clear")} onClick={() => setQ("")} className="text-muted-foreground hover:text-foreground">
                <X className="size-3.5" />
              </button>
            )}
          </label>
          <div className="flex flex-wrap gap-1">
            {(["all", "trending", "closing", "new"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`font-mono rounded-sm border px-3 py-1.5 text-[11px] uppercase transition-colors ${
                  filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(`mk.f_${k}`)}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {(["vol", "move", "time"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`font-mono rounded-sm px-3 py-1.5 text-[11px] uppercase transition-colors ${
                  sort === k ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(`mk.s_${k}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-md border border-border bg-card">
            <div className="font-mono grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-5 py-2.5 text-[10px] uppercase tracking-[0.1em] text-muted-foreground md:grid-cols-[minmax(0,2.4fr)_4rem_4rem_5rem_5.5rem]">
              <span>{t("mk.colMarket")}</span>
              <span className="hidden md:inline">{t("mk.colYes")}</span>
              <span className="hidden md:inline">{t("mk.colNo")}</span>
              <span className="hidden md:inline">{t("mk.colVol")}</span>
              <span className="hidden md:inline">{t("mk.colCloses")}</span>
              <span className="md:hidden">{t("mk.colYes")} / {t("mk.colNo")}</span>
            </div>
            <p className="font-mono border-b border-border px-5 py-2 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              {rows.length} {t("mk.results")}
            </p>
            <div className="max-h-[560px] divide-y divide-border overflow-y-auto">
              {rows.length === 0 && (
                <p className="font-mono px-5 py-10 text-center text-xs uppercase text-muted-foreground">{t("mk.none")}</p>
              )}
              {rows.map((r, i) => {
                const active = r.slug === slug;
                const s = PATHS[r.slug]!;
                return (
                  <motion.button
                    key={r.slug}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 8) * 0.03 }}
                    onClick={() => setSlug(r.slug)}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary md:grid-cols-[minmax(0,2.4fr)_4rem_4rem_5rem_5.5rem] ${
                      active ? "bg-secondary shadow-[inset_2px_0_0_var(--color-primary)]" : ""
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{r.cat}</p>
                      <p className="truncate text-sm font-medium">{r.q}</p>
                      <p className="font-mono mt-1 flex items-center gap-2 text-[10px] uppercase text-muted-foreground md:hidden">
                        <span className="text-yes">{r.yes}¢ YES</span>
                        <span className="text-no">{100 - r.yes}¢ NO</span>
                        <span>{r.closes}d</span>
                      </p>
                    </div>
                    <span className="font-mono tabular hidden text-yes md:inline">{r.yes}¢</span>
                    <span className="font-mono tabular hidden text-no md:inline">{100 - r.yes}¢</span>
                    <span className="font-mono tabular hidden text-xs text-muted-foreground md:inline">
                      {(r.vol / 1000000).toFixed(1)}M
                    </span>
                    <span className="font-mono tabular hidden text-xs md:inline">{r.closes}d</span>
                    <span className={`flex items-center justify-end gap-2 ${active ? "text-primary" : "text-muted-foreground"}`}>
                      <Spark data={s} />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="overflow-hidden rounded-md border border-border bg-card lg:sticky lg:top-20 lg:self-start">
            <div className="border-b border-border p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{m.cat}</p>
              <h2 className="mt-2 text-lg font-semibold leading-snug">{m.q}</h2>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{t("mk.price")}</p>
                  <p className="font-mono tabular mt-1 text-4xl font-medium">{m.yes}¢</p>
                </div>
                <span className={`font-mono tabular text-sm ${change >= 0 ? "text-yes" : "text-no"}`}>
                  {change >= 0 ? "+" : "−"}
                  {Math.abs(change).toFixed(1)}¢ {t("mk.change")}
                </span>
              </div>
              <div className="mt-3">
                <Chart data={series} />
              </div>
              <div className="font-mono grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-border bg-border text-center text-[10px] uppercase">
                <div className="bg-card px-2 py-2">
                  <p className="text-muted-foreground">{t("mk.parts")}</p>
                  <p className="tabular mt-1 text-xs text-foreground">{(m.parts / 1000).toFixed(1)}k</p>
                </div>
                <div className="bg-card px-2 py-2">
                  <p className="text-muted-foreground">{t("mk.spread")}</p>
                  <p className="tabular mt-1 text-xs text-foreground">2¢</p>
                </div>
                <div className="bg-card px-2 py-2">
                  <p className="text-muted-foreground">{t("mk.closes")}</p>
                  <p className="tabular mt-1 text-xs text-foreground">{m.closes}d</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border">
                {(["yes", "no"] as const).map((k) => {
                  const p = k === "yes" ? m.yes : 100 - m.yes;
                  const on = side === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setSide(k)}
                      className={`flex flex-col items-center gap-1 py-3 transition-colors ${
                        on ? (k === "yes" ? "bg-yes/15" : "bg-no/15") : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className={`font-mono text-[11px] uppercase ${on ? (k === "yes" ? "text-yes" : "text-no") : ""}`}>{k}</span>
                      <span className="font-mono tabular text-xl font-medium">{p}¢</span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-4 block">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{t("mk.amount")}</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  className="font-mono tabular mt-1.5 h-11 w-full rounded-sm border border-border bg-transparent px-3 text-sm outline-none focus:border-primary/60"
                />
              </label>
              <div className="mt-2 flex gap-1">
                {[100, 500, 1000, 5000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className="font-mono rounded-sm border border-border px-2.5 py-1 text-[10px] uppercase text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {v}
                  </button>
                ))}
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <Row k={t("mk.shares")} v={<Money n={shares} />} />
                <Row k={t("mk.cost")} v={<><Money n={Number(cost.toFixed(2))} /> DSC</>} />
                <Row k={t("mk.payout")} v={<span className="text-yes"><Money n={payout} /> DSC</span>} />
                <Row
                  k={t("mk.available")}
                  v={me ? <><Money n={me.total} /> DSC</> : <Link to="/auth" className="text-primary underline-offset-4 hover:underline">{t("mk.signIn")}</Link>}
                />
              </dl>

              <Button
                onClick={submit}
                disabled={busy}
                className="mt-5 h-11 w-full rounded-sm"
              >
                {me ? `${t("mk.place")} ${side.toUpperCase()}` : t("mk.signInTrade")} <ArrowRight />
              </Button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">{t("mk.ticketNote")}</p>
            </div>
          </section>
        </div>

        {me && (
          <section className="mt-6 overflow-hidden rounded-md border border-border bg-card">
            <div className="flex flex-col gap-1 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{t("mk.yourOrders")}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{t("mk.yourOrdersSub")}</p>
              </div>
              <span className="font-mono tabular text-xs text-muted-foreground">
                {t("mk.totalAtRisk")} <span className="text-foreground">
                  <Money n={Number(orders.filter((o) => o.status === "open").reduce((s, o) => s + (o.shares * o.price_cents) / 100, 0).toFixed(2))} /> DSC
                </span>
              </span>
            </div>
            {orders.length === 0 ? (
              <p className="font-mono px-5 py-8 text-center text-xs uppercase text-muted-foreground">{t("mk.noOrders")}</p>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((o) => (
                  <div key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 md:grid-cols-[minmax(0,2.2fr)_3rem_5rem_5rem_5rem_5.5rem_5rem]">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{o.market_category}</p>
                      <p className="truncate text-sm">{o.market_question}</p>
                    </div>
                    <span className={`font-mono rounded-sm border px-2 py-0.5 text-[10px] uppercase ${o.side === "yes" ? "border-yes/40 text-yes" : "border-no/40 text-no"}`}>
                      {o.side}
                    </span>
                    <span className="font-mono tabular hidden text-xs md:inline">{o.price_cents}¢</span>
                    <span className="font-mono tabular hidden text-xs md:inline"><Money n={o.shares} /></span>
                    <span className="font-mono tabular hidden text-xs md:inline"><Money n={Number(((o.shares * o.price_cents) / 100).toFixed(2))} /></span>
                    <span className={`font-mono hidden text-[10px] uppercase md:inline ${o.status === "open" ? "text-primary" : "text-muted-foreground"}`}>
                      {t(`mk.st_${o.status}`)}
                    </span>
                    {o.status === "open" ? (
                      <button
                        onClick={() => cancel(o.id)}
                        disabled={busy}
                        className="font-mono flex h-8 items-center justify-center gap-1.5 rounded-sm border border-border px-3 text-[10px] uppercase text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="size-3" /> {t("mk.cancel")}
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] uppercase text-muted-foreground md:hidden">{t(`mk.st_${o.status}`)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="mt-6 flex flex-col gap-4 rounded-md border border-border bg-card p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border">
              <Info className="size-4 text-primary" />
            </span>
            <div>
              <h3 className="font-semibold">{t("mk.note")}</h3>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{t("mk.noteSub")}</p>
            </div>
          </div>
          <Button asChild variant="outline" className="h-11 shrink-0 rounded-sm px-5">
            <Link to="/portfolio">{t("mk.toPortfolio")} <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{k}</dt>
      <dd className="font-mono tabular text-sm">{v}</dd>
    </div>
  );
}
