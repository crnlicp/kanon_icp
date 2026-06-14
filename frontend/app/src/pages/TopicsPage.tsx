import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useI18n } from "../i18n";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import AssetImage from "../components/AssetImage";
import LoadingSpinner from "../components/LoadingSpinner";
import SeoHead from "../components/SeoHead";
import { useSeoSettings } from "../hooks/useSeoSettings";
import type { TopicReturn, ActivityReturn } from "../backend/api/backend";

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

interface HighlightedActivity {
  id: number;
  topicId: number;
  topicSlug: string;
  topicTitle_fa: string;
  topicTitle_sv: string;
  slug: string;
  title_fa: string;
  title_sv: string;
  excerpt_fa: string;
  excerpt_sv: string;
  icon: string;
  imageUrl: string;
}

export default function TopicsPage() {
  const { lang, t, localized } = useI18n();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activityCounts, setActivityCounts] = useState<Record<number, number>>({});
  const [highlighted, setHighlighted] = useState<HighlightedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgUrl, setBgUrl] = useState("");

  const seo = useSeoSettings({
    title: t("topics"),
    description: t("topicsSeoDescription"),
  });

  useEffect(() => {
    import("../actor").then(({ backend }) => {
      Promise.all([backend.getTopics(), backend.getSettings(), backend.getAllActivities()]).then(
        ([topicsData, settings, activitiesData]) => {
          const tps = topicsData.map((t: TopicReturn) => ({ ...t, id: Number(t.id), sortOrder: Number(t.sortOrder) }));
          setTopics(tps);
          setBgUrl(settings.topicsBackgroundUrl);
          const counts: Record<number, number> = {};
          const topicById = new Map<number, Topic>();
          tps.forEach((tp: Topic) => topicById.set(tp.id, tp));
          const hl: HighlightedActivity[] = [];
          activitiesData.forEach((a: ActivityReturn) => {
            const tid = Number(a.topicId);
            counts[tid] = (counts[tid] ?? 0) + 1;
            if (a.highlighted) {
              const tp = topicById.get(tid);
              hl.push({
                id: Number(a.id),
                topicId: tid,
                topicSlug: tp?.slug ?? "",
                topicTitle_fa: tp?.title_fa ?? "",
                topicTitle_sv: tp?.title_sv ?? "",
                slug: a.slug,
                title_fa: a.title_fa,
                title_sv: a.title_sv,
                excerpt_fa: a.excerpt_fa,
                excerpt_sv: a.excerpt_sv,
                icon: a.icon,
                imageUrl: a.imageUrl,
              });
            }
          });
          setActivityCounts(counts);
          setHighlighted(hl);
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

  const HighlightedColumn = (
    <aside className="rounded-2xl glass-strong pulse-border p-4 sm:p-5 lg:sticky lg:top-28 self-start">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 border border-accent/40">
          <LucideIcons.Star size={16} className="text-accent fill-accent" />
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-white">
          {t("highlightedEvents")}
        </h2>
      </div>

      {highlighted.length === 0 ? (
        <p className="text-sm text-white/50 py-6 text-center">
          {t("noHighlightedEvents")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {highlighted.map((h) => {
            const Icon = getIcon(h.icon);
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => navigate(`/${lang}/topics/${h.topicSlug}/${h.slug}`)}
                className="text-start rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/40 transition-all p-3 group"
              >
                <div className="flex gap-3">
                  {h.imageUrl ? (
                    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                      <AssetImage
                        src={h.imageUrl}
                        alt={localized(h.title_fa, h.title_sv)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="shrink-0 w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Icon size={26} className="text-primary" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-accent transition-colors">
                      {localized(h.title_fa, h.title_sv)}
                    </h3>
                    <p className="text-[11px] uppercase tracking-wide text-primary/80 mt-1 truncate">
                      {localized(h.topicTitle_fa, h.topicTitle_sv)}
                    </p>
                    {(h.excerpt_fa || h.excerpt_sv) && (
                      <p className="text-xs text-white/50 mt-1 line-clamp-2">
                        {localized(h.excerpt_fa, h.excerpt_sv)}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );

  const TopicsGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
      {topics.map((topic, idx) => {
        const Icon = getIcon(topic.icon);
        return (
          <GlassCard
            key={topic.id}
            href={`/${lang}/topics/${topic.slug}`}
            onClick={() => navigate(`/${lang}/topics/${topic.slug}`)}
            delay={idx * 0.1}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative w-fit">
                <motion.div
                  className="p-4 rounded-2xl bg-primary/10 border border-primary/20"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={48} className="text-primary" />
                </motion.div>
                {(activityCounts[topic.id] ?? 0) > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-primary text-black rounded-full z-10">
                    {activityCounts[topic.id]}
                  </span>
                )}
              </div>
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
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <SeoHead {...seo} ogType="website" />
      <Background url={bgUrl} />

      <div className="max-w-7xl mx-auto">
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

        {/* Mobile order: highlighted first, then topics. Desktop: topics (2 cols) + highlighted (1 col) */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:hidden mb-8">{HighlightedColumn}</div>
          <div className="lg:col-span-2">{TopicsGrid}</div>
          <div className="hidden lg:block">{HighlightedColumn}</div>
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
