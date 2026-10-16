import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Gem, Megaphone, Gavel, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function Spark({ up }: { up: boolean }) {
  const pts = up ? "0,18 10,14 20,15 30,9 40,10 50,4 60,2" : "0,4 10,6 20,5 30,11 40,10 50,15 60,17";
  return (
    <svg viewBox="0 0 60 20" className={`h-5 w-14 ${up ? "text-yes" : "text-no"}`}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
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
  return (
    <div className="pb-24 md:pb-0">
      <section className="relative overflow-hidden">
        <div className="mesh pointer-events-none absolute -inset-20" />
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5 pb-20 pt-20 text-center md:pt-32">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
          >
            <span className="size-1.5 animate-pulse rounded-full bg-yes" /> {t("hero.badge")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-5xl font-bold leading-[0.95] md:text-8xl"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg" className="glow h-14 rounded-2xl px-8 text-base active:scale-95">
              <Link to="/value">{t("hero.ctaValue")} <ArrowRight /></Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-14 rounded-2xl px-8 text-base active:scale-95">
              <Link to="/markets">{t("hero.ctaExplore")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-border py-3">
        <div className="marquee flex w-max gap-8">
          {[...TICKER, ...TICKER].map(([m, p], i) => (
            <div key={i} className="flex items-center gap-3 text-sm whitespace-nowrap">
              <span className="text-muted-foreground">{m}</span>
              <span className={`tabular font-display font-bold ${p >= 50 ? "text-yes" : "text-no"}`}>{p}%</span>
              <Spark up={p >= 50} />
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-5 py-20">
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
              <Icon className="size-6 text-primary" />
              <h3 className="mt-4 text-xl font-bold">{t(`feat.${k}.t`)}</h3>
              <p className="mt-2 text-muted-foreground">{t(`feat.${k}.d`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-5 py-10 text-center text-sm text-muted-foreground">
        <p className="font-display text-lg font-bold text-foreground">DiSTRUB</p>
        <p className="mt-2">{t("footer.legal")}</p>
        <p className="mt-1">© 2026 DiSTRUB. {t("footer.rights")}</p>
      </footer>
    </div>
  );
}
