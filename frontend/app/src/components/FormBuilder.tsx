import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useI18n } from "../i18n";
import type { FormFieldReturn, FormFieldOptionReturn } from "../backend/api/backend";

const FIELD_TYPES = [
  "text", "textarea", "email", "phone", "number", "select", "radio", "checkbox", "date",
] as const;

const TYPES_WITH_OPTIONS = new Set(["select", "radio"]);

interface Props {
  fields: FormFieldReturn[];
  onChange: (fields: FormFieldReturn[]) => void;
  readOnly?: boolean;
}

const inputClass = "w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";
const selectClass = inputClass.replace("bg-white/5", "bg-[#0f172a]");

export default function FormBuilder({ fields, onChange, readOnly }: Props) {
  const { t } = useI18n();
  const [expandedField, setExpandedField] = useState<number | null>(null);

  const fieldTypeLabel = (type: string) => {
    const key = `fieldType${type.charAt(0).toUpperCase() + type.slice(1)}` as Parameters<typeof t>[0];
    return t(key);
  };

  const nextId = () => {
    const max = fields.reduce((m, f) => Math.max(m, Number(f.id)), 0);
    return BigInt(max + 1);
  };

  const addField = () => {
    const id = nextId();
    const newField: FormFieldReturn = {
      id,
      fieldType: "text",
      label_fa: "",
      label_sv: "",
      placeholder_fa: "",
      placeholder_sv: "",
      required: false,
      options: [],
      sortOrder: BigInt(fields.length + 1),
    };
    onChange([...fields, newField]);
    setExpandedField(Number(id));
  };

  const updateField = (idx: number, patch: Partial<FormFieldReturn>) => {
    const updated = fields.map((f, i) => i === idx ? { ...f, ...patch } : f);
    onChange(updated);
  };

  const removeField = (idx: number) => {
    onChange(fields.filter((_, i) => i !== idx));
  };

  const moveField = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= fields.length) return;
    const updated = [...fields];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    // Re-assign sortOrder
    onChange(updated.map((f, i) => ({ ...f, sortOrder: BigInt(i + 1) })));
  };

  const addOption = (fieldIdx: number) => {
    const field = fields[fieldIdx];
    const newOptions: FormFieldOptionReturn[] = [...field.options, { fa: "", sv: "" }];
    updateField(fieldIdx, { options: newOptions });
  };

  const updateOption = (fieldIdx: number, optIdx: number, patch: Partial<FormFieldOptionReturn>) => {
    const field = fields[fieldIdx];
    const newOptions = field.options.map((o, i) => i === optIdx ? { ...o, ...patch } : o);
    updateField(fieldIdx, { options: newOptions });
  };

  const removeOption = (fieldIdx: number, optIdx: number) => {
    const field = fields[fieldIdx];
    updateField(fieldIdx, { options: field.options.filter((_, i) => i !== optIdx) });
  };

  if (readOnly) {
    return (
      <div className="space-y-2">
        {fields.length === 0 && <p className="text-white/30 text-sm">{t("noFields")}</p>}
        {fields.map((field, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary/70">{fieldTypeLabel(field.fieldType)}</span>
            <span className="text-sm text-white/70 flex-1 truncate">{field.label_sv || field.label_fa}</span>
            {field.required && <span className="text-xs text-accent/60">*</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.length === 0 && <p className="text-white/30 text-sm text-center py-4">{t("noFields")}</p>}
      {fields.map((field, idx) => {
        const isExpanded = expandedField === Number(field.id);
        return (
          <div key={Number(field.id)} className="rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden">
            {/* Header */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => setExpandedField(isExpanded ? null : Number(field.id))}
            >
              <GripVertical size={14} className="text-white/20 shrink-0" />
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary/70 shrink-0">{fieldTypeLabel(field.fieldType)}</span>
              <span className="text-sm text-white/70 flex-1 truncate">{field.label_sv || field.label_fa || `Field ${idx + 1}`}</span>
              {field.required && <span className="text-xs text-accent/60 shrink-0">*</span>}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => moveField(idx, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/70 disabled:opacity-20" title={t("moveUp")}><ChevronUp size={14} /></button>
                <button onClick={() => moveField(idx, 1)} disabled={idx === fields.length - 1} className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/70 disabled:opacity-20" title={t("moveDown")}><ChevronDown size={14} /></button>
                <button onClick={() => removeField(idx)} className="p-1 rounded hover:bg-accent/10 text-white/30 hover:text-accent" title={t("removeField")}><Trash2 size={14} /></button>
              </div>
            </div>

            {/* Expanded editor */}
            {isExpanded && (
              <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">
                {/* Field Type */}
                <div>
                  <label className="block text-xs text-white/40 mb-1">{t("fieldType")}</label>
                  <select
                    value={field.fieldType}
                    onChange={(e) => updateField(idx, { fieldType: e.target.value })}
                    className={selectClass}
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft} value={ft} className="bg-[#0f172a] text-white">{fieldTypeLabel(ft)}</option>
                    ))}
                  </select>
                </div>

                {/* Labels */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("fieldLabel")} (فارسی)</label>
                    <input value={field.label_fa} onChange={(e) => updateField(idx, { label_fa: e.target.value })} className={inputClass} dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("fieldLabel")} (Svenska)</label>
                    <input value={field.label_sv} onChange={(e) => updateField(idx, { label_sv: e.target.value })} className={inputClass} />
                  </div>
                </div>

                {/* Placeholders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("fieldPlaceholder")} (فارسی)</label>
                    <input value={field.placeholder_fa} onChange={(e) => updateField(idx, { placeholder_fa: e.target.value })} className={inputClass} dir="rtl" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1">{t("fieldPlaceholder")} (Svenska)</label>
                    <input value={field.placeholder_sv} onChange={(e) => updateField(idx, { placeholder_sv: e.target.value })} className={inputClass} />
                  </div>
                </div>

                {/* Required */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={field.required} onChange={(e) => updateField(idx, { required: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-white/60">{t("fieldRequired")}</span>
                </label>

                {/* Options (for select/radio) */}
                {TYPES_WITH_OPTIONS.has(field.fieldType) && (
                  <div>
                    <label className="block text-xs text-white/40 mb-2">{t("fieldOptions")}</label>
                    <div className="space-y-2">
                      {field.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <input value={opt.fa} onChange={(e) => updateOption(idx, optIdx, { fa: e.target.value })} placeholder="فارسی" className={`${inputClass} flex-1`} dir="rtl" />
                          <input value={opt.sv} onChange={(e) => updateOption(idx, optIdx, { sv: e.target.value })} placeholder="Svenska" className={`${inputClass} flex-1`} />
                          <button onClick={() => removeOption(idx, optIdx)} className="p-1.5 rounded hover:bg-accent/10 text-white/30 hover:text-accent shrink-0"><Trash2 size={13} /></button>
                        </div>
                      ))}
                      <button onClick={() => addOption(idx)} className="flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors">
                        <Plus size={13} /> {t("addOption")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={addField}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/15 text-white/50 hover:text-white/80 hover:border-white/30 transition-colors text-sm"
      >
        <Plus size={16} /> {t("addField")}
      </button>
    </div>
  );
}
