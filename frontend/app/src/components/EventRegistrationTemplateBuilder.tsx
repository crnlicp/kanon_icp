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
    perMemberMode: boolean;
    minMembers: bigint;
    maxMembers: bigint;
  };
  onChange: (patch: Partial<Props["template"]>) => void;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

const MAX_PERSON_COUNT = 20;

const clampMember = (n: number) => {
  if (Number.isNaN(n) || n < 1) return 1;
  if (n > MAX_PERSON_COUNT) return MAX_PERSON_COUNT;
  return Math.floor(n);
};

export default function EventRegistrationTemplateBuilder({ template, onChange }: Props) {
  const { t } = useI18n();

  const sharedFields = template.fields.filter((f) => !f.perMember);
  const perMemberFields = template.fields.filter((f) => f.perMember);

  // When user edits one of the two sub-builders, merge the result back into the
  // single `fields` array stored on the template. Each builder is responsible
  // for stamping `perMember` correctly on new fields via the `scopeContext` prop.
  const handleSharedChange = (next: FormFieldReturn[]) => {
    onChange({ fields: [...next.map((f) => ({ ...f, perMember: false })), ...perMemberFields] });
  };
  const handlePerMemberChange = (next: FormFieldReturn[]) => {
    onChange({ fields: [...sharedFields, ...next.map((f) => ({ ...f, perMember: true }))] });
  };
  const handleSingleChange = (next: FormFieldReturn[]) => {
    // Per-member mode is off — force all fields back to shared scope.
    onChange({ fields: next.map((f) => ({ ...f, perMember: false, excludeFromCapacityWhenChecked: false })) });
  };

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

      {/* Per-member mode toggle + limits */}
      <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3 space-y-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={template.perMemberMode}
            onChange={(e) => {
              const enabled = e.target.checked;
              if (!enabled) {
                // Turning off — collapse any per-member fields back into the shared list.
                onChange({
                  perMemberMode: false,
                  fields: template.fields.map((f) => ({ ...f, perMember: false, excludeFromCapacityWhenChecked: false })),
                });
              } else {
                onChange({ perMemberMode: true });
              }
            }}
            className="w-4 h-4 mt-0.5 rounded accent-primary"
          />
          <span className="text-sm text-white/70">
            {t("perMemberMode")}
            <span className="block text-xs text-white/30 mt-0.5">{t("perMemberModeHint")}</span>
          </span>
        </label>

        {template.perMemberMode && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs text-white/40 mb-1">{t("minMembers")}</label>
              <input
                type="number"
                min={1}
                max={MAX_PERSON_COUNT}
                value={Number(template.minMembers)}
                onChange={(e) => {
                  const v = clampMember(parseInt(e.target.value, 10));
                  onChange({ minMembers: BigInt(v) });
                }}
                className={inputClass}
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">{t("maxMembers")}</label>
              <input
                type="number"
                min={1}
                max={MAX_PERSON_COUNT}
                value={Number(template.maxMembers)}
                onChange={(e) => {
                  const v = clampMember(parseInt(e.target.value, 10));
                  onChange({ maxMembers: BigInt(v) });
                }}
                className={inputClass}
                dir="ltr"
              />
            </div>
          </div>
        )}
      </div>

      {/* Field builders */}
      {template.perMemberMode ? (
        <div className="space-y-5">
          <div>
            <p className="text-xs text-white/40 mb-2">{t("sharedFields")}</p>
            <FormBuilder
              fields={sharedFields}
              onChange={handleSharedChange}
              scopeContext="shared"
            />
          </div>
          <div>
            <p className="text-xs text-white/40 mb-2">{t("perMemberFields")}</p>
            <FormBuilder
              fields={perMemberFields}
              onChange={handlePerMemberChange}
              scopeContext="perMember"
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-white/40 mb-2">{t("addField")}</p>
          <FormBuilder
            fields={template.fields}
            onChange={handleSingleChange}
          />
        </div>
      )}
    </div>
  );
}
