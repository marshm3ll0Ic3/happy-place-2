import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eyebrow } from "@/components/Eyebrow";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reach")({
  head: () => ({
    meta: [
      { title: "Reach — DiSTRUB" },
      { name: "description", content: "Book real reach from creators." },
      { property: "og:title", content: "Reach — DiSTRUB" },
      { property: "og:description", content: "Book real reach from creators." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Reach,
});

const OFFERS = [
  { h: "@lenaloops", p: "tiktok", n: "lifestyle", aud: 1240000, er: 6.1, price: 4200 },
  { h: "@quantkai", p: "youtube", n: "finance", aud: 380000, er: 4.4, price: 6800 },
  { h: "@pixelnora", p: "instagram", n: "beauty", aud: 920000, er: 3.2, price: 3900 },
  { h: "@devmarco", p: "x", n: "tech", aud: 210000, er: 2.7, price: 1500 },
  { h: "@frag.ayo", p: "tiktok", n: "gaming", aud: 2100000, er: 7.8, price: 5600 },
  { h: "@mintmira", p: "instagram", n: "finance", aud: 154000, er: 5.0, price: 2100 },
] as const;
const PLATS = ["all", "tiktok", "instagram", "youtube", "x"] as const;

function Reach() {
  const { t } = useT();
  const [plat, setPlat] = useState<(typeof PLATS)[number]>("all");
  const [sel, setSel] = useState(0);
  const [posts, setPosts] = useState(1);
  const list = useMemo(() => OFFERS.filter((o) => plat === "all" || o.p === plat), [plat]);
  const o = OFFERS[sel] ?? OFFERS[0];

  return (
    <main className="mx-auto max-w-6xl px-5 pb-28 pt-10 md:pb-16 md:pt-16">
      <Eyebrow>{t("r.eyebrow")}</Eyebrow>
      <h1 className="mt-4 text-4xl font-bold md:text-6xl">{t("r.title")}</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">{t("r.sub")}</p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
        {PLATS.map((k) => (
          <button key={k} onClick={() => setPlat(k)}
            className={`h-10 shrink-0 rounded-sm border px-3 font-mono text-[11px] uppercase ${plat === k ? "border-primary bg-primary/15" : "border-border text-muted-foreground"}`}>
            {k === "all" ? t("dr.all") : k}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((x) => {
            const i = OFFERS.indexOf(x);
            return (
              <li key={x.h}>
                <button onClick={() => setSel(i)}
                  className={`glass w-full rounded-sm p-4 text-left transition-colors ${sel === i ? "!border-primary" : ""}`}>
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <span className="truncate font-medium">{x.h}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase text-muted-foreground">{x.p}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t(`v.n.${x.n}`)}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs tabular">
                    <div><p className="text-[10px] text-muted-foreground">{t("r.aud")}</p>{(x.aud / 1000).toFixed(0)}K</div>
                    <div><p className="text-[10px] text-muted-foreground">{t("r.er")}</p>{x.er}%</div>
                    <div><p className="text-[10px] text-muted-foreground">{t("r.price")}</p>{x.price.toLocaleString()}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="glass h-fit rounded-sm p-5 lg:sticky lg:top-20">
          <p className="font-mono text-[11px] uppercase text-muted-foreground">{t("r.book")}</p>
          <p className="mt-2 text-xl font-bold">{o.h}</p>
          <p className="text-xs text-muted-foreground">{o.p} · {(o.aud / 1000).toFixed(0)}K</p>
          <p className="mt-5 text-xs text-muted-foreground">{t("r.posts")}</p>
          <div className="mt-2 flex items-center gap-2">
            {[1, 3, 5].map((n) => (
              <button key={n} onClick={() => setPosts(n)}
                className={`h-10 flex-1 rounded-sm border font-mono text-sm ${posts === n ? "border-primary bg-primary/15" : "border-border"}`}>{n}</button>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">{t("r.total")}</span>
            <span className="font-mono tabular">{(o.price * posts).toLocaleString()} DSC</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-muted-foreground">{t("r.estViews")}</span>
            <span className="font-mono tabular">{Math.round(o.aud * o.er / 100 * 4 * posts).toLocaleString()}</span>
          </div>
          <button onClick={() => toast(t("r.soon"))}
            className="mt-5 h-11 w-full rounded-sm bg-primary text-sm font-medium text-primary-foreground">{t("r.cta")}</button>
          <p className="mt-3 text-[11px] text-muted-foreground">{t("r.note")}</p>
        </aside>
      </div>
    </main>
  );
}
