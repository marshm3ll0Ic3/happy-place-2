import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Gem, Megaphone, Gavel, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/AppChrome";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DiSTRUB — The attention exchange" },
      { name: "description", content: "Value your audience, book real creator reach, and trade on creator markets." },
      { property: "og:title", content: "DiSTRUB — The attention exchange" },
      { property: "og:description", content: "Value your audience, book real creator reach, and trade on creator markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const TICKER = [
  ["@nova.fit hits 1M by Dec", 64],
  ["@kai.cooks viral this week", 41],
  ["@luma.art brand deal Q4", 72],
  ["@rex.plays 50k live viewers", 28],
  ["@sora.travel 10M views", 55],
  ["@mila.beauty launches line", 83],
] as const;

const MARKETS = [
  { handle: "@nova.fit", q: "Hits 1M followers by December?", yes: 64, vol: 48200 },
  { handle: "@luma.art", q: "Signs a brand deal in Q4?", yes: 72, vol: 31750 },
  { handle: "@rex.plays", q: "Peaks above 50k live viewers?", yes: 28, vol: 19400 },
];

function Spark({ up, className = "h-5 w-14" }: { up: boolean; className?: string }) {
  const pts = up ? "0,18 10,14 20,15 30,9 40,10 50,4 60,2" : "0,4 10,6 20,5 30,11 40,10 50,15 60,17";
  return (
    <svg viewBox="0 0 60 20" preserveAspectRatio="none" className={`${className} ${up ? "text-yes" : "text-no"}`}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function MarketCard({ m, i }: { m: (typeof MARKETS)[number]; i: number }) {
  const { t } = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="glass rounded-3xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-primary">{m.handle}</span>
        <span className="tabular text-xs text-muted-foreground">{m.vol.toLocaleString()} DSC</span>
      </div>
      <p className="font-display mt-3 text-lg font-bold leading-tight">{m.q}</p>
      <Spark up={m.yes >= 50} className="mt-4 h-10 w-full" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-yes/15 py-2.5 text-center text-sm font-semibold text-yes">
          {t("landing.yes")} {m.yes}%
        </div>
        <div className="rounded-xl bg-no/15 py-2.5 text-center text-sm font-semibold text-no">
          {t("landing.no")} {100 - m.yes}%
        </div>
      </div>
    </motion.div>
  );
}

function Landing() {
  const { t } = useT();
  const feats = [
    { icon: BarChart3, k: "markets" },
    { icon: Gem, k: "value" },
    { icon: Megaphone, k: "reach" },
    { icon: Gavel, k: "mgmt" },
  ];
  const stats = [
    { v: 12480, k: "landing.stat.creators" },
    { v: 2140000, k: "landing.stat.volume" },
    { v: 860, k: "landing.stat.markets" },
  ];
  return (
    <div className="pb-24 md:pb-0">
      <section className="relative overflow-hidden">
        <div className="mesh pointer-events-none absolute -inset-20" />
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 md:grid-cols-[1.2fr_1fr] md:pb-24 md:pt-24">
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-yes" /> {t("hero.badge")}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-5xl font-bold leading-[0.95] md:text-7xl lg:text-8xl"
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground md:mx-0"
            >
              {t("hero.subtitle")}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start"
            >
              <Button asChild size="lg" className="glow h-14 rounded-2xl px-8 text-base active:scale-95">
                <Link to="/value">
                  {t("hero.ctaValue")} <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-14 rounded-2xl px-8 text-base active:scale-95">
                <Link to="/markets">{t("hero.ctaExplore")}</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative hidden md:block"
          >
            <div className="glass glow rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("landing.trending")}</span>
                <TrendingUp className="size-4 text-yes" />
              </div>
              <p className="font-display mt-4 text-2xl font-bold">@nova.fit</p>
              <p className="text-muted-foreground">{MARKETS[0]!.q}</p>
              <p className="font-display tabular mt-6 text-6xl font-bold text-yes">
                <CountUp value={64} />%
              </p>
              <Spark up className="mt-4 h-16 w-full" />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-yes/15 py-3 text-center font-semibold text-yes">{t("landing.yes")}</div>
                <div className="rounded-2xl bg-no/15 py-3 text-center font-semibold text-no">{t("landing.no")}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border py-3">
        <div className="marquee flex w-max gap-8">
          {[...TICKER, ...TICKER].map(([m, p], i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap text-sm">
              <span className="text-muted-foreground">{m}</span>
              <span className={`tabular font-display font-bold ${p >= 50 ? "text-yes" : "text-no"}`}>{p}%</span>
              <Spark up={p >= 50} />
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-5 py-14">
        {stats.map((s) => (
          <div key={s.k} className="text-center md:text-left">
            <p className="font-display text-2xl font-bold md:text-5xl">
              <CountUp value={s.v} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground md:text-sm">{t(s.k)}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold md:text-5xl">{t("landing.liveTitle")}</h2>
          <Link to="/markets" className="flex min-h-11 shrink-0 items-center gap-1 text-sm text-primary">
            {t("landing.seeAll")} <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {MARKETS.map((m, i) => (
            <MarketCard key={m.handle} m={m} i={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="max-w-lg text-3xl font-bold md:text-5xl">{t("feat.title")}</h2>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {feats.map(({ icon: Icon, k }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-3xl p-6"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{t(`feat.${k}.t`)}</h3>
              <p className="mt-2 text-muted-foreground">{t(`feat.${k}.d`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="relative overflow-hidden rounded-3xl border border-border p-10 text-center md:p-16">
          <div className="mesh pointer-events-none absolute -inset-10 opacity-70" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-5xl">{t("landing.ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">{t("landing.ctaBody")}</p>
            <Button asChild size="lg" className="glow mt-8 h-14 rounded-2xl px-8 text-base active:scale-95">
              <Link to="/auth">
                {t("landing.ctaButton")} <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-10 text-center text-sm text-muted-foreground">
        <p className="font-display text-lg font-bold text-foreground">
          Di<span className="text-primary">STRUB</span>
        </p>
        <p className="mt-2">{t("footer.legal")}</p>
        <p className="mt-1">© 2026 DiSTRUB. {t("footer.rights")}</p>
      </footer>
    </div>
  );
}
