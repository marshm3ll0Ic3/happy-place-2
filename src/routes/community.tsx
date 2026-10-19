import { DemoNotice } from "@/components/TalentUI";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Award, BookOpen, Check, CheckCircle2, Crown, HelpCircle, MessageCircleQuestion, Plus, Search, ShieldCheck, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountUp } from "@/components/AppChrome";
import { Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — DiSTRUB" },
      { name: "description", content: "Legacy community preview with fictional circles and sample reputation. Research participation is not yet available." },
      { property: "og:title", content: "Community — DiSTRUB" },
      { property: "og:description", content: "Fictional community and reputation preview; no real verification claimed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Community,
});

const CIRCLES = [
  { n: "Creator Growth", d: "Audience strategy, retention and repeatable growth loops.", m: 1281, q: 343 },
  { n: "Short-form Video", d: "Hooks, formats and distribution for high-retention short video.", m: 949, q: 219 },
  { n: "Brand Deals", d: "Pricing, negotiation and campaign delivery with brands.", m: 712, q: 188 },
  { n: "Creator Finance", d: "Creator economics, cash flow and sustainable monetisation.", m: 294, q: 63 },
  { n: "Community Ops", d: "Moderation, rituals, retention and member operations.", m: 268, q: 58 },
  { n: "Solo Systems", d: "Practical systems for independent creators.", m: 241, q: 49 },
  { n: "Newsletters", d: "Writing, growth and sponsorships for email-first creators.", m: 533, q: 141 },
  { n: "Live Streaming", d: "Twitch, YouTube Live and real-time audience building.", m: 407, q: 97 },
  { n: "Digital M&A", d: "Valuing, buying and selling attention businesses.", m: 186, q: 72 },
];

