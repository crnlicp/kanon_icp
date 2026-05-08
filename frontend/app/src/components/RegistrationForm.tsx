import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Copy } from "lucide-react";
import { useI18n } from "../i18n";
import SessionSelector from "./SessionSelector";
import type { FormFieldReturn, EventSessionReturn, SessionAvailabilityReturn, RegistrationWithStatusReturn } from "../backend/api/backend";

const PHONE_PATTERN = "\\+[0-9]{11}";

interface RegistrationFormProps {
  activityId: number;
  formFields: FormFieldReturn[] | null;
  sessions: EventSessionReturn[];
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

export default function RegistrationForm({ activityId, formFields, sessions }: RegistrationFormProps) {
  const { t, localized } = useI18n();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [dynamicFormData, setDynamicFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [selectedSessionIds, setSelectedSessionIds] = useState<number[]>([]);
  const [personCount, setPersonCount] = useState(1);
  const [availability, setAvailability] = useState<SessionAvailabilityReturn[]>([]);
  const [unavailableIds, setUnavailableIds] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successRegistration, setSuccessRegistration] = useState<RegistrationWithStatusReturn | null>(null);

  useEffect(() => {
    if (sessions.length > 0) {
      import("../actor").then(({ backend }) => {
        backend.getSessionAvailability(BigInt(activityId)).then(setAvailability);
      });
    }
  }, [activityId, sessions.length]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setErrorMsg(null);
      setUnavailableIds([]);
      try {
        const { backend } = await import("../actor");

        const fieldValues = formFields
          ? formFields.map((field) => ({
              fieldId: field.id,
              value: dynamicFormData[String(field.id)] || "",
            }))
          : [];

        const result = await backend.submitRegistration(
          BigInt(activityId),
          formFields ? "" : formData.name,
          formFields ? "" : formData.email,
          formFields ? "" : formData.phone,
          formFields ? "" : formData.message,
          BigInt(personCount),
          selectedSessionIds.map(BigInt),
          fieldValues,
        );

        if (result.__kind__ === "ok") {
          setSuccessRegistration(result.ok);
          setFormData({ name: "", email: "", phone: "", message: "" });
          setDynamicFormData({});
          setSelectedSessionIds([]);
          setPersonCount(1);
        } else if (result.__kind__ === "sessionsUnavailable") {
          setUnavailableIds(result.sessionsUnavailable.map(Number));
          setErrorMsg(t("sessionsUnavailableError"));
          backend.getSessionAvailability(BigInt(activityId)).then(setAvailability);
        } else if (result.__kind__ === "phoneNotAllowed") {
          setErrorMsg(t("phoneNotAllowedError"));
        } else if (result.__kind__ === "maxRegistrationsReached") {
          setErrorMsg(t("maxRegistrationsError"));
        } else if (result.__kind__ === "duplicateEmail") {
          setErrorMsg(t("duplicateEmailError"));
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
    [activityId, formData, dynamicFormData, formFields, personCount, selectedSessionIds, t],
  );

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
          {successRegistration.selectedSessions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-white/40 uppercase tracking-wide">{t("selectedSessions")}</p>
              <div className="flex flex-wrap gap-2">
                {successRegistration.selectedSessions.map((ss) => (
                  <span
                    key={Number(ss.sessionId)}
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      ss.status === "confirmed"
                        ? "bg-green-500/15 text-green-400 border-green-500/20"
                        : "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    {ss.sessionName} · {ss.status === "confirmed" ? t("confirmedStatus") : t("bufferStatus")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Session selector */}
      {sessions.length > 0 && availability.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-white/50">{t("sessions")}</p>
          <SessionSelector
            availability={availability}
            selectedIds={selectedSessionIds}
            personCount={personCount}
            onSelectionChange={setSelectedSessionIds}
            onPersonCountChange={setPersonCount}
            unavailableIds={unavailableIds}
          />
          {sessions.length > 0 && selectedSessionIds.length === 0 && (
            <p className="text-xs text-red-400/80 mt-1">{t("selectAtLeastOneSession")}</p>
          )}
        </div>
      )}

      {/* Form fields */}
      {formFields ? (
        formFields.map((field) => {
          const fieldId = String(field.id);
          const label = localized(field.label_fa, field.label_sv);
          const placeholder = localized(field.placeholder_fa, field.placeholder_sv);
          const value = dynamicFormData[fieldId] || "";
          const onChange = (val: string) =>
            setDynamicFormData((prev) => ({ ...prev, [fieldId]: val }));

          return (
            <div key={fieldId}>
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
                          name={`field-${fieldId}`}
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
                </label>
              ) : (
                <input
                  type={
                    field.fieldType === "email"
                      ? "email"
                      : field.fieldType === "phone"
                        ? "tel"
                        : field.fieldType === "number"
                          ? "number"
                          : field.fieldType === "date"
                            ? "date"
                            : "text"
                  }
                  dir={field.fieldType === "number" || field.fieldType === "phone" ? "ltr" : undefined}
                  pattern={field.fieldType === "phone" ? PHONE_PATTERN : undefined}
                  title={field.fieldType === "phone" ? t("phoneFormat") : undefined}
                  placeholder={field.fieldType === "phone" && !placeholder ? t("phonePlaceholder") : placeholder}
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
              <input
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t("phonePlaceholder")}
                pattern={PHONE_PATTERN}
                title={t("phoneFormat")}
                className={inputClass}
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
        disabled={submitting || (sessions.length > 0 && selectedSessionIds.length === 0)}
        className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? t("loading") : t("submit")}
      </motion.button>
    </form>
  );
}
