import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useI18n } from "../i18n";
import type { FormFieldReturn } from "../backend/api/backend";

interface RegistrationFormProps {
  activityId: number;
  formFields: FormFieldReturn[] | null;
  onSuccess: () => void;
  onError: () => void;
}

export default function RegistrationForm({ activityId, formFields, onSuccess, onError }: RegistrationFormProps) {
  const { t, localized } = useI18n();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [dynamicFormData, setDynamicFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
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
          fieldValues,
        );
        if (result) {
          setFormData({ name: "", email: "", phone: "", message: "" });
          setDynamicFormData({});
          onSuccess();
        } else {
          onError();
        }
      } catch {
        onError();
      }
      setSubmitting(false);
    },
    [activityId, formData, dynamicFormData, formFields, onSuccess, onError],
  );

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={inputClass.replace("bg-white/5", "bg-[#1a1a2e]")}
                >
                  <option value="" className="bg-[#1a1a2e] text-white">{placeholder || `-- ${label} --`}</option>
                  {field.options.map((opt, i) => (
                    <option key={i} value={localized(opt.fa, opt.sv)} className="bg-[#1a1a2e] text-white">
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
                  required={field.required}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
      <motion.button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? t("loading") : t("submit")}
      </motion.button>
    </form>
  );
}
