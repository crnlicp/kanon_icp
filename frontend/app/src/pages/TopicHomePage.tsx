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
import SeoHead from "../components/SeoHead";
import { useSeoSettings } from "../hooks/useSeoSettings";
import { topicBreadcrumb } from "../lib/jsonld";
import type { TopicReturn, HeroSlideReturn, ActivityReturn } from "../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  description_fa: string;
  description_sv: string;
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
  hasRegistration: boolean;
  registrationMode: string;
  highlighted: boolean;
}

export default function TopicHomePage() {
  const { topicSlug } = useParams();
  const { lang, t, localized } = useI18n();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const topicTitle = topic ? localized(topic.title_fa, topic.title_sv) : undefined;
  const seo = useSeoSettings({
    title: topicTitle,
    ogImage: topic?.backgroundUrl || undefined,
    jsonLd: topic
      ? topicBreadcrumb(
          topicTitle!,
          `/${lang}/topics/${topicSlug}`,
          t("topics"),
          `/${lang}/topics`
        )
      : null,
  });

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
      <SeoHead {...seo} ogType="website" />
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-glow text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {localized(topic.title_fa, topic.title_sv)}
        </motion.h1>

        {/* Topic Description */}
        {(topic.description_fa || topic.description_sv) && (
          <motion.p
            className="text-base sm:text-lg text-white/65 max-w-3xl mx-auto text-center mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {localized(topic.description_fa, topic.description_sv)}
          </motion.p>
        )}

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activities.map((activity, idx) => {
            const Icon = getIcon(activity.icon);
            return (
              <GlassCard
                key={activity.id}
                href={`/${lang}/topics/${topicSlug}/${activity.slug}`}
                onClick={() =>
                  navigate(`/${lang}/topics/${topicSlug}/${activity.slug}`)
                }
                delay={idx * 0.1}
              >
                {activity.imageUrl && (
                  <div className="relative rounded-xl overflow-hidden mb-4 -mt-2 -mx-2">
                    <AssetImage
                      src={activity.imageUrl}
                      alt={localized(activity.title_fa, activity.title_sv)}
                      className="w-full h-40 object-cover"
                    />
                    {activity.highlighted && (
                      <span
                        className="absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/90 text-white text-[10px] font-semibold shadow-md backdrop-blur-sm"
                        title={t("highlighted")}
                      >
                        <LucideIcons.Star size={10} className="fill-white" />
                        {t("highlighted")}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="p-3 rounded-xl bg-primary/10 border border-primary/20 w-fit"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <Icon size={32} className="text-primary" />
                    </motion.div>
                    {!activity.imageUrl && activity.highlighted && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/90 text-white text-[10px] font-semibold"
                        title={t("highlighted")}
                      >
                        <LucideIcons.Star size={10} className="fill-white" />
                        {t("highlighted")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {localized(activity.title_fa, activity.title_sv)}
                  </h3>
                  {activity.registrationMode !== "none" && (
                    <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 w-fit">
                      {activity.registrationMode === "event"
                        ? <LucideIcons.CalendarDays size={11} className="text-primary/80" />
                        : <LucideIcons.ClipboardList size={11} className="text-primary/80" />
                      }
                      <span>{activity.registrationMode === "event" ? t("eventRegistrationMode") : t("registrationFormMode")}</span>
                    </div>
                  )}
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
