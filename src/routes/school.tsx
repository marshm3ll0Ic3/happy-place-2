import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock, GraduationCap, Radio, Sparkles, Users } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/school")({
  head: () => ({
    meta: [
      { title: "DiSTRUB School — Learn digital M&A" },
      { name: "description", content: "Learn to create, operate, acquire and resell profitable attention businesses." },
      { property: "og:title", content: "DiSTRUB School — Learn digital M&A" },
      { property: "og:description", content: "Programs, bootcamps and coaching for buying and operating digital distribution." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: School,
});

const PROGRAMS = [
  { id: "p1", Icon: GraduationCap },
  { id: "p2", Icon: Sparkles },
  { id: "p3", Icon: Radio },
];

function School() {
  const { t } = useT();
  const soon = () => toast(t("sch.soon"));
  return (
    <div className="pb-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16">
        <section className="relative overflow-hidden rounded-md border border-border bg-card">
          <div className="grid-bg pointer-events-none absolute inset-0" />
          <div className="relative p-6 md:p-12">
            <Eyebrow>{t("sch.eyebrow")}</Eyebrow>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-5xl font-semibold leading-[0.95] md:text-8xl">
              {t("sch.title")}
            </motion.h1>
            <p className="mt-6 max-w-xl text-muted-foreground">{t("sch.sub")}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {([[Users, "sch.b1"], [BookOpen, "sch.b2"], [CalendarDays, "sch.b3"]] as const).map(([Icon, k]) => (
                <span key={k} className="font-mono flex items-center gap-1.5 rounded-sm border border-border bg-background px-2.5 py-1 text-[11px]">
                  <Icon className="size-3.5 text-primary" /> {t(k)}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-[1fr_2fr]">
          <p className="font-mono max-w-xs text-[11px] uppercase tracking-[0.1em] text-primary">{t("sch.side")}</p>
          <h2 className="text-4xl font-semibold leading-[1] md:text-6xl">{t("sch.h2")}</h2>
        </section>

        <section className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {PROGRAMS.map(({ id, Icon }, i) => (
            <div key={id} className="group flex flex-col bg-card p-6 transition-colors hover:bg-secondary/40">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-sm border border-border bg-background text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{t(`sch.${id}.dur`)}</span>
              </div>
              <p className="font-mono mt-8 text-xs text-primary">0{i + 1}</p>
              <h3 className="mt-2 text-2xl font-semibold">{t(`sch.${id}.t`)}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t(`sch.${id}.d`)}</p>
              <ul className="mt-6 space-y-2.5">
                {["a", "b", "c"].map((k) => (
                  <li key={k} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-yes" /> {t(`sch.${id}.${k}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="mb-4" />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-mono flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {t(`sch.${id}.m`)}
                </span>
                <button onClick={soon} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  {t("sch.view")} <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-14 flex flex-col gap-6 rounded-md border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{t("sch.ctaEy")}</p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{t("sch.ctaT")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("sch.ctaS")}</p>
          </div>
          <Link to="/" hash="founding" className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            {t("sch.cta")} <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