function Community() {
  const { t } = useT();
  const [sel, setSel] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const list = CIRCLES.filter((c) => `${c.n} ${c.d}`.toLowerCase().includes(q.toLowerCase()));
  const step = sel.length ? 2 : 1;

  function toggle(n: string) {
    setSel((s) => {
      if (s.includes(n)) return s.filter((x) => x !== n);
      if (s.length >= 10) { toast(t("cm.max")); return s; }
      return [...s, n];
    });
  }
  const soon = () => toast(t("cm.discoverSoon"));

  return (
    <div className="pb-28 md:pb-16"><DemoNotice />
      <div className="mx-auto max-w-6xl px-5 pt-14 md:pt-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{t("cm.eyebrow")}</Eyebrow>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] md:text-7xl">
              {t("cm.title")}
            </motion.h1>
            <p className="mt-5 max-w-lg text-muted-foreground">{t("cm.sub")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 rounded-sm px-4" onClick={() => document.getElementById("circles")?.scrollIntoView({ behavior: "smooth" })}>{t("cm.edit")}</Button>
            <Button className="h-11 rounded-sm px-4" onClick={soon}><Plus /> {t("cm.askq")}</Button>
          </div>
        </div>

        <section className="relative mt-12 overflow-hidden rounded-md border border-border bg-card">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="relative grid items-center gap-8 p-6 md:grid-cols-[auto_1fr_auto] md:p-8">
            <div className="text-center md:border-r md:border-border md:pr-8">
              <span className="relative mx-auto flex size-14 items-center justify-center rounded-sm border border-border bg-background">
                <Users className="size-5 text-primary" />
                <span className="absolute -right-1 -top-1 size-2 animate-pulse bg-yes" />
              </span>
              <p className="font-mono mt-4 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{t("cm.holders")}</p>
              <p className="font-mono tabular mt-1 text-3xl font-medium"><CountUp value={3142} /></p>
              <p className="text-[11px] text-muted-foreground">{t("cm.holdersSub")}</p>
            </div>
            <div>
              <p className="font-mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-primary"><Crown className="size-3.5" /> {t("cm.season")}</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{t("cm.oneq")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("cm.oneqSub")}</p>
            </div>
            <Button variant="outline" className="h-11 rounded-sm px-4" onClick={soon}><CheckCircle2 /> {t("cm.verify")}</Button>
          </div>
        </section>

        <ol className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {["cm.s1", "cm.s2", "cm.s3"].map((k, i) => (
            <li key={k} className="flex items-center gap-3 bg-background px-5 py-3.5">
              <span className={`font-mono flex size-7 items-center justify-center rounded-sm border text-[11px] ${i + 1 <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>0{i + 1}</span>
              <span className={`text-sm ${i + 1 <= step ? "text-foreground" : "text-muted-foreground"}`}>{t(k)}</span>
            </li>
          ))}
        </ol>

        <section id="circles" className="mt-16 scroll-mt-24">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">{t("cm.choose")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("cm.chooseSub")}</p>
            </div>
            <span className="font-mono rounded-sm border border-border px-3 py-1.5 text-xs text-primary">{sel.length}/10</span>
          </div>
          <div className="relative mt-5">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("cm.search")} className="h-11 rounded-sm pl-9" />
          </div>
          <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => {
              const on = sel.includes(c.n);
              return (
                <button key={c.n} onClick={() => toggle(c.n)} aria-pressed={on} className={`flex gap-3 p-5 text-left transition-colors ${on ? "bg-card" : "bg-background hover:bg-card"}`}>
                  <span className={`font-mono flex size-9 shrink-0 items-center justify-center rounded-sm border text-[11px] ${on ? "border-primary bg-primary text-primary-foreground" : "border-border text-primary"}`}>
                    {on ? <Check className="size-4" /> : c.n.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 font-semibold">{c.n} <ShieldCheck className="size-3.5 text-primary" /></span>
                    <span className="mt-1 block text-xs text-muted-foreground">{c.d}</span>
                    <span className="font-mono mt-3 flex gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="size-3" /> {c.m.toLocaleString("en-US")}</span>
                      <span className="flex items-center gap-1"><MessageCircleQuestion className="size-3" /> {c.q}</span>
                    </span>
                  </span>
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-sm border ${on ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                    {on ? <Check className="size-3" /> : <Plus className="size-3" />}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="sticky bottom-20 z-10 mx-auto mt-6 flex max-w-2xl items-center justify-between gap-4 rounded-md border border-border bg-card p-4 md:bottom-4">
            <p className="text-sm text-muted-foreground">{sel.length ? `${sel.length} ${t("cm.ready")}` : t("cm.lock")}</p>
            <Button disabled={!sel.length} className="h-10 shrink-0 rounded-sm" onClick={soon}>{t("cm.discover")} <ArrowRight /></Button>
          </div>
        </section>

        <div className="mt-10 flex items-start gap-4 rounded-md border border-border p-6">
          <HelpCircle className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">{t("cm.feed")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("cm.feedSub")}</p>
          </div>
        </div>

        <section className="mt-6 grid items-center gap-6 rounded-md border border-border bg-card p-6 md:grid-cols-[1.2fr_1.5fr_auto] md:p-8">
          <div>
            <p className="font-mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-primary"><Trophy className="size-3.5" /> {t("cm.rep")}</p>
            <h2 className="mt-3 text-2xl font-semibold">{t("cm.repTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("cm.repSub")}</p>
          </div>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-border bg-border">
            {[[Award, "Ask 10", 100], [BookOpen, "Curious", 250], [ShieldCheck, "Trusted", 500]].map(([I, n, xp]) => {
              const Icon = I as typeof Award;
              return (
                <div key={n as string} className="min-w-0 bg-background p-3 sm:p-4">
                  <Icon className="size-4 text-primary" />
                  <p className="font-mono mt-3 break-words text-[10px] uppercase sm:text-[11px]">{n as string}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">+{xp as number} XP</p>
                </div>
              );
            })}
          </div>
          <Button variant="outline" className="h-11 rounded-sm px-4" onClick={soon}>{t("cm.progress")} <ArrowRight /></Button>
        </section>
      </div>
    </div>
  );
}
