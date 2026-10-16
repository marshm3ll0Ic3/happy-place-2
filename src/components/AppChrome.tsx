import { Link, useLocation } from "@tanstack/react-router";
import { motion, animate, useInView } from "framer-motion";
import { BarChart3, Gem, Megaphone, Wallet, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useT, LANGS, type Lang } from "@/lib/i18n";

export const TABS = [
  { to: "/markets", key: "nav.markets", icon: BarChart3 },
  { to: "/value", key: "nav.value", icon: Gem },
  { to: "/reach", key: "nav.reach", icon: Megaphone },
  { to: "/wallet", key: "nav.wallet", icon: Wallet },
  { to: "/profile", key: "nav.profile", icon: User },
] as const;

export function Logo() {
  return (
    <Link to="/" className="font-display text-xl font-bold tracking-tight">
      Di<span className="text-primary">STRUB</span>
    </Link>
  );
}

export function LangSwitcher() {
  const { lang, setLang, t } = useT();
  return (
    <select
      aria-label={t("lang")}
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="glass h-11 rounded-full bg-transparent px-3 text-sm uppercase text-foreground"
    >
      {Object.keys(LANGS).map((l) => (
        <option key={l} value={l} className="bg-popover">
          {l}
        </option>
      ))}
    </select>
  );
}

export function TopNav() {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Logo />
        <nav className="flex gap-1">
          {TABS.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary !text-foreground" }}
            >
              {t(tab.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <AccountButton />
        </div>
      </div>
    </header>
  );
}

export function BottomTabs() {
  const { t } = useT();
  const { pathname } = useLocation();
  return (
    <nav className="glass safe-bottom fixed inset-x-0 bottom-0 z-50 border-x-0 border-b-0 bg-background/80 md:hidden">
      <div className="flex">
        {TABS.map(({ to, key, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="relative flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-[11px]"
            >
              {active && (
                <motion.span
                  layoutId="tab-glow"
                  className="glow absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                />
              )}
              <Icon className={active ? "size-5 text-primary" : "size-5 text-muted-foreground"} />
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className={`tabular ${className ?? ""}`}>
      {n.toLocaleString()}
    </span>
  );
}
