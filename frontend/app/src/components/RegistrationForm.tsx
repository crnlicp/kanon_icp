import { useState, useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy, Plus, Trash2 } from "lucide-react";
import { useI18n } from "../i18n";
import SessionSelector from "./SessionSelector";
import PhoneInput from "./PhoneInput";
import type {
  FormFieldReturn,
  EventSessionReturn,
  SessionAvailabilityReturn,
  RegistrationWithStatusReturn,
  ActivityRegistrationConfigReturn,
} from "../backend/api/backend";

interface RegistrationFormProps {
  activityId: number;
  formFields: FormFieldReturn[] | null;
  sessions: EventSessionReturn[];
  /**
   * Optional split-fields config (returned by `getActivityRegistrationConfig`).
   * When provided with `perMemberMode = true`, the form renders a per-member
   * member-cards UI and submits a `members` payload to the backend.
   */
  registrationConfig?: ActivityRegistrationConfigReturn | null;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

type MemberValues = Record<string, string>;

/**
 * Derive how many of the supplied members count toward session capacity.
 * A member is excluded when at least one perMember checkbox field with
 * `excludeFromCapacityWhenChecked` is ticked (value === "true").
 */
function countMembersForCapacity(members: MemberValues[], perMemberFields: FormFieldReturn[]): number {
  const excludeFieldIds = perMemberFields
    .filter((f) => f.fieldType === "checkbox" && f.excludeFromCapacityWhenChecked)
    .map((f) => String(f.id));
  if (excludeFieldIds.length === 0) return members.length;
  return members.reduce((acc, m) => {
    const excluded = excludeFieldIds.some((fid) => m[fid] === "true");
    return acc + (excluded ? 0 : 1);
  }, 0);
}

export default function RegistrationForm({ activityId, formFields, sessions, registrationConfig }: RegistrationFormProps) {
  const { t, localized } = useI18n();
  const perMemberMode = !!registrationConfig?.perMemberMode;
  const perMemberSessionSelection = !!registrationConfig?.perMemberSessionSelection;
  const sharedFields = useMemo(
    () => (perMemberMode ? registrationConfig?.sharedFields ?? [] : null),
    [perMemberMode, registrationConfig?.sharedFields],
  );
  const perMemberFields = useMemo(
    () => (perMemberMode ? registrationConfig?.perMemberFields ?? [] : []),
    [perMemberMode, registrationConfig?.perMemberFields],
  );
  // Min/max apply in both per-member and shared modes (general bounds for personCount).
  const minMembers = Number(registrationConfig?.minMembers ?? 1n);
  const maxMembers = Number(registrationConfig?.maxMembers ?? 20n);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [dynamicFormData, setDynamicFormData] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<MemberValues[]>(() => Array.from({ length: minMembers }, () => ({})));
  const [memberSessions, setMemberSessions] = useState<number[][]>(() => Array.from({ length: minMembers }, () => []));
  const [submitting, setSubmitting] = useState(false);

  const [selectedSessionIds, setSelectedSessionIds] = useState<number[]>([]);
  const [personCount, setPersonCount] = useState(1);
  const [availability, setAvailability] = useState<SessionAvailabilityReturn[]>([]);
  const [unavailableIds, setUnavailableIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<RegistrationWithStatusReturn | null>(null);
  const [bufferPrompt, setBufferPrompt] = useState<{ sessionIds: number[] } | null>(null);

  // Keep members list in range when min/max from config arrive late.
  useEffect(() => {
    if (!perMemberMode) return;
    setMembers((prev) => {
      let next = prev;
      if (next.length < minMembers) next = [...next, ...Array.from({ length: minMembers - next.length }, () => ({}))];
      if (next.length > maxMembers) next = next.slice(0, maxMembers);
      return next === prev ? prev : next;
    });
  }, [perMemberMode, minMembers, maxMembers]);

  // Keep shared-mode personCount in [minMembers, maxMembers] when bounds change.
  useEffect(() => {
    if (perMemberMode) return;
    setPersonCount((prev) => Math.max(minMembers, Math.min(maxMembers, prev)));
  }, [perMemberMode, minMembers, maxMembers]);

  const effectivePersonCount = useMemo(() => {
    if (!perMemberMode) return personCount;
    return Math.max(0, countMembersForCapacity(members, perMemberFields));
  }, [perMemberMode, personCount, members, perMemberFields]);

  useEffect(() => {
    if (sessions.length > 0) {
      import("../actor").then(({ backend }) => {
        backend.getSessionAvailability(BigInt(activityId)).then(setAvailability);
      });
    }
  }, [activityId, sessions.length]);

  const updateMember = (idx: number, fieldId: string, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [fieldId]: value } : m)));
  };

  const updateMemberSessions = (idx: number, ids: number[]) => {
    setMemberSessions((prev) => prev.map((s, i) => (i === idx ? ids : s)));
  };

  const addMember = () => {
    setMembers((prev) => (prev.length < maxMembers ? [...prev, {}] : prev));
    setMemberSessions((prev) => (prev.length < maxMembers ? [...prev, []] : prev));
  };

  const removeMember = (idx: number) => {
    setMembers((prev) => (prev.length > minMembers ? prev.filter((_, i) => i !== idx) : prev));
    setMemberSessions((prev) => (prev.length > minMembers ? prev.filter((_, i) => i !== idx) : prev));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent | null, acceptBuffer = false) => {
      if (e) e.preventDefault();
      setSubmitting(true);
      setErrorMsg(null);
      setUnavailableIds([]);
      try {
        const { backend } = await import("../actor");

        // Build the shared `fieldValues` payload — when in per-member mode, only
        // submit the shared fields; otherwise submit the whole flat `formFields`.
        const valuesSource = perMemberMode ? sharedFields ?? [] : formFields ?? [];
        const fieldValues = valuesSource.map((field) => ({
          fieldId: field.id,
          value: dynamicFormData[String(field.id)] || "",
        }));

        // Per-member payload: array of per-member field-value arrays.
        const membersPayload = perMemberMode
          ? members.map((m) =>
              perMemberFields.map((f) => ({
                fieldId: f.id,
                value: m[String(f.id)] || "",
              })),
            )
          : [];

        // Per-member session IDs (only when this mode is enabled).
        // Members excluded from capacity still report which sessions they
        // attend; the backend skips them when computing per-session load.
        const memberSessionIdsPayload: bigint[][] | null = perMemberMode && perMemberSessionSelection
          ? memberSessions.map((ids) => ids.map(BigInt))
          : null;

        // When per-member mode is on, the backend computes the effective person
        // count from the members list, but we also pass it as `personCount` so
        // legacy views display a sensible number.
        const submittedPersonCount = perMemberMode ? BigInt(effectivePersonCount || 1) : BigInt(personCount);

        // Top-level session IDs: when per-member-session mode is on, the backend
        // derives them from the union of member lists, but we still pass an
        // empty array to keep the candid happy.
        const topSessionIds = perMemberMode && perMemberSessionSelection
          ? []
          : selectedSessionIds.map(BigInt);

        const result = await backend.submitRegistration(
          BigInt(activityId),
          formFields ? "" : formData.name,
          formFields ? "" : formData.email,
          formFields ? "" : formData.phone,
          formFields ? "" : formData.message,
          submittedPersonCount,
          topSessionIds,
          fieldValues,
          membersPayload,
          memberSessionIdsPayload,
          acceptBuffer,
        );

        if (result.__kind__ === "ok") {
          setBufferPrompt(null);
          setSuccessRegistration(result.ok);
          setFormData({ name: "", email: "", phone: "", message: "" });
          setDynamicFormData({});
          setMembers(Array.from({ length: minMembers }, () => ({})));
          setMemberSessions(Array.from({ length: minMembers }, () => []));
          setSelectedSessionIds([]);
          setPersonCount(1);
        } else if (result.__kind__ === "sessionsRequireBuffer") {
          // Surface a confirm dialog; on accept, resubmit with acceptBuffer=true.
          setBufferPrompt({ sessionIds: result.sessionsRequireBuffer.map(Number) });
        } else if (result.__kind__ === "sessionsUnavailable") {
          setUnavailableIds(result.sessionsUnavailable.map(Number));
          setErrorMsg(t("sessionsUnavailableError"));
          backend.getSessionAvailability(BigInt(activityId)).then(setAvailability);
        } else if (result.__kind__ === "valueNotAllowed") {
          setErrorMsg(t("valueNotAllowedError"));
        } else if (result.__kind__ === "duplicateValue") {
          setErrorMsg(t("duplicateValueError"));
        } else if (result.__kind__ === "capacityFull") {
          setErrorMsg(t("capacityFullError"));
        } else {
          setErrorMsg(t("registrationError"));
        }
      } catch {
        setErrorMsg(t("registrationError"));
      }
      setSubmitting(false);
    },
    [activityId, formData, dynamicFormData, formFields, perMemberMode, perMemberSessionSelection, sharedFields, perMemberFields, members, memberSessions, effectivePersonCount, personCount, selectedSessionIds, minMembers, t],
  );

  const renderField = (
    field: FormFieldReturn,
    value: string,
    onChange: (val: string) => void,
    keyPrefix: string,
  ) => {
    const fieldId = String(field.id);
    const label = localized(field.label_fa, field.label_sv);
    const placeholder = localized(field.placeholder_fa, field.placeholder_sv);
    return (
      <div key={`${keyPrefix}-${fieldId}`}>
        <label className="block text-sm text-white/50 mb-1.5">
          {label} {field.required && <span className="text-accent">*</span>}
        </label>
        {field.fieldType === "textarea" ? (
          <textarea
            rows={4}
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputClass} resize-none`}
          />
        ) : field.fieldType === "select" ? (
          <select
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          >
            <option value="" className="bg-black/70">{placeholder || `-- ${label} --`}</option>
            {field.options.map((opt, i) => (
              <option key={i} value={localized(opt.fa, opt.sv)} className="bg-black/70">
                {localized(opt.fa, opt.sv)}
              </option>
            ))}
          </select>
        ) : field.fieldType === "radio" ? (
          <div className="space-y-2 mt-1">
            {field.options.map((opt, i) => {
              const optVal = localized(opt.fa, opt.sv);
              return (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`field-${keyPrefix}-${fieldId}`}
                    value={optVal}
                    checked={value === optVal}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required && !value}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-white/70">{optVal}</span>
                </label>
              );
            })}
          </div>
        ) : field.fieldType === "checkbox" ? (
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={value === "true"}
              onChange={(e) => onChange(e.target.checked ? "true" : "")}
              required={field.required}
              className="w-4 h-4 rounded accent-primary"
            />
            <span className="text-sm text-white/70">{placeholder}</span>
            {field.excludeFromCapacityWhenChecked && (
              <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-white/15 text-white/40">
                {t("notCountedTowardCapacity")}
              </span>
            )}
          </label>
        ) : field.fieldType === "phone" ? (
          <PhoneInput
            required={field.required}
            value={value}
            onChange={onChange}
            placeholder={placeholder || t("phonePlaceholder")}
            title={t("phoneFormat")}
          />
        ) : (
          <input
            type={
              field.fieldType === "email"
                ? "email"
                : field.fieldType === "number"
                  ? "number"
                  : field.fieldType === "date"
                    ? "date"
                    : "text"
            }
            dir={field.fieldType === "number" ? "ltr" : undefined}
            placeholder={placeholder}
            min={field.fieldType === "number" && field.minValue != null ? Number(field.minValue) : undefined}
            max={field.fieldType === "number" && field.maxValue != null ? Number(field.maxValue) : undefined}
            required={field.required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        )}
      </div>
    );
  };

  if (successRegistration) {
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/20 space-y-3">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle size={18} />
            <span className="font-semibold">{t("registrationSuccess")}</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-white/60">{t("saveRegistrationId")}</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">#{String(successRegistration.id)}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(String(successRegistration.id))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/50 hover:text-white transition-colors"
                title="Copy ID"
              >
                <Copy size={13} />
              </button>
            </div>
            <p className="text-xs text-white/40">{t("saveRegistrationIdHint")}</p>
          </div>
          {successRegistration.members && successRegistration.members.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-white/40 uppercase tracking-wide">{t("perMemberFields")}</p>
              <ul className="space-y-2 text-sm text-white/70">
                {successRegistration.members.map((m, i) => (
                  <li key={i} className="border-l border-white/10 pl-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-white/40">#{i + 1}</span>
                      <span>
                        {m.values
                          .map((v) => v.value)
                          .filter((v) => v && v !== "false")
                          .map((v) => (v === "true" ? "✓" : v))
                          .join(" · ") || `${t("member")} ${i + 1}`}
                      </span>
                      {!m.countsTowardCapacity && (
                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-white/15 text-white/40">
                          {t("notCountedTowardCapacity")}
                        </span>
                      )}
                    </div>
                    {(m.selectedSessions ?? []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {m.selectedSessions.map((ss) => {
                          const s = sessions.find((sx) => Number(sx.id) === Number(ss.sessionId));
                          const name = s ? localized(s.name_fa, s.name_sv) : ss.sessionName;
                          return (
                            <span
                              key={Number(ss.sessionId)}
                              className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                                ss.status === "confirmed"
                                  ? "bg-green-500/15 text-green-400 border-green-500/20"
                                  : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                              }`}
                            >
                              {name} · {ss.status === "confirmed" ? t("confirmedStatus") : t("bufferStatus")}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {(() => {
            const hasPerMemberSessions = (successRegistration.members ?? []).some(
              (m) => (m.selectedSessions ?? []).length > 0,
            );
            if (hasPerMemberSessions) return null;
            if (successRegistration.selectedSessions.length === 0) return null;
            return (
              <div className="space-y-1.5">
                <p className="text-xs text-white/40 uppercase tracking-wide">{t("selectedSessions")}</p>
                <div className="flex flex-wrap gap-2">
                  {successRegistration.selectedSessions.map((ss) => {
                    const s = sessions.find((sx) => Number(sx.id) === Number(ss.sessionId));
                    const name = s ? localized(s.name_fa, s.name_sv) : ss.sessionName;
                    return (
                      <span
                        key={Number(ss.sessionId)}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          ss.status === "confirmed"
                            ? "bg-green-500/15 text-green-400 border-green-500/20"
                            : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {name} · {ss.status === "confirmed" ? t("confirmedStatus") : t("bufferStatus")}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  const memberCountForSession = perMemberMode ? effectivePersonCount : personCount;
  const memberLimitErr = perMemberMode && members.length < minMembers
    ? t("memberLimitMin")
    : perMemberMode && members.length > maxMembers
      ? t("memberLimitExceeded")
      : null;

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
      {/* Session selector — hidden when each member picks sessions individually. */}
      {sessions.length > 0 && availability.length > 0 && !(perMemberMode && perMemberSessionSelection) && (
        <div className="space-y-2">
          <p className="text-sm text-white/50">{t("sessions")}</p>
          <SessionSelector
            availability={availability}
            selectedIds={selectedSessionIds}
            personCount={memberCountForSession}
            onSelectionChange={setSelectedSessionIds}
            onPersonCountChange={setPersonCount}
            unavailableIds={unavailableIds}
            disablePersonCounter={perMemberMode}
            minPersonCount={minMembers}
            maxPersonCount={maxMembers}
          />
          {sessions.length > 0 && selectedSessionIds.length === 0 && (
            <p className="text-xs text-red-400/80 mt-1">{t("selectAtLeastOneSession")}</p>
          )}
        </div>
      )}

      {/* Per-member mode: shared fields + member cards */}
      {perMemberMode ? (
        <>
          {sharedFields && sharedFields.length > 0 && (
            <div className="space-y-4">
              <p className="text-xs text-white/40 uppercase tracking-wide">{t("sharedFields")}</p>
              {sharedFields.map((field) => {
                const fid = String(field.id);
                return renderField(
                  field,
                  dynamicFormData[fid] || "",
                  (val) => setDynamicFormData((prev) => ({ ...prev, [fid]: val })),
                  "shared",
                );
              })}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/40 uppercase tracking-wide">{t("perMemberFields")}</p>
              <span className="text-xs text-white/40">
                {members.length} / {maxMembers}
              </span>
            </div>

            {members.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{t("member")} #{idx + 1}</span>
                  {members.length > minMembers && (
                    <button
                      type="button"
                      onClick={() => removeMember(idx)}
                      className="p-1.5 rounded hover:bg-accent/10 text-white/40 hover:text-accent"
                      title={t("removeMember")}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                {perMemberFields.map((field) => {
                  const fid = String(field.id);
                  return renderField(
                    field,
                    m[fid] || "",
                    (val) => updateMember(idx, fid, val),
                    `m${idx}`,
                  );
                })}
                {perMemberSessionSelection && sessions.length > 0 && availability.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs text-white/40 mb-1.5">{t("sessions")}</p>
                    <SessionSelector
                      availability={availability}
                      selectedIds={memberSessions[idx] ?? []}
                      personCount={1}
                      onSelectionChange={(ids) => updateMemberSessions(idx, ids)}
                      onPersonCountChange={() => { /* fixed at 1 per member */ }}
                      unavailableIds={unavailableIds}
                      disablePersonCounter
                      minPersonCount={1}
                      maxPersonCount={1}
                      hidePersonCounter
                    />
                    {(memberSessions[idx]?.length ?? 0) === 0 && (
                      <p className="text-xs text-red-400/80 mt-1">{t("selectAtLeastOneSession")}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {members.length < maxMembers && (
              <button
                type="button"
                onClick={addMember}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors text-sm"
              >
                <Plus size={16} /> {t("addMember")}
              </button>
            )}

            {memberLimitErr && <p className="text-xs text-red-400/80">{memberLimitErr}</p>}
          </div>
        </>
      ) : formFields ? (
        formFields.map((field) => {
          const fid = String(field.id);
          return renderField(
            field,
            dynamicFormData[fid] || "",
            (val) => setDynamicFormData((prev) => ({ ...prev, [fid]: val })),
            "form",
          );
        })
      ) : (
        <>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">{t("name")}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("email")}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("phone")}</label>
              <PhoneInput
                value={formData.phone}
                onChange={(val) => setFormData({ ...formData, phone: val })}
                placeholder={t("phonePlaceholder")}
                title={t("phoneFormat")}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">{t("message")}</label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </div>
        </>
      )}

      {errorMsg && (
        <p className="text-sm text-red-400">{errorMsg}</p>
      )}

      <motion.button
        type="submit"
        disabled={
          submitting ||
          (sessions.length > 0 && !(perMemberMode && perMemberSessionSelection) && selectedSessionIds.length === 0) ||
          (perMemberMode && perMemberSessionSelection && members.some((_m, i) =>
            (memberSessions[i]?.length ?? 0) === 0,
          )) ||
          (perMemberMode && (members.length < minMembers || members.length > maxMembers))
        }
        className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? t("loading") : t("submit")}
      </motion.button>

      {bufferPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-navy border border-white/10 p-5 space-y-4">
            <h3 className="text-lg font-semibold text-white">{t("bufferConfirmTitle")}</h3>
            <p className="text-sm text-white/70">{t("bufferConfirmBody")}</p>
            <ul className="text-sm text-yellow-300/90 space-y-1">
              {bufferPrompt.sessionIds.map((sid) => {
                const s = sessions.find((ss) => Number(ss.id) === sid);
                if (!s) return null;
                return (
                  <li key={sid}>
                    {localized(s.name_fa, s.name_sv)}{s.date ? ` · ${s.date}` : ""}
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setBufferPrompt(null); setSubmitting(false); }}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {t("bufferCancelButton")}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(null, true)}
                disabled={submitting}
                className="px-4 py-2 rounded-lg text-sm bg-primary hover:bg-primary-dark text-navy font-semibold disabled:opacity-50"
              >
                {t("bufferContinueButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
