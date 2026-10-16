import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import es from "@/locales/es.json";
import ru from "@/locales/ru.json";

export const LANGS = { en, fr, es, ru } as const;
export type Lang = keyof typeof LANGS;
type Dict = Record<string, string>;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    const nav = navigator.language.slice(0, 2) as Lang;
    const l = saved && saved in LANGS ? saved : nav in LANGS ? nav : "en";
    setLangState(l);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    localStorage.setItem("lang", l);
    setLangState(l);
  };
  const t = (k: string) => (LANGS[lang] as Dict)[k] ?? (en as Dict)[k] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);
