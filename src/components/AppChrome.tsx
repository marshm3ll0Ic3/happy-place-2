import { Link, useLocation } from "@tanstack/react-router";
import { motion, animate, useInView } from "framer-motion";
import { BarChart3, Gem, Megaphone, Wallet, User, Search, Globe, ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ru: "Русский",
};

export function LangDropdown() {
  const { lang, setLang, t } = useT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("lang")}
        className="glass flex h-9 items-center gap-2 rounded-sm px-3 font-mono text-[11px] uppercase text-foreground outline-none transition-colors hover:text-foreground data-[state=open]:border-primary/50"
      >
        <Globe className="size-3.5 text-muted-foreground" />
        <span>{lang}</span>
        <ChevronDown className="size-3 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48 rounded-sm border-border bg-popover p-1">
        <DropdownMenuRadioGroup value={lang} onValueChange={(v) => setLang(v as Lang)}>
          {(Object.keys(LANGS) as Lang[]).map((l) => (
            <DropdownMenuRadioItem
              key={l}
              value={l}
              className="flex h-9 gap-3 rounded-sm font-mono text-[11px] uppercase"
            >
              <span className="w-5 shrink-0">{l}</span>
              <span className="font-sans text-xs normal-case text-muted-foreground">{LANG_NAMES[l]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const LangSwitcher = LangDropdown;


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
    <header className="sticky top-0 z-40 hidden border-b border-border bg-background/95 backdrop-blur-xl lg:block">
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
          <LangDropdown />
          <AccountButton />
        </div>
      </div>
    </header>
  );
}

export function MobileTopBar() {
  const { t } = useT();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="flex h-14 items-center justify-between gap-2 px-4 md:h-16 md:px-6">
        <Logo />
        <div className="flex shrink-0 items-center gap-2">
          <LangDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger aria-label={t("nav.menu")} className="glass flex size-9 items-center justify-center rounded-sm outline-none">
              <Menu className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48 rounded-sm border-border bg-popover p-1">
              {DESKTOP_NAV.map((tab) => (
                <DropdownMenuItem key={tab.to} asChild className="h-10 rounded-sm text-sm">
                  <Link to={tab.to}>{t(tab.key)}</Link>
                </DropdownMenuItem>
              ))}
              {TABS.filter((x) => x.to !== "/markets").map((tab) => (
                <DropdownMenuItem key={tab.to} asChild className="hidden h-10 rounded-sm text-sm md:flex">
                  <Link to={tab.to}>{t(tab.key)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
