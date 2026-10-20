import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/value")({
  head: () => ({
    meta: [
      { title: "Value — DiSTRUB" },
      { name: "description", content: "Get an estimated valuation of your audience." },
      { property: "og:title", content: "Value — DiSTRUB" },
      { property: "og:description", content: "Get an estimated valuation of your audience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Value,
});

const PLATFORMS = { tiktok: 9, instagram: 12, youtube: 22, x: 6 } as const;
const NICHES = { finance: 1.8, tech: 1.5, beauty: 1.2, gaming: 1.0, lifestyle: 0.9 } as const;
type P = keyof typeof PLATFORMS;
type N = keyof typeof NICHES;

export function estimate(followers: number, engagement: number, p: P, n: N) {
  const post = Math.round((followers / 1000) * PLATFORMS[p] * NICHES[n] * Math.min(Math.max(engagement, 0.2), 20) / 3);
  const yearly = post * 52;
  return { post, low: Math.round(yearly * 0.75), high: Math.round(yearly * 1.25) };
}

const fmt = (n: number) => "$" + n.toLocaleString();

function Value() {
  const { t } = useT();
  const [p, setP] = useState<P>("instagram");
  const [n, setN] = useState<N>("lifestyle");
  const [followers, setFollowers] = useState(50000);
  const [eng, setEng] = useState(3);
  const r = estimate(followers, eng, p, n);
  const chip = (on: boolean) =>
    `h-10 rounded-sm border px-3 font-mono text-[11px] uppercase transition-colors ${on ? "border-primary bg-primary/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`;

  return (
    <main className="mx-auto max-w-6xl px-5 pb-28 pt-10 md:pb-16 md:pt-16">
      <Eyebrow>{t("v.eyebrow")}</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold md:text-6xl">{t("v.title")}</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("v.sub")}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <section className="glass space-y-6 rounded-sm p-5 md:p-6">
          <div>
            <p className="mb-2 text-xs text-muted-foreground">{t("v.platform")}</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PLATFORMS) as P[]).map((k) => (
                <button key={k} className={chip(p === k)} onClick={() => setP(k)}>{k}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-muted-foreground">{t("v.niche")}</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(NICHES) as N[]).map((k) => (
                <button key={k} className={chip(n === k)} onClick={() => setN(k)}>{t(`v.n.${k}`)}</button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="flex justify-between text-xs text-muted-foreground">
              {t("v.followers")} <span className="font-mono tabular text-foreground">{followers.toLocaleString()}</span>
            </span>
            <input type="range" min={1000} max={5000000} step={1000} value={followers}
              onChange={(e) => setFollowers(+e.target.value)} className="mt-3 w-full accent-primary" />
          </label>
          <label className="block">
            <span className="flex justify-between text-xs text-muted-foreground">
              {t("v.engagement")} <span className="font-mono tabular text-foreground">{eng.toFixed(1)}%</span>
            </span>
            <input type="range" min={0.2} max={20} step={0.1} value={eng}
              onChange={(e) => setEng(+e.target.value)} className="mt-3 w-full accent-primary" />
          </label>
        </section>

        <section className="glass flex flex-col rounded-sm p-5 md:p-6">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">{t("v.range")}</p>
          <p className="font-display mt-2 break-words text-3xl font-bold tabular md:text-5xl">
            {fmt(r.low)} – {fmt(r.high)}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-px bg-border">
            {[
              [t("v.perPost"), fmt(r.post)],
              [t("v.perMonth"), fmt(r.post * 4)],
              [t("v.cpm"), "$" + (PLATFORMS[p] * NICHES[n]).toFixed(1)],
              [t("v.engScore"), eng >= 5 ? "A" : eng >= 2.5 ? "B" : "C"],
            ].map(([k, v]) => (
              <div key={k} className="bg-card p-4">
                <p className="text-[11px] text-muted-foreground">{k}</p>
                <p className="font-mono mt-1 text-lg tabular">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{t("v.note")}</p>
          <Link to="/reach" className="mt-auto flex h-11 items-center justify-center rounded-sm bg-primary text-sm font-medium text-primary-foreground [margin-top:1.5rem]">
            {t("v.cta")}
          </Link>
        </section>
      </div>
    </main>
  );
}
