import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  jsonLd?: object | null;
  lang?: "sv" | "fa";
  hreflangAlternateUrl?: string;
  siteName?: string;
  titleTemplate?: string;
  defaultTitle?: string;
  twitterHandle?: string;
  twitterCardType?: string;
  googleVerification?: string;
  bingVerification?: string;
  googleAnalyticsId?: string;
  canonicalBaseUrl?: string;
}

function resolveTitle(
  title: string | undefined,
  titleTemplate: string,
  siteName: string,
  defaultTitle: string
): string {
  if (!title) return defaultTitle;
  return titleTemplate
    .replace("{page_title}", title)
    .replace("{site_name}", siteName);
}

export default function SeoHead({
  title,
  description,
  ogImage,
  ogUrl,
  ogType = "website",
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  jsonLd,
  lang = "sv",
  hreflangAlternateUrl,
  siteName = "Kanon",
  titleTemplate = "{page_title} | {site_name}",
  defaultTitle = "Kanon - Kultur, utbildning och sport",
  twitterHandle = "",
  twitterCardType = "summary_large_image",
  googleVerification = "",
  bingVerification = "",
  googleAnalyticsId = "",
  canonicalBaseUrl = "https://kanon.app",
}: SeoHeadProps) {
  const resolvedTitle = resolveTitle(title, titleTemplate, siteName, defaultTitle);
  const canonUrl = canonicalUrl || canonicalBaseUrl;
  const ogUrlFinal = ogUrl || canonUrl;
  const dir = lang === "fa" ? "rtl" : "ltr";
  const robotsParts: string[] = [];
  robotsParts.push(noIndex ? "noindex" : "index");
  robotsParts.push(noFollow ? "nofollow" : "follow");
  const robotsContent = robotsParts.join(", ");

  const oppositeLang = lang === "sv" ? "fa" : "sv";

  return (
    <Helmet>
      <html lang={lang} dir={dir} />
      <title>{resolvedTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonUrl} />
      <meta name="robots" content={robotsContent} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:url" content={ogUrlFinal} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={resolvedTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* Verification tokens */}
      {googleVerification && (
        <meta name="google-site-verification" content={googleVerification} />
      )}
      {bingVerification && (
        <meta name="msvalidate.01" content={bingVerification} />
      )}

      {/* hreflang */}
      <link rel="alternate" hrefLang={lang} href={canonUrl} />
      {hreflangAlternateUrl && (
        <link rel="alternate" hrefLang={oppositeLang} href={hreflangAlternateUrl} />
      )}
      <link rel="alternate" hrefLang="x-default" href={`${canonicalBaseUrl}/sv/topics`} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {/* Google Analytics */}
      {googleAnalyticsId && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
        />
      )}
      {googleAnalyticsId && (
        <script>{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${googleAnalyticsId}');
        `}</script>
      )}
    </Helmet>
  );
}
