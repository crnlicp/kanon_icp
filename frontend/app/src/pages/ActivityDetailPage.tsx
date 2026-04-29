import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import type { TopicReturn, ActivityReturn } from "../backend/api/backend";

interface Activity {
  id: number;
  topicId: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  body_fa: string;
  body_sv: string;
  imageUrl: string;
  hasRegistration: boolean;
}

interface Topic {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
}

export default function ActivityDetailPage() {
  const { topicSlug, activitySlug } = useParams();
  const { lang, t, localized, isRtl } = useI18n();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const activityImage = useAssetUrl(activity?.imageUrl);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    if (!topicSlug || !activitySlug) return;
    import("../actor").then(({ backend }) => {
      backend.getTopicBySlug(topicSlug).then((topicData: TopicReturn | null) => {
        if (!topicData) {
          navigate(`/${lang}/topics`);
          return;
        }
        const tp = { ...topicData, id: Number(topicData.id) };
        setTopic(tp);

        backend.getActivityBySlug(BigInt(tp.id), activitySlug).then((actData: ActivityReturn | null) => {
          if (!actData) {
            navigate(`/${lang}/topics/${topicSlug}`);
            return;
          }
          setActivity({ ...actData, id: Number(actData.id), topicId: Number(actData.topicId) });
          setLoading(false);
        });
      });
    });
  }, [topicSlug, activitySlug, lang, navigate]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activity) return;
      setSubmitting(true);
      try {
        const { backend } = await import("../actor");
        const result = await backend.submitRegistration(
          BigInt(activity.id),
          formData.name,
          formData.email,
          formData.phone,
          formData.message
        );
        if (result) {
          setToast({ message: t("registrationSuccess"), type: "success", visible: true });
          setFormData({ name: "", email: "", phone: "", message: "" });
        } else {
          setToast({ message: t("registrationError"), type: "error", visible: true });
        }
      } catch {
        setToast({ message: t("registrationError"), type: "error", visible: true });
      }
      setSubmitting(false);
    },
    [activity, formData, t]
  );

  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (loading) return <LoadingSpinner />;
  if (!activity || !topic) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <Background url={activity.imageUrl} />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-white/40 mb-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link to={`/${lang}/topics`} className="hover:text-white/70 transition-colors">
            {t("topics")}
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/${lang}/topics/${topicSlug}`}
            className="hover:text-white/70 transition-colors"
          >
            {localized(topic.title_fa, topic.title_sv)}
          </Link>
          <ChevronRight size={14} />
          <span className="text-white/60">
            {localized(activity.title_fa, activity.title_sv)}
          </span>
        </motion.nav>

        {/* Back Button */}
        <motion.button
          onClick={() => navigate(`/${lang}/topics/${topicSlug}`)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors"
          whileHover={{ x: isRtl ? 5 : -5 }}
        >
          <BackArrow size={20} />
          <span>{t("backToTopic")}</span>
        </motion.button>

        {/* Hero Image */}
        {activityImage && (
          <motion.div
            className="rounded-2xl sm:rounded-3xl overflow-hidden mb-8 h-[30vh] sm:h-[40vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={activityImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-10 text-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {localized(activity.title_fa, activity.title_sv)}
        </motion.h1>

        {/* Body Content */}
        <motion.div
          className="prose prose-invert prose-lg max-w-none mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="text-white/80 leading-relaxed text-base sm:text-lg whitespace-pre-wrap"
          >
            {localized(activity.body_fa, activity.body_sv)}
          </div>
        </motion.div>

        {/* Registration Form */}
        {activity.hasRegistration && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard hover={false}>
              <h2 className="text-2xl font-bold text-white mb-6">
                {t("registrationForm")}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">
                      {t("email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">
                      {t("phone")}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">
                    {t("message")}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {submitting ? t("loading") : t("submit")}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
