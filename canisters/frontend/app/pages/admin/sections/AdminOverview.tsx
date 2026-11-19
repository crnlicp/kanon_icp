import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Activity, MessageSquare, Link2, Loader2 } from "lucide-react";
import { useI18n } from "../../../i18n";

interface Props {
  token: string;
}

interface Counts {
  topics: number;
  activities: number;
  contactMessages: number;
  socialLinks: number;
}

const cards: {
  key: keyof Counts;
  labelKey: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { key: "topics", labelKey: "topics", icon: Layers, color: "text-primary" },
  { key: "activities", labelKey: "activities", icon: Activity, color: "text-blue-400" },
  { key: "contactMessages", labelKey: "contactMessages", icon: MessageSquare, color: "text-amber-400" },
  { key: "socialLinks", labelKey: "socialLinks", icon: Link2, color: "text-pink-400" },
];

export default function AdminOverview({ token }: Props) {
  const { t } = useI18n();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../../actor").then(async ({ backend }) => {
      try {
        const [topics, links] = await Promise.all([
          backend.getTopics(),
          backend.getSocialLinks(),
        ]);
        // Sum activities across all topics
        const activityCounts = await Promise.all(
          topics.map((t) => backend.getActivitiesByTopic(t.id))
        );
        const totalActivities = activityCounts.reduce((sum, arr) => sum + arr.length, 0);

        // Contact messages require auth — may fail after canister upgrade
        let msgCount = 0;
        try {
          const messages = await backend.getContactMessages(token);
          msgCount = messages.length;
        } catch {
          // session may be expired/cleared
        }

        setCounts({
          topics: topics.length,
          activities: totalActivities,
          contactMessages: msgCount,
          socialLinks: links.length,
        });
      } catch {
        // ignore
      }
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">{t("dashboard")}</h2>
        <p className="text-white/40 text-sm mt-1">{t("contentManagement")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const count = counts ? counts[card.key] : 0;
          return (
            <motion.div
              key={card.key}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${card.color}`}>
                  <Icon size={22} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{count}</p>
              <p className="text-sm text-white/40 mt-1">
                {t(card.labelKey as Parameters<typeof t>[0])}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
