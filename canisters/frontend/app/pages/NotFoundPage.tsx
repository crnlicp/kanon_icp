import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import SeoHead from "../components/SeoHead";
import { useSeoSettingsContext } from "../contexts/SeoSettingsContext";
import { translations } from "../i18n/translations";

function detectLang(pathname: string): "sv" | "fa" {
  if (pathname.startsWith("/fa/") || pathname === "/fa") return "fa";
  return "sv";
}

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const lang = detectLang(pathname);
  const { seoSettings } = useSeoSettingsContext();
  const tr = translations[lang];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      dir={lang === "fa" ? "rtl" : "ltr"}
    >
      <SeoHead
        noIndex
        title="404"
        lang={lang}
        siteName={seoSettings.siteName}
        titleTemplate={seoSettings.titleTemplate}
        defaultTitle={seoSettings.defaultTitle}
        twitterHandle={seoSettings.twitterHandle}
        twitterCardType={seoSettings.twitterCardType}
        googleVerification={seoSettings.googleVerification}
        bingVerification={seoSettings.bingVerification}
        googleAnalyticsId={seoSettings.googleAnalyticsId}
        canonicalBaseUrl={seoSettings.canonicalBaseUrl}
      />

      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-8xl font-bold text-primary/30 mb-6">404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-glow">
          {tr.notFoundHeading}
        </h1>
        <p className="text-white/50 mb-10">{tr.notFoundSubtext}</p>
        <Link
          to={`/${lang}/topics`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors"
        >
          {tr.backToTopics}
        </Link>
      </motion.div>
    </div>
  );
}
