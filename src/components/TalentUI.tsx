import { Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copy, useTalentCopy } from "@/lib/talent-copy";
import type { Talent } from "@/lib/talents";
import { programmeDay } from "@/lib/programme";
import { DEMO_AS_OF } from "@/lib/talents";

export function DemoNotice() {
  const { text } = useTalentCopy();
  return <p className="flex items-start gap-2 border-y border-border bg-secondary px-4 py-3 font-mono text-xs text-muted-foreground"><FlaskConical className="mt-0.5 size-3.5 shrink-0 text-primary" />{text(copy.demo)}</p>;
}

export function TalentCard({ talent }: { talent: Talent }) {
  const { text, money } = useTalentCopy();
  return <article className="flex min-w-0 flex-col rounded-md border border-border bg-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-xs text-primary">{text(copy[talent.status])}</span><span className="font-mono text-xs text-muted-foreground">{talent.start ? `${programmeDay(talent.start, DEMO_AS_OF)} / 365` : "— / 365"}</span></div>
    <h3 className="mt-5 text-2xl font-semibold">{talent.alias}</h3><p className="mt-2 min-h-12 text-sm text-muted-foreground">{text(talent.skill)}</p>
    <div className="mt-6 flex flex-wrap justify-between gap-2 text-xs"><span>{text(copy.received)}</span><span className="font-mono tabular">{money(talent.received)} / {money(6000)}</span></div>
    <progress className="mt-2 h-1.5 w-full accent-primary" value={talent.received} max={6000} aria-label={text(copy.received)} />
    <p className="mt-3 text-xs text-muted-foreground">{text(copy.estimate)}: <span className="font-mono text-foreground">{talent.probability}%</span></p>
    <Button asChild variant="outline" className="mt-6 w-full justify-between"><Link to="/talents/$slug" params={{ slug: talent.slug }} search={prev=>({...prev,section:"overview"})}>{text(copy.view)}<ArrowRight /></Link></Button>
  </article>;
}

export function TalentPageHeading({ title, description }: { title: string; description: string }) {
  return <header className="mb-8"><p className="font-mono text-xs uppercase text-primary">DiSTRUB / 365</p><h1 className="mt-4 break-words text-4xl font-semibold leading-tight md:text-5xl">{title}</h1><p className="mt-4 max-w-2xl text-muted-foreground">{description}</p></header>;
}