import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useI18n } from "../i18n";
import { useAssetUrl } from "../hooks/useAssetUrl";
import Background from "../components/Background";
import GlassCard from "../components/GlassCard";
import RegistrationForm from "../components/RegistrationForm";
import Toast from "../components/Toast";
import LoadingSpinner from "../components/LoadingSpinner";
import type { TopicReturn, ActivityReturn, FormFieldReturn } from "../backend/api/backend";

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
  const [formFields, setFormFields] = useState<FormFieldReturn[] | null>(null);
  const activityImage = useAssetUrl(activity?.imageUrl);
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
          const actId = Number(actData.id);
          setActivity({ ...actData, id: actId, topicId: Number(actData.topicId) });

          // Fetch dynamic form fields if registration is enabled
          if (actData.hasRegistration) {
            backend.getActivityFormFields(BigInt(actId)).then((fields: FormFieldReturn[] | null) => {
              setFormFields(fields);
            });
          }
          setLoading(false);
        });
      });
    });
  }, [topicSlug, activitySlug, lang, navigate]);

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
            className="text-white/80 leading-relaxed text-base sm:text-lg"
            dangerouslySetInnerHTML={{ __html: localized(activity.body_fa, activity.body_sv) }}
          />
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
              <RegistrationForm
                activityId={activity.id}
                formFields={formFields}
                onSuccess={() => setToast({ message: t("registrationSuccess"), type: "success", visible: true })}
                onError={() => setToast({ message: t("registrationError"), type: "error", visible: true })}
              />
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
