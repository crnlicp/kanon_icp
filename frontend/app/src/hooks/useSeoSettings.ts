import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSeoSettingsContext } from "../contexts/SeoSettingsContext";
import type { PageSeoOverride } from "../backend/api/backend";

export interface ResolvedSeoProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  jsonLd?: object | null;
  lang: "sv" | "fa";
  siteName: string;
  titleTemplate: string;
  defaultTitle: string;
  twitterHandle: string;
  twitterCardType: string;
  googleVerification: string;
  bingVerification: string;
  canonicalBaseUrl: string;
  googleAnalyticsId: string;
}

function detectLang(pathname: string): "sv" | "fa" {
  if (pathname.startsWith("/fa/") || pathname === "/fa") return "fa";
  return "sv";
}

function buildAlternateUrl(pathname: string, canonicalBase: string): string {
  const lang = detectLang(pathname);
  const opposite = lang === "sv" ? "fa" : "sv";
  const swapped = pathname.replace(/^\/(sv|fa)(\/|$)/, `/${opposite}$2`);
  return `${canonicalBase}${swapped || "/"}`;
}

export function useSeoSettings(overrides?: {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  jsonLd?: object | null;
}): ResolvedSeoProps & { hreflangAlternateUrl: string } {
  const { seoSettings } = useSeoSettingsContext();
  const location = useLocation();
  const [pageOverride, setPageOverride] = useState<PageSeoOverride | null>(null);

  const slug = location.pathname.replace(/^\//, "");

  useEffect(() => {
    if (!slug) { setPageOverride(null); return; }
    import("../actor").then(({ backend }) => {
      backend.getPageSeoOverride(slug).then(setPageOverride).catch(() => setPageOverride(null));
    });
  }, [slug]);

  const lang = detectLang(location.pathname);
  const hreflangAlternateUrl = buildAlternateUrl(location.pathname, seoSettings.canonicalBaseUrl);

  const resolved: ResolvedSeoProps & { hreflangAlternateUrl: string } = {
    lang,
    hreflangAlternateUrl,
    siteName: seoSettings.siteName,
    titleTemplate: seoSettings.titleTemplate,
    defaultTitle: seoSettings.defaultTitle,
    twitterHandle: seoSettings.twitterHandle,
    twitterCardType: seoSettings.twitterCardType,
    googleVerification: seoSettings.googleVerification,
    bingVerification: seoSettings.bingVerification,
    canonicalBaseUrl: seoSettings.canonicalBaseUrl,
    googleAnalyticsId: seoSettings.googleAnalyticsId,

    title: overrides?.title || (pageOverride?.title || undefined),
    description: overrides?.description || pageOverride?.description || seoSettings.defaultDescription || undefined,
    ogImage: overrides?.ogImage || pageOverride?.ogImage || seoSettings.defaultOgImage || undefined,
    canonicalUrl: overrides?.canonicalUrl || pageOverride?.canonicalUrl || `${seoSettings.canonicalBaseUrl}${location.pathname}`,
    noIndex: overrides?.noIndex ?? pageOverride?.noIndex ?? false,
    noFollow: overrides?.noFollow ?? pageOverride?.noFollow ?? false,
    jsonLd: overrides?.jsonLd !== undefined ? overrides.jsonLd : null,
  };

  return resolved;
}
