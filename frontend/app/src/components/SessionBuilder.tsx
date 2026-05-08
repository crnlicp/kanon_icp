import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { useI18n } from "../i18n";
import type { EventSessionReturn } from "../backend/api/backend";

interface Props {
  sessions: EventSessionReturn[];
  onChange: (sessions: EventSessionReturn[]) => void;
  readOnly?: boolean;
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

export default function SessionBuilder({ sessions, onChange, readOnly }: Props) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState<number | null>(null);

  const nextId = (): bigint => {
    const max = sessions.reduce((m, s) => Math.max(m, Number(s.id)), 0);
    return BigInt(max + 1);
  };

  const addSession = () => {
    const id = nextId();
    const newSession: EventSessionReturn = {
      id,
      name_fa: "",
      name_sv: "",
      date: "",
      capacity: BigInt(50),
      bufferCapacity: BigInt(0),
      sortOrder: BigInt(sessions.length + 1),
    };
    onChange([...sessions, newSession]);
    setExpanded(Number(id));
  };

  const update = (idx: number, patch: Partial<EventSessionReturn>) => {
    onChange(sessions.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const remove = (idx: number) => {
    onChange(sessions.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const arr = [...sessions];
    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
    onChange(arr.map((s, i) => ({ ...s, sortOrder: BigInt(i + 1) })));
  };

  const moveDown = (idx: number) => {
    if (idx === sessions.length - 1) return;
    const arr = [...sessions];
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
    onChange(arr.map((s, i) => ({ ...s, sortOrder: BigInt(i + 1) })));
  };

  return (
    <div className="space-y-3">
      {sessions.length === 0 && (
        <p className="text-sm text-white/40 italic">{t("noSessions")}</p>
      )}

      {sessions.map((session, idx) => {
        const id = Number(session.id);
        const isExpanded = expanded === id;

        return (
          <div key={id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(isExpanded ? null : id)}
            >
              <span className="flex-1 text-sm text-white font-medium truncate">
                {session.name_sv || session.name_fa || `${t("session")} ${idx + 1}`}
              </span>
              {session.date && (
                <span className="text-xs text-white/40 shrink-0">{session.date}</span>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary/70 border border-primary/20 shrink-0">
                {String(session.capacity)} / +{String(session.bufferCapacity)}
              </span>
              {!readOnly && (
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                    title={t("moveUp")}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === sessions.length - 1}
                    className="p-1 text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                    title={t("moveDown")}
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                    title={t("removeSession")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Expanded edit area */}
            {isExpanded && !readOnly && (
              <div className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("sessionName")} (FA)</label>
                    <input
                      type="text"
                      value={session.name_fa}
                      onChange={(e) => update(idx, { name_fa: e.target.value })}
                      placeholder="روز اول"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("sessionName")} (SV)</label>
                    <input
                      type="text"
                      value={session.name_sv}
                      onChange={(e) => update(idx, { name_sv: e.target.value })}
                      placeholder="Dag 1"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("sessionDate")}</label>
                  <input
                    type="date"
                    value={session.date}
                    onChange={(e) => update(idx, { date: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("sessionCapacity")}</label>
                    <input
                      type="number"
                      min={1}
                      value={String(session.capacity)}
                      onChange={(e) => update(idx, { capacity: BigInt(Math.max(1, Number(e.target.value) || 1)) })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("sessionBuffer")}</label>
                    <input
                      type="number"
                      min={0}
                      value={String(session.bufferCapacity)}
                      onChange={(e) => update(idx, { bufferCapacity: BigInt(Math.max(0, Number(e.target.value) || 0)) })}
                      className={inputClass}
                    />
                    <p className="text-xs text-white/30 mt-1">{t("sessionBufferHint")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!readOnly && (
        <button
          type="button"
          onClick={addSession}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 text-sm transition-colors"
        >
          <Plus size={16} />
          {t("addSession")}
        </button>
      )}
    </div>
  );
}
