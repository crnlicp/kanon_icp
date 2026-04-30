import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";
import WavingFlag from "./WavingFlag";

interface TopicLink {
  slug: string;
  title: string;
}

interface HeaderProps {
  logoUrl?: string;
  title?: string;
  topics?: TopicLink[];
}

export default function Header({ logoUrl, title, topics = [] }: HeaderProps) {
  const { lang, setLang, t, isRtl } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedLogo = useAssetUrl(logoUrl);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const switchLang = (newLang: "fa" | "sv") => {
    const oldLang = lang;
    setLang(newLang);
    const newPath = location.pathname.replace(`/${oldLang}/`, `/${newLang}/`);
    if (newPath !== location.pathname) {
      navigate(newPath);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-strong py-2" : "glass py-4"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
          {/* Logo + Title */}
          <Link to="/" className="flex items-center gap-3 group">
            {resolvedLogo && (
              <motion.img
                src={resolvedLogo}
                alt="Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover"
                whileHover={{ scale: 1.05 }}
              />
            )}
            <span className="text-lg sm:text-2xl font-bold text-offwhite tracking-tight">
              {title || (isRtl ? "کانون" : "Kanon")}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to={`/${lang}/topics`}
              className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {t("topics")}
            </Link>
            <Link
              to={`/${lang}/about`}
              className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {t("aboutUs")}
            </Link>
            <Link
              to={`/${lang}/contact`}
              className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              {t("contactUs")}
            </Link>
          </nav>

          {/* Desktop Language Switcher */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              onClick={() => switchLang("fa")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                lang === "fa"
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(0,212,200,0.2)]"
                  : "text-white/60 hover:text-white/90 border border-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-6 h-6">
                <WavingFlag 
                  src="/assets/flag-iran.svg" 
                  alt="Iran" 
                  amplitude={2}
                  frequency={0.3}
                  speed={0.05}
                />
              </div>
              فارسی
            </motion.button>
            <motion.button
              onClick={() => switchLang("sv")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                lang === "sv"
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-[0_0_20px_rgba(0,212,200,0.2)]"
                  : "text-white/60 hover:text-white/90 border border-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
             <div className="w-6 h-6">
                <WavingFlag 
                  src="/assets/flag-sweden.svg" 
                  alt="Sweden" 
                  amplitude={2}
                  frequency={0.3}
                  speed={0.05}
                />
              </div>
              Svenska
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <motion.button
            className="md:hidden p-2 rounded-xl text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-3xl p-8 max-h-[80vh] overflow-y-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

              {/* Topic Links */}
              {topics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-3">
                    {t("topics")}
                  </h3>
                  <div className="space-y-1">
                    {topics.map((topic) => (
                      <Link
                        key={topic.slug}
                        to={`/${lang}/topics/${topic.slug}`}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="text-white/90">{topic.title}</span>
                        <ChevronRight size={16} className="text-white/30" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Links */}
              <div className="mb-6 space-y-1">
                <Link
                  to={`/${lang}/about`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-white/90">{t("aboutUs")}</span>
                  <ChevronRight size={16} className="text-white/30" />
                </Link>
                <Link
                  to={`/${lang}/contact`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-white/90">{t("contactUs")}</span>
                  <ChevronRight size={16} className="text-white/30" />
                </Link>
              </div>

              {/* Language Switcher */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} className="text-white/40" />
                  <span className="text-sm text-white/40">{t("selectLanguage")}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { switchLang("fa"); setMobileOpen(false); }}
                    className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                      lang === "fa"
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/5 text-white/60 border border-white/10"
                    }`}
                  >
                    🇮🇷 فارسی
                  </button>
                  <button
                    onClick={() => { switchLang("sv"); setMobileOpen(false); }}
                    className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                      lang === "sv"
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/5 text-white/60 border border-white/10"
                    }`}
                  >
                    🇸🇪 Svenska
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
