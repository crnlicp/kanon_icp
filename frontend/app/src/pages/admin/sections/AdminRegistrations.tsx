import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Phone, MessageSquare, Inbox, Filter } from "lucide-react";
import Toast from "../../../components/Toast";
import { useI18n } from "../../../i18n";
import type { RegistrationReturn, TopicReturn, ActivityReturn } from "../../../backend/api/backend";

interface Props {
  token: string;
}

interface RegItem {
  id: number;
  activityId: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  fieldValues: { fieldId: number; fieldLabel: string; value: string }[];
  createdAt: number;
}

interface ActivityOption {
  id: number;
  title_sv: string;
  title_fa: string;
  topicId: number;
}

export default function AdminRegistrations({ token }: Props) {
  const { t, lang } = useI18n();
  const [registrations, setRegistrations] = useState<RegItem[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "", type: "success", visible: false,
  });

  // Load all activities for the filter dropdown
  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getTopics().then(async (topics: TopicReturn[]) => {
        const allActivities: ActivityOption[] = [];
        for (const topic of topics) {
          const acts = await backend.getActivitiesByTopic(topic.id);
          for (const a of acts) {
            allActivities.push({
              id: Number(a.id),
              title_sv: a.title_sv,
              title_fa: a.title_fa,
              topicId: Number(topic.id),
            });
          }
        }
        setActivities(allActivities);
      });
    });
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const { backend } = await import("../../../actor");
      let data: RegistrationReturn[];
      if (selectedActivityId !== null) {
        data = await backend.getRegistrations(token, BigInt(selectedActivityId));
      } else {
        data = await backend.getAllRegistrations(token);
      }
      setRegistrations(
        data
          .map((r) => ({
            id: Number(r.id),
            activityId: Number(r.activityId),
            name: r.name,
            email: r.email,
            phone: r.phone,
            message: r.message,
            fieldValues: (r.fieldValues || []).map((fv) => ({
              fieldId: Number(fv.fieldId),
              fieldLabel: fv.fieldLabel,
              value: fv.value,
            })),
            createdAt: Number(r.createdAt),
          }))
          .sort((a, b) => b.createdAt - a.createdAt)
      );
    } catch {
      setToast({ message: t("failedToLoadRegistrations"), type: "error", visible: true });
    }
    setLoading(false);
  }, [token, selectedActivityId, t]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const formatDate = (ns: number) => {
    const ms = ns / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityTitle = (activityId: number) => {
    const act = activities.find((a) => a.id === activityId);
    if (!act) return `#${activityId}`;
    return lang === "fa" ? act.title_fa : act.title_sv;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white">{t("registrations")}</h2>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-white/40" />
          <select
            value={selectedActivityId ?? ""}
            onChange={(e) => setSelectedActivityId(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
          >
            <option value="" className="bg-[#0f172a] text-white">{t("allActivities")}</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#0f172a] text-white">
                {lang === "fa" ? a.title_fa : a.title_sv}
              </option>
            ))}
          </select>
          <span className="text-sm text-white/40">
            {registrations.length} {registrations.length === 1 ? t("registration") : t("registrations")}
          </span>
        </div>
      </div>

      {registrations.length === 0 ? (
        <motion.div
          className="glass rounded-2xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Inbox size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noRegistrations")}</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, idx) => (
            <motion.div
              key={reg.id}
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate">{reg.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                      <Mail size={13} />
                      <a href={`mailto:${reg.email}`} className="hover:text-primary transition-colors">
                        {reg.email}
                      </a>
                    </span>
                    {reg.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-white/40">
                        <Phone size={13} />
                        {reg.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-white/30">{formatDate(reg.createdAt)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/20">
                    {getActivityTitle(reg.activityId)}
                  </span>
                </div>
              </div>

              {reg.message && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <MessageSquare size={14} className="text-white/20 mt-0.5 shrink-0" />
                  <p className="text-sm text-white/60 whitespace-pre-wrap break-words">{reg.message}</p>
                </div>
              )}

              {/* Dynamic field values */}
              {reg.fieldValues.length > 0 && (
                <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  {reg.fieldValues.map((fv, fvIdx) => (
                    <div key={fvIdx} className="flex items-start gap-2 text-sm">
                      <span className="text-white/40 shrink-0 min-w-[100px]">{fv.fieldLabel}:</span>
                      <span className="text-white/70 break-words">{fv.value || "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
