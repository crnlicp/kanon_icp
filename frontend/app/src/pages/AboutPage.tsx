import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";
import LoadingSpinner from "../components/LoadingSpinner";
import type { AboutContentReturn } from "../backend/api/backend";

export default function AboutPage() {
  const { t, localized } = useI18n();
  const [content, setContent] = useState<AboutContentReturn | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../actor").then(({ backend }) => {
      backend.getAboutContent().then((data: AboutContentReturn) => {
        setContent(data);
        setLoading(false);
      });
    });
  }, []);

  const bodyHtml = content ? localized(content.body_fa, content.body_sv) : "";
  const headerImg = useAssetUrl(content?.headerImageUrl);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-glow">
            {t("aboutUs")}
          </h1>
        </motion.div>

        {headerImg && (
          <motion.div
            className="mb-12 rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src={headerImg}
              alt={t("aboutUs")}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover"
            />
          </motion.div>
        )}

        {bodyHtml && (
          <motion.div
            className="glass rounded-2xl p-6 sm:p-10 prose prose-invert prose-primary max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        )}
      </div>
    </div>
  );
}
