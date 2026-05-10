import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { SeoSettings } from "../backend/api/backend";

const DEFAULT_SEO: SeoSettings = {
  siteName: "Kanon",
  titleTemplate: "{page_title} | {site_name}",
  defaultTitle: "Kanon - Kultur, utbildning och sport",
  defaultDescription: "",
  defaultOgImage: "",
  twitterHandle: "",
  twitterCardType: "summary_large_image",
  googleVerification: "",
  bingVerification: "",
  canonicalBaseUrl: "https://kanon.app",
  defaultLang: "sv",
  googleAnalyticsId: "",
  robotsTxtExtra: "",
};

interface SeoSettingsContextValue {
  seoSettings: SeoSettings;
}

const SeoSettingsContext = createContext<SeoSettingsContextValue>({ seoSettings: DEFAULT_SEO });

export function SeoSettingsProvider({ children }: { children: ReactNode }) {
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(DEFAULT_SEO);

  useEffect(() => {
    import("../actor").then(({ backend }) => {
      backend.getSeoSettings().then(setSeoSettings).catch(() => {});
    });
  }, []);

  return (
    <SeoSettingsContext.Provider value={{ seoSettings }}>
      {children}
    </SeoSettingsContext.Provider>
  );
}

export function useSeoSettingsContext() {
  return useContext(SeoSettingsContext);
}
