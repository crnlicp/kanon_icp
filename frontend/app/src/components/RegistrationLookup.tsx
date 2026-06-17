import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Edit2, Trash2, ChevronDown, ChevronUp, Users, Plus } from "lucide-react";
import { useI18n } from "../i18n";
import SessionSelector from "./SessionSelector";
import PhoneInput from "./PhoneInput";
import type {
  RegistrationWithStatusReturn,
  SessionAvailabilityReturn,
  ActivityRegistrationConfigReturn,
  FormFieldReturn,
} from "../backend/api/backend";

interface LookupField {
  fieldId: bigint;
  fieldType: string;
  label_fa: string;
  label_sv: string;
}

interface Props {
  activityId: number;
  availability: SessionAvailabilityReturn[];
  lookupField?: LookupField;
  /**
   * Per-member registration config. When `perMemberMode` is true, the modify
   * view exposes a member editor and computes the new effective person count.
   */
  registrationConfig?: ActivityRegistrationConfigReturn | null;
}

type LookupState = "idle" | "loading" | "found" | "notFound" | "modifying" | "cancelling";

type MemberValues = Record<string, string>;

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

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

export default function RegistrationLookup({ activityId: _activityId, availability, lookupField, registrationConfig }: Props) {
  const { t, lang, localized } = useI18n();
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
  const [modifyMembers, setModifyMembers] = useState<MemberValues[]>([]);
  const [modifyFieldValues, setModifyFieldValues] = useState<Record<string, string>>({});
  const [modifyUnavailableIds, setModifyUnavailableIds] = useState<number[]>([]);
  const [modifying, setModifying] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const perMemberMode = !!registrationConfig?.perMemberMode;
  const perMemberFields = registrationConfig?.perMemberFields ?? [];
  // Shared fields: all non-perMember activity fields (still relevant in shared mode).
  // Lookup field is included but rendered read-only so users don't lock themselves out.
  const sharedFields = registrationConfig?.sharedFields ?? [];
  const minMembers = perMemberMode ? Number(registrationConfig?.minMembers ?? 1n) : 1;
  const maxMembers = perMemberMode ? Number(registrationConfig?.maxMembers ?? 20n) : 20;

  const effectiveModifyCount = useMemo(() => {
    if (!perMemberMode) return modifyPersonCount;
    return Math.max(0, countMembersForCapacity(modifyMembers, perMemberFields));
  }, [perMemberMode, modifyPersonCount, modifyMembers, perMemberFields]);

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
    // Seed shared (top-level) field values from the existing registration
    // so users don't lose them when saving the edit.
    const seededShared: Record<string, string> = {};
    for (const fv of registration.fieldValues ?? []) {
      seededShared[String(fv.fieldId)] = fv.value;
    }
    setModifyFieldValues(seededShared);
    if (perMemberMode) {
      // Seed editor with the existing members (or `minMembers` blanks if legacy).
      if (registration.members && registration.members.length > 0) {
        setModifyMembers(
          registration.members.map((m) => {
            const vals: MemberValues = {};
            for (const v of m.values) vals[String(v.fieldId)] = v.value;
            return vals;
          }),
        );
      } else {
        setModifyMembers(Array.from({ length: minMembers }, () => ({})));
      }
    } else {
      setModifyMembers([]);
    }
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
      const newMembersPayload = perMemberMode
        ? modifyMembers.map((m) =>
            perMemberFields.map((f) => ({
              fieldId: f.id,
              value: m[String(f.id)] || "",
            })),
          )
        : [];
      // Always send shared field values so they are preserved across edits.
      const newFieldValuesPayload = sharedFields.map((f) => ({
        fieldId: f.id,
        value: modifyFieldValues[String(f.id)] ?? "",
      }));
      const personCountPayload = perMemberMode
        ? BigInt(effectiveModifyCount || 1)
        : BigInt(modifyPersonCount);
      const result = await backend.modifyRegistration(
        registration.id,
        lookupValue.trim(),
        personCountPayload,
        modifySessionIds.map(BigInt),
        newFieldValuesPayload,
        newMembersPayload,
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
                        dir="ltr"
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
                      {!lookupField || lookupField.fieldType === "phone" ? (
                        <PhoneInput
                          required
                          value={lookupValue}
                          onChange={setLookupValue}
                          placeholder={t("phonePlaceholder")}
                          title={t("phoneFormat")}
                        />
                      ) : (
                        <input
                          type="text"
                          value={lookupValue}
                          onChange={(e) => setLookupValue(e.target.value)}
                          className={inputClass}
                          required
                        />
                      )}
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

                    {registration.members && registration.members.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <p className="text-xs text-white/40 uppercase tracking-wide">{t("perMemberFields")}</p>
                        <ul className="space-y-1.5 text-sm">
                          {registration.members.map((m, i) => (
                            <li key={i} className="flex flex-wrap items-center gap-2">
                              <span className="text-white/40">#{i + 1}</span>
                              <span className="text-white/80">
                                {m.values.map((v) => v.value).filter(Boolean).join(" · ") || `${t("member")} ${i + 1}`}
                              </span>
                              {!m.countsTowardCapacity && (
                                <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-white/15 text-white/40">
                                  {t("notCountedTowardCapacity")}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
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
                      personCount={perMemberMode ? effectiveModifyCount : modifyPersonCount}
                      onSelectionChange={setModifySessionIds}
                      onPersonCountChange={setModifyPersonCount}
                      unavailableIds={modifyUnavailableIds}
                      disablePersonCounter={perMemberMode}
                    />
                  )}

                  {/* Shared / top-level form fields — preserve previously submitted values. */}
                  {sharedFields.length > 0 && (
                    <div className="space-y-3">
                      {sharedFields.map((field) => {
                        const fid = String(field.id);
                        const value = modifyFieldValues[fid] ?? "";
                        const label = localized(field.label_fa, field.label_sv);
                        const placeholder = localized(field.placeholder_fa, field.placeholder_sv);
                        const isLookup = field.isLookupField;
                        const onChange = (val: string) =>
                          setModifyFieldValues((prev) => ({ ...prev, [fid]: val }));
                        return (
                          <div key={fid}>
                            <label className="block text-xs text-white/50 mb-1">
                              {label} {field.required && <span className="text-accent">*</span>}
                            </label>
                            {field.fieldType === "textarea" ? (
                              <textarea
                                rows={3}
                                required={field.required}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                disabled={isLookup}
                                className={`${inputClass} resize-none ${isLookup ? "opacity-60" : ""}`}
                              />
                            ) : field.fieldType === "select" ? (
                              <select
                                required={field.required}
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                disabled={isLookup}
                                className={`${inputClass} ${isLookup ? "opacity-60" : ""}`}
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
                                        name={`modify-field-${fid}`}
                                        value={optVal}
                                        checked={value === optVal}
                                        onChange={(e) => onChange(e.target.value)}
                                        required={field.required && !value}
                                        disabled={isLookup}
                                        className="w-4 h-4 accent-primary"
                                      />
                                      <span className="text-sm text-white/70">{optVal}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            ) : field.fieldType === "checkbox" ? (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value === "true"}
                                  onChange={(e) => onChange(e.target.checked ? "true" : "")}
                                  required={field.required}
                                  disabled={isLookup}
                                  className="w-4 h-4 rounded accent-primary"
                                />
                                <span className="text-sm text-white/70">{placeholder}</span>
                              </label>
                            ) : field.fieldType === "phone" ? (
                              <PhoneInput
                                required={field.required}
                                value={value}
                                onChange={onChange}
                                placeholder={placeholder || t("phonePlaceholder")}
                                title={t("phoneFormat")}
                                disabled={isLookup}
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
                                disabled={isLookup}
                                className={`${inputClass} ${isLookup ? "opacity-60" : ""}`}
                              />
                            )}
                            {isLookup && (
                              <p className="text-[11px] text-white/30 mt-1">{t("lookupFieldHint")}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {perMemberMode && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white/40 uppercase tracking-wide">{t("perMemberFields")}</p>
                        <span className="text-xs text-white/40">{modifyMembers.length} / {maxMembers}</span>
                      </div>
                      {modifyMembers.map((m, idx) => (
                        <div key={idx} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/70">{t("member")} #{idx + 1}</span>
                            {modifyMembers.length > minMembers && (
                              <button
                                type="button"
                                onClick={() => setModifyMembers((prev) => prev.filter((_, i) => i !== idx))}
                                className="p-1.5 rounded hover:bg-accent/10 text-white/40 hover:text-accent"
                                title={t("removeMember")}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          {perMemberFields.map((field) => {
                            const fid = String(field.id);
                            const value = m[fid] || "";
                            const label = localized(field.label_fa, field.label_sv);
                            const placeholder = localized(field.placeholder_fa, field.placeholder_sv);
                            const onChange = (val: string) =>
                              setModifyMembers((prev) => prev.map((mm, i) => (i === idx ? { ...mm, [fid]: val } : mm)));
                            return (
                              <div key={fid}>
                                <label className="block text-xs text-white/50 mb-1">
                                  {label} {field.required && <span className="text-accent">*</span>}
                                </label>
                                {field.fieldType === "checkbox" ? (
                                  <label className="flex items-center gap-2 cursor-pointer">
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
                                    placeholder={placeholder}
                                    required={field.required}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    className={inputClass}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                      {modifyMembers.length < maxMembers && (
                        <button
                          type="button"
                          onClick={() => setModifyMembers((prev) => [...prev, {}])}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors text-sm"
                        >
                          <Plus size={14} /> {t("addMember")}
                        </button>
                      )}
                    </div>
                  )}

                  {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={modifying || (perMemberMode && (modifyMembers.length < minMembers || modifyMembers.length > maxMembers))}
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
