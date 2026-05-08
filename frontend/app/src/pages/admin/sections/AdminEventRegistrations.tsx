import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Phone, Users, Inbox, Filter } from "lucide-react";
import { useI18n } from "../../../i18n";
import type { RegistrationReturn, TopicReturn, SessionStatsReturn, ActivityReturn } from "../../../backend/api/backend";

interface Props {
  token: string;
}

interface RegItem {
  id: number;
  activityId: number;
  name: string;
  email: string;
  phone: string;
  personCount: number;
  selectedSessions: { sessionId: number; sessionName: string }[];
  fieldValues: { fieldId: number; fieldLabel: string; value: string }[];
  createdAt: number;
}

interface ActivityOption {
  id: number;
  title_sv: string;
  title_fa: string;
  topicId: number;
}

export default function AdminEventRegistrations({ token }: Props) {
  const { t, lang } = useI18n();
  const [registrations, setRegistrations] = useState<RegItem[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStatsReturn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getTopics().then(async (topics: TopicReturn[]) => {
        const eventActivities: ActivityOption[] = [];
        for (const topic of topics) {
          const acts: ActivityReturn[] = await backend.getActivitiesByTopic(topic.id);
          for (const a of acts) {
            const mode = a.registrationMode ?? (a.hasRegistration && a.sessions.length > 0 ? "event" : "");
            if (mode === "event") {
              eventActivities.push({
                id: Number(a.id),
                title_sv: a.title_sv,
                title_fa: a.title_fa,
                topicId: Number(topic.id),
              });
            }
          }
        }
        setActivities(eventActivities);
        if (eventActivities.length > 0) setSelectedActivityId(eventActivities[0].id);
        setLoading(false);
      });
    });
  }, []);

  const fetchRegistrations = useCallback(async () => {
    if (selectedActivityId === null) return;
    setLoading(true);
    try {
      const { backend } = await import("../../../actor");
      const [data, stats] = await Promise.all([
        backend.getRegistrations(token, BigInt(selectedActivityId)),
        backend.getSessionStats(token, BigInt(selectedActivityId)),
      ]);
      setSessionStats(stats);
      setRegistrations(
        data
          .map((r: RegistrationReturn) => ({
            id: Number(r.id),
            activityId: Number(r.activityId),
            name: r.name,
            email: r.email,
            phone: r.phone,
            personCount: Number(r.personCount),
            selectedSessions: (r.selectedSessions ?? []).map((ss) => ({
              sessionId: Number(ss.sessionId),
              sessionName: ss.sessionName,
            })),
            fieldValues: (r.fieldValues || []).map((fv) => ({
              fieldId: Number(fv.fieldId),
              fieldLabel: fv.fieldLabel,
              value: fv.value,
            })),
            createdAt: Number(r.createdAt),
          }))
          .sort((a: RegItem, b: RegItem) => b.createdAt - a.createdAt)
      );
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token, selectedActivityId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const formatDate = (ns: number) => {
    const ms = ns / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-white">{t("eventRegistrations")}</h2>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-white/40" />
          <select
            value={selectedActivityId ?? ""}
            onChange={(e) => setSelectedActivityId(e.target.value ? Number(e.target.value) : null)}
            className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
          >
            {activities.map((a) => (
              <option key={a.id} value={a.id} className="bg-black/70">
                {lang === "fa" ? a.title_fa : a.title_sv}
              </option>
            ))}
          </select>
          <span className="text-sm text-white/40">
            {registrations.length} {t("registrations")}
          </span>
        </div>
      </div>

      {/* Session stats — prominent */}
      {sessionStats.length > 0 && (
        <div className="mb-8 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-4 py-3 bg-white/[0.03] border-b border-white/10">
            <p className="text-sm font-medium text-white/70">{t("sessionStats")}</p>
          </div>
          <div className="divide-y divide-white/5">
            {[...sessionStats].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((ss) => {
              const cap = Number(ss.capacity);
              const buf = Number(ss.bufferCapacity);
              const confirmed = Number(ss.confirmedCount);
              const buffered = Number(ss.bufferCount);
              const isFull = confirmed >= cap && buffered >= buf;
              return (
                <div key={Number(ss.sessionId)} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <span className="text-sm text-white font-medium min-w-[100px]">
                    {lang === "fa" ? ss.name_fa : ss.name_sv}
                  </span>
                  {ss.date && <span className="text-xs text-white/40">{ss.date}</span>}
                  <span className="text-xs text-white/60">{confirmed}/{cap} {t("confirmed")}</span>
                  {buf > 0 && <span className="text-xs text-white/60">{buffered}/{buf} {t("buffer")}</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    isFull ? "bg-red-500/15 text-red-400 border-red-500/20" : "bg-green-500/15 text-green-400 border-green-500/20"
                  }`}>
                    {isFull ? t("full") : t("open")}
                  </span>
                  <span className="text-xs text-white/30 ml-auto">
                    {Number(ss.registrationCount)} {t("registrationCount")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {registrations.length === 0 && !loading ? (
        <motion.div className="glass rounded-2xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              transition={{ delay: idx * 0.04 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-lg truncate">{reg.name}</h3>
                    {reg.personCount > 1 && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">
                        <Users size={10} />
                        {reg.personCount}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                      <Mail size={13} />
                      <a href={`mailto:${reg.email}`} className="hover:text-primary transition-colors">{reg.email}</a>
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
                  <span className="text-xs font-mono text-primary/60">#{reg.id}</span>
                </div>
              </div>

              {/* Session chips */}
              {reg.selectedSessions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {reg.selectedSessions.map((ss) => (
                    <span key={ss.sessionId} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-white/60 border border-white/10">
                      {ss.sessionName}
                    </span>
                  ))}
                </div>
              )}

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
    </div>
  );
}
