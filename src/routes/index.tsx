import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight, BarChart3, Radio, Gavel, Sparkles, GraduationCap, CheckCircle2, Users, ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountUp } from "@/components/AppChrome";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DiSTRUB — The attention exchange" },
      { name: "description", content: "Measure attention across search, social and streaming, back creators, rent distribution and acquire audited communities." },
      { property: "og:title", content: "DiSTRUB — The attention exchange" },
      { property: "og:description", content: "Measure attention, back creators, rent distribution and acquire audited communities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const TICKER = [
  ["@MayaBloom", 12.4], ["@NoahTrance", 8.1], ["@LunaLoops", -3.2], ["@AlexBuilds", 5.7],
  ["@StudioNox", 2.9], ["@KaiCooks", -1.4], ["@RexPlays", 9.6], ["@SoraTravel", 4.3],
] as const;

function Spark({ up = true, className = "h-8 w-full" }: { up?: boolean; className?: string }) {
  const pts = up ? "0,22 12,18 22,20 34,12 46,14 58,6 70,8 80,2" : "0,4 12,8 22,6 34,14 46,12 58,18 70,16 80,22";
  return (
    <svg viewBox="0 0 80 24" preserveAspectRatio="none" className={`${className} ${up ? "text-primary" : "text-no"}`}>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Eyebrow({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "cream" }) {
  return (
    <p className={`font-mono flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] ${tone === "cream" ? "text-cream-muted" : "text-muted-foreground"}`}>
      <span className={tone === "cream" ? "text-cream-foreground" : "text-primary"}>[</span>
      {children}
      <span className={tone === "cream" ? "text-cream-foreground" : "text-primary"}>]</span>
    </p>
  );
}

function Reveal({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.08, duration: 0.45 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Landing() {
  return (
    <div className="pb-24 md:pb-0">
      <Hero />
      <Ticker />
      <HowItWorks />
      <TrustSection />
      <AssetSection />
      <SchoolSection />
      <FoundingSection />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Hero() {
  const { t } = useT();
  const stats = [
    { k: "h.statCreators", v: 28416 },
    { k: "h.statVolume", v: 42400000 },
    { k: "h.statReach", v: 64000000 },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="mesh pointer-events-none absolute -inset-20 opacity-80" />
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-28">
        <div className="grid items-center gap-10 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Eyebrow>{t("h.eyebrow")}</Eyebrow>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 text-5xl font-semibold leading-[0.95] md:text-7xl lg:text-[5.75rem]"
            >
              {t("hero.title")}
            </motion.h1>
            <p className="mt-6 max-w-md text-muted-foreground">{t("h.sub")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-12 rounded-sm px-6 active:scale-95">
                <Link to="/markets">
                  <BarChart3 /> {t("h.cta1")} <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-sm px-4 text-muted-foreground">
                <Link to="/community">
                  <Users /> {t("h.cta2")}
                </Link>
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hairline relative rounded-md bg-card p-6"
          >
            <span className="font-mono absolute -top-2.5 left-4 bg-background px-1.5 text-[10px] text-muted-foreground">SIG/@MAYABLOOM</span>
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
              <span className="text-muted-foreground">{t("h.signal")}</span>
              <span className="flex items-center gap-1.5 text-yes">
                <span className="size-1.5 animate-pulse rounded-full bg-yes" /> {t("h.live")}
              </span>
            </div>
            <p className="font-mono tabular mt-5 text-7xl font-medium tracking-tight">84.7</p>
            <p className="mt-1 text-xs text-yes">+5.4% {t("h.week")}</p>
            <Spark className="mt-6 h-24 w-full" />
          </motion.div>
        </div>

        <div className="hairline bg-card mt-14 grid grid-cols-3 divide-x divide-border rounded-md">
          {stats.map((s) => (
            <div key={s.k} className="p-4 md:p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground md:text-[11px]">{t(s.k)}</p>
              <p className="font-mono tabular mt-2 text-lg font-medium md:text-3xl">
                <CountUp value={s.v} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const { t } = useT();
  return (
    <div className="flex items-center overflow-hidden border-y border-border bg-background">
      <span className="z-10 flex shrink-0 items-center gap-1.5 border-r border-border bg-background px-4 py-3 font-mono text-[11px] uppercase tracking-[0.1em] text-primary">
        <span className="size-1.5 animate-pulse bg-primary" /> {t("h.trending")}
      </span>
      <div className="overflow-hidden">
        <div className="marquee flex w-max gap-10 py-3 pl-6">
          {[...TICKER, ...TICKER].map(([h, d], i) => (
            <span key={i} className="font-mono flex items-center gap-2 whitespace-nowrap text-xs">
              <span className="font-medium">{h}</span>
              <span className={`tabular text-xs ${d >= 0 ? "text-yes" : "text-no"}`}>
                {d >= 0 ? "▲" : "▼"} {Math.abs(d)}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const { t } = useT();
  const steps = ["a", "b", "c"];
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Eyebrow>{t("s1.eyebrow")}</Eyebrow>
      <h2 className="mt-4 text-4xl font-semibold leading-[1] md:text-6xl">{t("s1.title")}</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("s1.sub")}</p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        {steps.map((k, i) => (
          <Reveal key={k} i={i} className="bg-background">
            <Link to="/markets" className="group flex h-full min-h-56 flex-col bg-background p-6 transition-colors hover:bg-card">
              <span className="font-mono tabular text-xs text-primary">0{i + 1}</span>
              <h3 className="mt-6 text-lg font-bold">{t(`s1.${k}.t`)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(`s1.${k}.d`)}</p>
              <ArrowRight className="mt-4 size-4 self-end text-primary-transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  const { t } = useT();
  const bars = [
    { k: "s2.p", v: 91 },
    { k: "s2.s", v: 87 },
    { k: "s2.pt", v: 94 },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border">
      <div className="mesh pointer-events-none absolute -left-1/3 top-0 h-full w-2/3 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <div>
          <Eyebrow>{t("s2.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-4xl font-semibold leading-[1] md:text-6xl">{t("s2.title")}</h2>
          <p className="mt-4 max-w-lg text-muted-foreground">{t("s2.sub")}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {bars.map((b) => (
              <span key={b.k} className="hairline bg-card flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-mono text-xs">
                <CheckCircle2 className="size-3.5 text-yes" /> {t(b.k)}
              </span>
            ))}
          </div>
          <Button asChild className="mt-8 h-12 rounded-sm px-6 active:scale-95">
            <Link to="/deal-room">
              {t("s2.cta")} <ArrowRight />
            </Link>
          </Button>
        </div>
        <Reveal className="hairline bg-card rounded-md p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary">{t("s2.index")}</p>
          <p className="font-mono tabular mt-4 text-6xl font-medium">
            <CountUp value={92} />
            <span className="text-xl text-muted-foreground">/100</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t("s2.audit")}</p>
          <div className="mt-6 space-y-4">
            {bars.map((b) => (
              <div key={b.k}>
                <div className="flex justify-between text-xs">
                  <span>{t(b.k)}</span>
                  <span className="tabular text-muted-foreground">{b.v}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden bg-secondary">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: b.v / 100 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full origin-left bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function AssetSection() {
  const { t } = useT();
  const cards = [
    { k: "a", icon: Radio, to: "/reach" },
    { k: "b", icon: BarChart3, to: "/markets" },
    { k: "c", icon: Gavel, to: "/management" },
    { k: "d", icon: Sparkles, to: "/value" },
  ] as const;
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Eyebrow>{t("s3.eyebrow")}</Eyebrow>
      <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[1] md:text-6xl">{t("s3.title")}</h2>
      <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ k, icon: Icon, to }, i) => (
          <Reveal key={k} i={i} className="bg-background">
            <Link to={to} className="group flex h-full flex-col bg-background p-6 transition-colors hover:bg-card">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-sm border border-border">
                  <Icon className="size-4 text-primary" />
                </span>
                <span className="font-mono tabular text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-6 font-bold">{t(`s3.${k}.t`)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t(`s3.${k}.d`)}</p>
              <Spark up={i !== 1} className="mt-4 h-6 w-full opacity-70" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SchoolSection() {
  const { t } = useT();
  const items = ["a", "b", "c"];
  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="rounded-md bg-cream p-6 text-cream-foreground md:p-12">
        <div className="flex size-20 flex-col items-center justify-center rounded-md bg-background text-foreground">
          <GraduationCap className="size-5 text-primary" />
          <span className="font-display mt-1 text-center text-[10px] font-bold leading-tight">DISTRUB<br />SCHOOL</span>
        </div>
        <div className="mt-6">
          <Eyebrow tone="cream">{t("sc.eyebrow")}</Eyebrow>
        </div>
        <h2 className="mt-4 max-w-2xl text-3xl font-bold md:text-5xl">{t("sc.title")}</h2>
        <p className="mt-4 max-w-xl text-cream-muted">{t("sc.sub")}</p>
        <Button asChild className="mt-6 h-11 rounded-sm bg-background px-5 text-foreground hover:bg-background/90">
          <Link to="/school">
            {t("sc.cta")} <ArrowRight />
          </Link>
        </Button>
        <div className="mt-10 grid divide-y divide-cream-foreground/15 rounded-md border border-cream-foreground/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((k, i) => (
            <Link key={k} to="/school" className="group flex min-h-40 flex-col p-6">
              <span className="tabular text-xs text-cream-muted">0{i + 1}</span>
              <h3 className="mt-4 font-bold">{t(`sc.${k}.t`)}</h3>
              <p className="mt-2 flex-1 text-sm text-cream-muted">{t(`sc.${k}.d`)}</p>
              <ArrowRight className="mt-4 size-4 self-end transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundingSection() {
  const { t } = useT();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("creator");
  const [size, setSize] = useState("");
  const [busy, setBusy] = useState(false);
  const { data: counts } = useQuery({
    queryKey: ["founding-counts"],
    queryFn: async () => {
      const { data } = await supabase.rpc("founding_counts");
      return (data as { creators: number; buyers: number } | null) ?? { creators: 0, buyers: 0 };
    },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("founding_waitlist").insert({
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      role,
      audience_size: size.trim() || null,
    });
    setBusy(false);
    if (error) {
      toast.error(error.code === "23505" ? t("w.dup") : error.message);
      return;
    }
    toast.success(t("w.done"));
    setEmail("");
    setPhone("");
    setSize("");
    qc.invalidateQueries({ queryKey: ["founding-counts"] });
  }

  const left = [
    { icon: Users, v: Math.max(0, 100 - (counts?.creators ?? 0)), k: "w.creators" },
    { icon: ShoppingBag, v: Math.max(0, 500 - (counts?.buyers ?? 0)), k: "w.buyers" },
  ];

  return (
    <section id="founding" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
      <div className="hairline bg-card grid gap-10 rounded-md p-6 md:grid-cols-2 md:p-12">
        <div>
          <Eyebrow>{t("w.eyebrow")}</Eyebrow>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">{t("w.title")}</h2>
          <p className="mt-4 text-sm text-muted-foreground">{t("w.sub")}</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {left.map(({ icon: Icon, v, k }) => (
              <div key={k} className="rounded-md border border-border p-4">
                <Icon className="size-4 text-primary" />
                <p className="font-mono tabular mt-3 text-3xl font-medium">
                  <CountUp value={v} />
                </p>
                <p className="text-xs text-muted-foreground">{t(k)}</p>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="grid content-center gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-xs text-muted-foreground">
            {t("w.email")}
            <Input required type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="h-11 rounded-sm" />
          </label>
          <label className="space-y-1.5 text-xs text-muted-foreground">
            {t("w.phone")}
            <Input type="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33…" className="h-11 rounded-sm" />
          </label>
          <label className="space-y-1.5 text-xs text-muted-foreground">
            {t("w.role")}
            <select value={role} onChange={(e) => setRole(e.target.value)} className="h-11 w-full rounded-sm border border-input bg-transparent px-3 text-sm text-foreground">
              <option value="creator" className="bg-popover">{t("w.roleCreator")}</option>
              <option value="buyer" className="bg-popover">{t("w.roleBuyer")}</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs text-muted-foreground">
            {t("w.size")}
            <Input maxLength={40} value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 25k" className="h-11 rounded-sm" />
          </label>
          <Button disabled={busy} className="h-12 rounded-sm sm:col-span-2 active:scale-95">
            {t("w.submit")} <ArrowRight />
          </Button>
        </form>
      </div>
    </section>
  );
}

function FinalCta() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden px-5 py-24 text-center md:py-32">
      <div className="mesh pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-2/3 max-w-3xl opacity-50" />
      <div className="relative">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">DiSTRUB</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold leading-[1] md:text-6xl">{t("f.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("f.sub")}</p>
        <Button asChild className="mt-8 h-12 rounded-sm px-6 active:scale-95">
          <Link to="/deal-room">
            {t("s2.cta")} <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useT();
  const links = [
    { to: "/school", k: "nav.school" },
    { to: "/markets", k: "nav.markets" },
    { to: "/deal-room", k: "nav.dealRoom" },
    { to: "/wallet", k: "nav.wallet" },
  ] as const;
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary font-display text-xs font-bold text-primary-foreground">D</span>
          <span className="font-display font-bold text-foreground">DISTRUB</span>
          <span>{t("f.tag")}</span>
        </div>
        <nav className="flex gap-5">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground">
              {t(l.k)}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
