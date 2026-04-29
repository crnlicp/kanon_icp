import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useI18n } from "../i18n";
import Background from "../components/Background";
import HeroSlider from "../components/HeroSlider";
import GlassCard from "../components/GlassCard";
import AssetImage from "../components/AssetImage";
import LoadingSpinner from "../components/LoadingSpinner";
import type { TopicReturn, HeroSlideReturn, ActivityReturn } from "../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  backgroundUrl: string;
}

interface Slide {
  id: number;
  imageUrl: string;
  title_fa: string;
  title_sv: string;
  subtitle_fa: string;
  subtitle_sv: string;
  ctaText_fa: string;
  ctaText_sv: string;
  ctaLink: string;
}

interface Activity {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  excerpt_fa: string;
  excerpt_sv: string;
  icon: string;
  imageUrl: string;
}

export default function TopicHomePage() {
  const { topicSlug } = useParams();
  const { lang, t, localized } = useI18n();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topicSlug) return;
    import("../actor").then(({ backend }) => {
      backend.getTopicBySlug(topicSlug).then((topicData: TopicReturn | null) => {
        if (!topicData) {
          navigate(`/${lang}/topics`);
          return;
        }
        const tp = { ...topicData, id: Number(topicData.id) };
        setTopic(tp);

        Promise.all([
          backend.getSlidesByTopic(BigInt(tp.id)),
          backend.getActivitiesByTopic(BigInt(tp.id)),
        ]).then(([slidesData, activitiesData]) => {
          setSlides(slidesData.map((s: HeroSlideReturn) => ({ ...s, id: Number(s.id) })));
          setActivities(
            activitiesData.map((a: ActivityReturn) => ({ ...a, id: Number(a.id) }))
          );
          setLoading(false);
        });
      });
    });
  }, [topicSlug, lang, navigate]);

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ElementType>;
    return icons[iconName] || LucideIcons.Activity;
  };

  if (loading) return <LoadingSpinner />;
  if (!topic) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <Background url={topic.backgroundUrl} />

      <div className="max-w-6xl mx-auto">
        {/* Hero Slider */}
        {slides.length > 0 && (
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSlider slides={slides} />
          </motion.div>
        )}

        {/* Topic Title */}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 text-glow text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {localized(topic.title_fa, topic.title_sv)}
        </motion.h1>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((activity, idx) => {
            const Icon = getIcon(activity.icon);
            return (
              <GlassCard
                key={activity.id}
                onClick={() =>
                  navigate(`/${lang}/topics/${topicSlug}/${activity.slug}`)
                }
                delay={idx * 0.1}
              >
                {activity.imageUrl && (
                  <div className="rounded-xl overflow-hidden mb-4 -mt-2 -mx-2">
                    <AssetImage
                      src={activity.imageUrl}
                      alt=""
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                  >
                    <Icon size={32} className="text-primary" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {localized(activity.title_fa, activity.title_sv)}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                    {localized(activity.excerpt_fa, activity.excerpt_sv)}
                  </p>
                  <span className="text-primary text-sm font-medium mt-1">
                    {t("readMore")} →
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {activities.length === 0 && (
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
