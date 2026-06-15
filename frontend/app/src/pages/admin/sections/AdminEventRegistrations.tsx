import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, Phone, Users, Inbox, Filter, Star, Archive, ArchiveRestore } from "lucide-react";
import Toast from "../../../components/Toast";
import { useI18n } from "../../../i18n";
import type { RegistrationWithStatusReturn, TopicReturn, SessionStatsReturn, ActivityReturn } from "../../../backend/api/backend";

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
  selectedSessions: { sessionId: number; sessionName: string; status: string }[];
  fieldValues: { fieldId: number; fieldLabel: string; value: string }[];
  createdAt: number;
  archived: boolean;
}

interface ActivityOption {
  id: number;
  title_sv: string;
  title_fa: string;
  topicId: number;
  highlighted: boolean;
}

export default function AdminEventRegistrations({ token }: Props) {
  const { t, lang } = useI18n();
  const [registrations, setRegistrations] = useState<RegItem[]>([]);
  const [activities, setActivities] = useState<ActivityOption[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStatsReturn[]>([]);
  const [sessionFilter, setSessionFilter] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "", type: "success", visible: false,
  });

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
                highlighted: a.highlighted ?? false,
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
        backend.getRegistrationsWithStatus(token, BigInt(selectedActivityId)),
        backend.getSessionStats(token, BigInt(selectedActivityId)),
      ]);
      setSessionStats(stats);
      setSessionFilter("all");
      setRegistrations(
        data
          .map((r: RegistrationWithStatusReturn) => ({
            id: Number(r.id),
            activityId: Number(r.activityId),
            name: r.name,
            email: r.email,
            phone: r.phone,
            personCount: Number(r.personCount),
            selectedSessions: (r.selectedSessions ?? []).map((ss) => ({
              sessionId: Number(ss.sessionId),
              sessionName: ss.sessionName,
              status: ss.status,
            })),
            fieldValues: (r.fieldValues || []).map((fv) => ({
              fieldId: Number(fv.fieldId),
              fieldLabel: fv.fieldLabel,
              value: fv.value,
            })),
            createdAt: Number(r.createdAt),
            archived: Boolean(r.archived),
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

  const handleToggleArchive = async (reg: RegItem) => {
    const nextArchived = !reg.archived;
    const confirmKey = nextArchived ? "confirmArchiveRegistration" : "confirmUnarchiveRegistration";
    if (!confirm(t(confirmKey))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.setRegistrationArchived(token, BigInt(reg.id), nextArchived);
      setRegistrations((prev) => prev.map((r) => (r.id === reg.id ? { ...r, archived: nextArchived } : r)));
      setToast({
        message: t(nextArchived ? "registrationArchived" : "registrationUnarchived"),
        type: "success",
        visible: true,
      });
      // Session stats can change when archiving/unarchiving frees a slot
      try {
        if (selectedActivityId !== null) {
          const { backend: b } = await import("../../../actor");
          const stats = await b.getSessionStats(token, BigInt(selectedActivityId));
          setSessionStats(stats);
        }
      } catch { /* ignore */ }
    } catch {
      setToast({ message: t("failedToArchiveRegistration"), type: "error", visible: true });
    }
  };

  const visibleRegistrations = registrations
    .filter((r) => showArchived || !r.archived)
    .filter((r) => sessionFilter === "all" || r.selectedSessions.some((ss) => ss.sessionId === sessionFilter));

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
                {a.highlighted ? "★ " : ""}{lang === "fa" ? a.title_fa : a.title_sv}
              </option>
            ))}
          </select>
          {selectedActivityId !== null && activities.find((a) => a.id === selectedActivityId)?.highlighted && (
            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent font-semibold" title={t("highlighted")}>
              <Star size={10} className="fill-accent" />
              {t("highlighted")}
            </span>
          )}
          {sessionStats.length > 0 && (
            <select
              value={sessionFilter === "all" ? "" : sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value === "" ? "all" : Number(e.target.value))}
              className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
            >
              <option value="" className="bg-black/70">{t("allSessions")}</option>
              {[...sessionStats].sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder)).map((ss) => (
                <option key={Number(ss.sessionId)} value={Number(ss.sessionId)} className="bg-black/70">
                  {lang === "fa" ? ss.name_fa : ss.name_sv}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => setShowArchived((s) => !s)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            {showArchived ? t("hideArchived") : t("showArchived")}
          </button>
          <span className="text-sm text-white/40">
            {visibleRegistrations.length} {t("registrations")}
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

      {visibleRegistrations.length === 0 && !loading ? (
        <motion.div className="glass rounded-2xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Inbox size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noRegistrations")}</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {visibleRegistrations.map((reg, idx) => (
            <motion.div
              key={reg.id}
              className={`glass rounded-2xl p-5 ${reg.archived ? "opacity-60" : ""}`}
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
                  {reg.archived && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
                      {t("archived")}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleToggleArchive(reg)}
                    title={reg.archived ? t("unarchive") : t("archive")}
                    className="mt-1 inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors"
                  >
                    {reg.archived ? <ArchiveRestore size={12} /> : <Archive size={12} />}
                    {reg.archived ? t("unarchive") : t("archive")}
                  </button>
                </div>
              </div>

              {/* Session chips */}
              {reg.selectedSessions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {reg.selectedSessions.map((ss) => {
                    const isBuffer = ss.status === "buffer";
                    return (
                      <span
                        key={ss.sessionId}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                          isBuffer
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            : "bg-white/[0.06] text-white/60 border-white/10"
                        }`}
                      >
                        {ss.sessionName}
                        {isBuffer && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold">
                            {t("buffer")}
                          </span>
                        )}
                      </span>
                    );
                  })}
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

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
