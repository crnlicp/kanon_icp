import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "./translations";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "rtl" | "ltr";
  isRtl: boolean;
  localized: (fa: string, sv: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("kanon-lang");
    return (saved === "fa" || saved === "sv") ? saved : "sv";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("kanon-lang", newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key],
    [lang]
  );

  const dir = lang === "fa" ? "rtl" : "ltr";
  const isRtl = lang === "fa";

  const localized = useCallback(
    (fa: string, sv: string) => (lang === "fa" ? fa : sv),
    [lang]
  );

  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang === "fa" ? "fa-IR" : "sv-SE");
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir, isRtl, localized }}>
      {children}
    </I18nContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
