import { Link, useLocation } from "@tanstack/react-router";
import { motion, animate, useInView } from "framer-motion";
import { BarChart3, Gem, Megaphone, Wallet, User, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-sm bg-primary font-display text-base font-bold text-primary-foreground">
        D
      </span>
      <span className="leading-none">
        <span className="font-display block text-sm font-bold tracking-tight">DISTRUB</span>
        <span className="block text-[10px] text-muted-foreground">The attention exchange</span>
      </span>
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
      className="glass h-11 rounded-sm bg-transparent px-3 text-sm uppercase text-foreground"
    >
      {Object.keys(LANGS).map((l) => (
        <option key={l} value={l} className="bg-popover">
          {l}
        </option>
      ))}
    </select>
  );
}

function LangChips() {
  const { lang, setLang } = useT();
  return (
    <div className="glass flex rounded-sm p-0.5">
      {(Object.keys(LANGS) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`h-8 rounded-sm px-2.5 text-[11px] uppercase transition-colors ${
            lang === l ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

const DESKTOP_NAV = [
  { to: "/markets", key: "nav.markets" },
  { to: "/portfolio", key: "nav.portfolio" },
  { to: "/deal-room", key: "nav.dealRoom" },
  { to: "/community", key: "nav.community" },
  { to: "/school", key: "nav.school" },
] as const;

export function TopNav() {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur-xl md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo />
        <nav className="flex gap-1">
          {DESKTOP_NAV.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "bg-secondary !text-foreground" }}
            >
              {t(tab.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/markets" aria-label={t("nav.search")} className="glass flex size-9 items-center justify-center rounded-sm">
            <Search className="size-4 text-muted-foreground" />
          </Link>
          <LangChips />
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
                  className="absolute top-0 h-0.5 w-8 rounded-sm bg-primary"
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

function AccountButton() {
  const { t } = useT();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (signedIn === null) return <div className="h-9 w-40" />;
  if (signedIn)
    return (
      <Link to="/wallet" className="flex h-9 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground">
        {t("nav.wallet")}
      </Link>
    );
  return (
    <>
      <Link to="/auth" className="flex h-9 items-center rounded-sm px-3 text-sm text-foreground">
        {t("nav.signIn")}
      </Link>
      <a href="/#founding" className="flex h-9 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground">
        {t("nav.earlyAccess")}
      </a>
    </>
  );
}
