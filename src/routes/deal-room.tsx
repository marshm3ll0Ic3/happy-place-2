import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, BadgeCheck, FileCheck2, Lock, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CountUp } from "@/components/AppChrome";
import { Bar, Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/deal-room")({
  head: () => ({
    meta: [
      { title: "Deal Room — DiSTRUB" },
      { name: "description", content: "Buy or rent audited creator communities and distribution channels, measured before they are listed." },
      { property: "og:title", content: "Deal Room — DiSTRUB" },
      { property: "og:description", content: "Buy or rent audited creator communities and distribution channels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DealRoom,
});

type D = { ch: string; name: string; kind: "sale" | "rent"; aud: number; profit: number; price: number; p: number; s: number; pt: number; g: number };
const DEALS: D[] = [
  { ch: "Newsletter + LinkedIn", name: "Growth Brief", kind: "sale", aud: 96000, profit: 11200, price: 268000, p: 91, s: 87, pt: 94, g: 14 },
  { ch: "YouTube + Discord", name: "Studio Nox", kind: "sale", aud: 412000, profit: 16800, price: 465000, p: 84, s: 82, pt: 96, g: 21 },
  { ch: "Instagram + Community", name: "Bloom Club", kind: "sale", aud: 184000, profit: 13900, price: 345000, p: 88, s: 90, pt: 91, g: 18 },
  { ch: "Instagram + Stories", name: "Bloom Distribution", kind: "rent", aud: 184000, profit: 8900, price: 6800, p: 90, s: 88, pt: 92, g: 18 },
  { ch: "Twitch + TikTok", name: "Frames Live Network", kind: "rent", aud: 412000, profit: 15100, price: 9400, p: 86, s: 80, pt: 97, g: 23 },
  { ch: "LinkedIn + Newsletter", name: "Founder Signal", kind: "rent", aud: 96000, profit: 12100, price: 5200, p: 94, s: 92, pt: 88, g: 12 },
];
const eur = (n: number) => `€${n.toLocaleString("en-US")}`;

function DealRoom() {
  const { t } = useT();
  const [f, setF] = useState<"all" | "sale" | "rent">("all");
  const [q, setQ] = useState("");
  const list = DEALS.filter((d) => (f === "all" || d.kind === f) && `${d.name} ${d.ch}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="pb-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16">
        <section className="relative overflow-hidden rounded-md border border-border bg-card">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="relative grid gap-10 p-6 md:grid-cols-[1.5fr_1fr] md:p-10">
            <div>
              <Eyebrow>{t("dr.eyebrow")}</Eyebrow>
              <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl">
                {t("dr.title1")}<br /><span className="text-muted-foreground">{t("dr.title2")}</span>
              </motion.h1>
              <p className="mt-5 max-w-lg text-muted-foreground">{t("dr.sub")}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[[FileCheck2, "dr.b1"], [Lock, "dr.b2"], [BadgeCheck, "dr.b3"]].map(([I, k]) => {
                  const Icon = I as typeof Lock;
                  return (
                    <span key={k as string} className="font-mono flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px]">
                      <Icon className="size-3.5 text-primary" /> {t(k as string)}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="relative rounded-md border border-border bg-background p-6">
              <span className="font-mono absolute -top-2.5 left-4 bg-card px-1.5 text-[10px] text-muted-foreground">IDX/TRUST</span>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">DiSTRUB Trust Index</p>
              <p className="font-mono tabular mt-4 text-6xl font-medium"><CountUp value={92} /><span className="text-lg text-muted-foreground">/100</span></p>
              <svg viewBox="0 0 80 24" preserveAspectRatio="none" className="mt-4 h-16 w-full text-primary-glow">
                <polyline points="0,20 12,17 22,18 34,12 46,14 58,8 70,9 80,3" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
              <p className="font-mono mt-3 text-xs text-yes">+4.8 {t("dr.quarter")}</p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-[1fr_1.3fr]">
          <p className="font-mono max-w-xs text-[11px] uppercase tracking-[0.1em] text-primary">{t("dr.side")}</p>
          <div>
            <h2 className="text-4xl font-semibold leading-[1] md:text-6xl">{t("dr.h2")}</h2>
            <p className="mt-4 text-muted-foreground">{t("dr.h2sub")}</p>
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex rounded-sm border border-border p-0.5">
            {(["all", "sale", "rent"] as const).map((k) => (
              <button key={k} onClick={() => setF(k)} className={`font-mono rounded-sm px-3 py-1.5 text-xs uppercase transition-colors ${f === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t(`dr.${k}`)}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("dr.search")} className="h-10 rounded-sm pl-9" />
          </div>
        </div>

        {list.length === 0 ? (
          <p className="mt-6 rounded-md border border-border p-10 text-center text-sm text-muted-foreground">{t("dr.none")}</p>
        ) : (
          <div className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-2">
            {list.map((d, i) => (
              <motion.article key={d.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex flex-col bg-background p-6 transition-colors hover:bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono flex size-9 items-center justify-center rounded-sm border border-border text-[11px] text-primary">{d.name.slice(0, 2).toUpperCase()}</span>
                    <div>
                      <p className="font-mono text-[10px] uppercase text-muted-foreground">{d.ch}</p>
                      <p className="flex items-center gap-1.5 font-semibold">{d.name} <ShieldCheck className="size-3.5 text-primary" /></p>
                    </div>
                  </div>
                  <span className={`font-mono rounded-sm border px-2 py-0.5 text-[10px] uppercase ${d.kind === "sale" ? "border-primary/50 text-primary" : "border-yes/40 text-yes"}`}>{t(`dr.${d.kind}`)}</span>
                </div>
                <div className="mt-5 grid grid-cols-3 divide-x divide-border rounded-sm border border-border">
                  {([["dr.aud", d.aud.toLocaleString("en-US")], ["dr.profit", eur(d.profit)], [d.kind === "sale" ? "dr.ask" : "dr.mrent", eur(d.price)]] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="p-3">
                      <p className="text-[10px] text-muted-foreground">{t(k)}</p>
                      <p className="font-mono tabular mt-1 text-sm">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-3">
                  <Bar label={t("s2.p")} v={d.p} />
                  <Bar label={t("s2.s")} v={d.s} />
                  <Bar label={t("s2.pt")} v={d.pt} />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-mono flex items-center gap-1.5 text-xs text-yes"><TrendingUp className="size-3.5" /> +{d.g}% {t("dr.growth")}</span>
                  <button onClick={() => toast(t("dr.soon"))} className="group flex items-center gap-1.5 text-xs font-medium">
                    {t("dr.open")} <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
