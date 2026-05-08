import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Edit2, Trash2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { useI18n } from "../i18n";
import SessionSelector from "./SessionSelector";
import type { RegistrationWithStatusReturn, SessionAvailabilityReturn } from "../backend/api/backend";

interface LookupField {
  fieldId: bigint;
  label_fa: string;
  label_sv: string;
}

interface Props {
  activityId: number;
  availability: SessionAvailabilityReturn[];
  lookupField?: LookupField;
}

type LookupState = "idle" | "loading" | "found" | "notFound" | "modifying" | "cancelling";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

export default function RegistrationLookup({ activityId: _activityId, availability, lookupField }: Props) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupValue, setLookupValue] = useState("");
  const [state, setState] = useState<LookupState>("idle");
  const [registration, setRegistration] = useState<RegistrationWithStatusReturn | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modify state
  const [modifySessionIds, setModifySessionIds] = useState<number[]>([]);
  const [modifyPersonCount, setModifyPersonCount] = useState(1);
  const [modifyUnavailableIds, setModifyUnavailableIds] = useState<number[]>([]);
  const [modifying, setModifying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const lookupLabel = lookupField
    ? (lang === "fa" ? lookupField.label_fa : lookupField.label_sv)
    : t("phone");

  const handleLookup = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim() || !lookupValue.trim()) return;
    setState("loading");
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const { backend } = await import("../actor");
      const result = await backend.getRegistrationById(BigInt(lookupId), lookupValue.trim());
      if (result) {
        setRegistration(result);
        setState("found");
      } else {
        setState("notFound");
      }
    } catch {
      setState("notFound");
    }
  }, [lookupId, lookupValue]);

  const startModify = () => {
    if (!registration) return;
    setModifySessionIds(registration.selectedSessions.map((s) => Number(s.sessionId)));
    setModifyPersonCount(Number(registration.personCount) || 1);
    setModifyUnavailableIds([]);
    setState("modifying");
  };

  const handleModify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;
    setModifying(true);
    setErrorMsg(null);
    try {
      const { backend } = await import("../actor");
      const result = await backend.modifyRegistration(
        registration.id,
        lookupValue.trim(),
        BigInt(modifyPersonCount),
        modifySessionIds.map(BigInt),
        [],
      );
      if (result.__kind__ === "ok") {
        setRegistration(result.ok);
        setModifyUnavailableIds([]);
        setState("found");
      } else if (result.__kind__ === "sessionsUnavailable") {
        setModifyUnavailableIds(result.sessionsUnavailable.map(Number));
        setErrorMsg(t("sessionsUnavailableError"));
      } else {
        setErrorMsg(t("registrationError" as Parameters<typeof t>[0]));
      }
    } catch {
      setErrorMsg(t("registrationError" as Parameters<typeof t>[0]));
    }
    setModifying(false);
  };

  const startCancel = () => setState("cancelling");

  const handleCancel = async () => {
    if (!registration) return;
    setCancelling(true);
    try {
      const { backend } = await import("../actor");
      const ok = await backend.cancelRegistration(registration.id, lookupValue.trim());
      if (ok) {
        setRegistration(null);
        setSuccessMsg(t("registrationCancelled"));
        setState("idle");
        setLookupId("");
        setLookupValue("");
      } else {
        setErrorMsg(t("registrationNotFound"));
        setState("found");
      }
    } catch {
      setErrorMsg(t("registrationError" as Parameters<typeof t>[0]));
      setState("found");
    }
    setCancelling(false);
  };

  const reset = () => {
    setState("idle");
    setRegistration(null);
    setErrorMsg(null);
    setModifyUnavailableIds([]);
  };

  const formatDate = (ns: bigint) => {
    const ms = Number(ns) / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors w-full"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{t("findMyRegistration")}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {successMsg && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  {successMsg}
                </div>
              )}

              {(state === "idle" || state === "loading" || state === "notFound") && (
                <form onSubmit={handleLookup} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-white/40 mb-1">{t("registrationId")}</label>
                      <input
                        type="number"
                        min={1}
                        value={lookupId}
                        onChange={(e) => setLookupId(e.target.value)}
                        placeholder="#"
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 mb-1">{lookupLabel}</label>
                      <input
                        type={lookupField ? "text" : "tel"}
                        value={lookupValue}
                        onChange={(e) => setLookupValue(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>
                  {state === "notFound" && (
                    <p className="text-sm text-red-400">{t("registrationNotFound")}</p>
                  )}
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
                  >
                    <Search size={15} />
                    {state === "loading" ? t("loading") : t("findRegistration")}
                  </button>
                </form>
              )}

              {state === "found" && registration && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white font-semibold">{registration.name}</p>
                        <p className="text-sm text-white/50">{registration.email}</p>
                        {registration.phone && (
                          <p className="text-sm text-white/50">{registration.phone}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-white/30">{formatDate(registration.createdAt)}</p>
                        <p className="text-xs text-white/40 mt-1 flex items-center gap-1 justify-end">
                          <Users size={11} />
                          {t("groupOf")} {String(registration.personCount)}
                        </p>
                      </div>
                    </div>

                    {registration.selectedSessions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-white/40 uppercase tracking-wide">{t("selectedSessions")}</p>
                        {registration.selectedSessions.map((ss) => (
                          <div key={Number(ss.sessionId)} className="flex items-center gap-2">
                            <span className="text-sm text-white/80">{ss.sessionName}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                ss.status === "confirmed"
                                  ? "bg-green-500/15 text-green-400 border-green-500/20"
                                  : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                              }`}
                            >
                              {ss.status === "confirmed" ? t("confirmedStatus") : t("bufferStatus")}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {registration.fieldValues.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-white/5">
                        {registration.fieldValues.map((fv, i) => (
                          <div key={i} className="flex gap-2 text-sm">
                            <span className="text-white/40 shrink-0 min-w-[100px]">{fv.fieldLabel}:</span>
                            <span className="text-white/70">{fv.value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={startModify}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm transition-colors"
                    >
                      <Edit2 size={14} />
                      {t("modifyRegistration")}
                    </button>
                    <button
                      type="button"
                      onClick={startCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-colors"
                    >
                      <Trash2 size={14} />
                      {t("cancelRegistration")}
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                      <X size={14} />
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}

              {state === "modifying" && (
                <form onSubmit={handleModify} className="space-y-4">
                  <p className="text-sm text-white/60">{t("modifyRegistration")}</p>

                  {availability.length > 0 && (
                    <SessionSelector
                      availability={availability}
                      selectedIds={modifySessionIds}
                      personCount={modifyPersonCount}
                      onSelectionChange={setModifySessionIds}
                      onPersonCountChange={setModifyPersonCount}
                      unavailableIds={modifyUnavailableIds}
                    />
                  )}

                  {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={modifying}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      {modifying ? t("loading") : t("saveChanges")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setState("found"); setErrorMsg(null); }}
                      className="px-4 py-2.5 text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </form>
              )}

              {state === "cancelling" && (
                <div className="space-y-4">
                  <p className="text-sm text-white/70">{t("confirmCancel")}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      {cancelling ? t("loading") : t("cancelRegistration")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setState("found")}
                      className="px-4 py-2.5 text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                      {t("cancel")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
