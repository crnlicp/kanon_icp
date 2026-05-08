import { useI18n } from "../i18n";
import type { EventRegistrationTemplateReturn, EventSessionReturn, FormFieldReturn } from "../backend/api/backend";
import SessionBuilder from "./SessionBuilder";
import FormBuilder from "./FormBuilder";

interface Props {
  template: Partial<EventRegistrationTemplateReturn> & {
    name_fa: string;
    name_sv: string;
    description_fa: string;
    description_sv: string;
    sessions: EventSessionReturn[];
    fields: FormFieldReturn[];
  };
  onChange: (patch: Partial<Props["template"]>) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

export default function EventRegistrationTemplateBuilder({ template, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1">{t("templateName")} (فارسی)</label>
          <input
            value={template.name_fa}
            onChange={(e) => onChange({ name_fa: e.target.value })}
            className={inputClass}
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">{t("templateName")} (Svenska)</label>
          <input
            value={template.name_sv}
            onChange={(e) => onChange({ name_sv: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1">{t("templateDescription")} (فارسی)</label>
          <textarea
            value={template.description_fa}
            onChange={(e) => onChange({ description_fa: e.target.value })}
            rows={2}
            className={inputClass}
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1">{t("templateDescription")} (Svenska)</label>
          <textarea
            value={template.description_sv}
            onChange={(e) => onChange({ description_sv: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>
      </div>

      {/* Sessions */}
      <div>
        <p className="text-xs text-white/40 mb-2">{t("sessions")}</p>
        <SessionBuilder
          sessions={template.sessions}
          onChange={(sessions) => onChange({ sessions })}
        />
      </div>

      {/* Custom Fields */}
      <div>
        <p className="text-xs text-white/40 mb-2">{t("addField")}</p>
        <FormBuilder
          fields={template.fields}
          onChange={(fields) => onChange({ fields })}
        />
      </div>
    </div>
  );
}
