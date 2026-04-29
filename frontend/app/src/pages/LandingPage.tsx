import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import WavingFlag from "../components/WavingFlag";
import { useEffect, useState } from "react";
import type { SiteSettingsReturn } from "../backend/api/backend";

export default function LandingPage() {
  const { setLang, localized } = useI18n();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<{
    title_fa: string;
    title_sv: string;
    subtitle_fa: string;
    subtitle_sv: string;
    landingBackgroundUrl: string;
    logoUrl: string;
  } | null>(null);

  useEffect(() => {
    import("../actor").then(({ backend }) => {
      backend.getSettings().then((s: SiteSettingsReturn) => {
        setSettings(s);
      });
    });
  }, []);

  const selectLang = (lang: "fa" | "sv") => {
    setLang(lang);
    navigate(`/${lang}/topics`);
  };

  const title = settings
    ? localized(settings.title_fa || "کانون", settings.title_sv || "Kanon")
    : "Kanon";
  const resolvedLogo = useAssetUrl(settings?.logoUrl);

  const subtitle = settings
    ? localized(
        settings.subtitle_fa || "فرهنگی، آموزشی و ورزشی",
        settings.subtitle_sv || "Kultur, utbildning och sport"
      )
    : "Kultur, utbildning och sport";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 relative">
      <Background url={settings?.landingBackgroundUrl} />

      <motion.div
        className="text-center mb-12 sm:mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {resolvedLogo && (
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl glass-strong mb-6 overflow-hidden">
            <img src={resolvedLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 text-glow tracking-tight">
          {title}
        </h1>
        <p className="text-lg sm:text-2xl text-white/60 max-w-lg mx-auto">
          {subtitle}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* Persian Card */}
        <GlassCard
          className="flex-1"
          onClick={() => selectLang("fa")}
          delay={0.2}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28">
              <WavingFlag src="/assets/flag-iran.svg" alt="Iran" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                فارسی
              </h2>
              <p className="text-white/50 text-sm">Persian / فارسی</p>
            </div>
          </div>
        </GlassCard>

        {/* Swedish Card */}
        <GlassCard
          className="flex-1"
          onClick={() => selectLang("sv")}
          delay={0.4}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28">
              <WavingFlag src="/assets/flag-sweden.svg" alt="Sweden" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Svenska
              </h2>
              <p className="text-white/50 text-sm">Swedish / Svenska</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
