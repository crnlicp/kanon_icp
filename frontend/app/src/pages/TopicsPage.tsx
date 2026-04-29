import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useI18n } from "../i18n";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import LoadingSpinner from "../components/LoadingSpinner";
import type { TopicReturn } from "../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  description_fa: string;
  description_sv: string;
  icon: string;
  backgroundUrl: string;
  sortOrder: number;
}

export default function TopicsPage() {
  const { lang, t, localized } = useI18n();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgUrl, setBgUrl] = useState("");

  useEffect(() => {
    import("../actor").then(({ backend }) => {
      Promise.all([backend.getTopics(), backend.getSettings()]).then(
        ([topicsData, settings]) => {
          setTopics(topicsData.map((t: TopicReturn) => ({ ...t, id: Number(t.id), sortOrder: Number(t.sortOrder) })));
          setBgUrl(settings.topicsBackgroundUrl);
          setLoading(false);
        }
      );
    });
  }, []);

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ElementType>;
    const Icon = icons[iconName] || LucideIcons.Layers;
    return Icon;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <Background url={bgUrl} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 text-glow">
            {t("chooseArea")}
          </h1>
          <p className="text-lg sm:text-xl text-white/50">
            {t("chooseAreaSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {topics.map((topic, idx) => {
            const Icon = getIcon(topic.icon);
            return (
              <GlassCard
                key={topic.id}
                onClick={() => navigate(`/${lang}/topics/${topic.slug}`)}
                delay={idx * 0.1}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.div
                    className="p-4 rounded-2xl bg-primary/10 border border-primary/20"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={48} className="text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {localized(topic.title_fa, topic.title_sv)}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      {localized(topic.description_fa, topic.description_sv)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {topics.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <LucideIcons.Inbox size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">{t("noData")}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
