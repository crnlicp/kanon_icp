import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save, FileText } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import FormBuilder from "../../../components/FormBuilder";
import { useI18n } from "../../../i18n";
import type { FormTemplateReturn, FormFieldReturn } from "../../../backend/api/backend";

interface TemplateItem {
  id: number;
  name_fa: string;
  name_sv: string;
  description_fa: string;
  description_sv: string;
  fields: FormFieldReturn[];
}

interface Props {
  token: string;
  readOnly?: boolean;
}

const emptyForm = {
  name_fa: "",
  name_sv: "",
  description_fa: "",
  description_sv: "",
  fields: [] as FormFieldReturn[],
};

export default function AdminFormTemplates({ token, readOnly }: Props) {
  const { t, lang } = useI18n();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  const loadTemplates = useCallback(async () => {
    const { backend } = await import("../../../actor");
    const data = await backend.getFormTemplates();
    setTemplates(data.map((t: FormTemplateReturn) => ({
      ...t,
      id: Number(t.id),
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      if (editing !== null) {
        await backend.updateFormTemplate(
          token, BigInt(editing),
          form.name_fa, form.name_sv,
          form.description_fa, form.description_sv,
          form.fields,
        );
        setToast({ message: t("templateUpdated"), type: "success", visible: true });
      } else {
        await backend.createFormTemplate(
          token,
          form.name_fa, form.name_sv,
          form.description_fa, form.description_sv,
          form.fields,
        );
        setToast({ message: t("templateCreated"), type: "success", visible: true });
      }
      await loadTemplates();
      resetForm();
    } catch {
      setToast({ message: t("failedToSaveTemplate"), type: "error", visible: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteTemplate"))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.deleteFormTemplate(token, BigInt(id));
      setToast({ message: t("templateDeleted"), type: "success", visible: true });
      await loadTemplates();
    } catch {
      setToast({ message: t("failedToDelete"), type: "error", visible: true });
    }
  };

  const startEdit = (tmpl: TemplateItem) => {
    setEditing(tmpl.id);
    setForm({
      name_fa: tmpl.name_fa,
      name_sv: tmpl.name_sv,
      description_fa: tmpl.description_fa,
      description_sv: tmpl.description_sv,
      fields: tmpl.fields,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("formTemplates")}</h2>
        {!readOnly && <motion.button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm" whileTap={{ scale: 0.98 }}>
          <Plus size={16} /> {t("addTemplate")}
        </motion.button>}
      </div>

      {/* Modal Form */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editTemplate") : t("newTemplate")}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("templateName")} (فارسی)</label>
              <input value={form.name_fa} onChange={(e) => setForm({ ...form, name_fa: e.target.value })} className={inputClass} dir="rtl" />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("templateName")} (Svenska)</label>
              <input value={form.name_sv} onChange={(e) => setForm({ ...form, name_sv: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("templateDescription")} (فارسی)</label>
              <textarea value={form.description_fa} onChange={(e) => setForm({ ...form, description_fa: e.target.value })} className={inputClass} dir="rtl" rows={2} />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("templateDescription")} (Svenska)</label>
              <textarea value={form.description_sv} onChange={(e) => setForm({ ...form, description_sv: e.target.value })} className={inputClass} rows={2} />
            </div>
          </div>

          {/* Form Builder */}
          <div>
            <label className="block text-sm text-white/50 mb-2">{t("formBuilder")}</label>
            <FormBuilder fields={form.fields} onChange={(fields) => setForm({ ...form, fields })} />
          </div>

          <div className="flex gap-3 pt-3">
            <motion.button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm" whileTap={{ scale: 0.98 }}>
              <Save size={16} /> {saving ? t("saving") : t("save")}
            </motion.button>
            <button onClick={resetForm} className="px-6 py-2.5 text-white/50 hover:text-white/80 text-sm">{t("cancel")}</button>
          </div>
        </div>
      </Modal>

      {/* List */}
      <div className="space-y-3">
        {templates.map((tmpl) => (
          <motion.div key={tmpl.id} className="glass rounded-xl p-4 flex items-center justify-between" layout>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-primary/70" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{lang === "fa" ? tmpl.name_fa : tmpl.name_sv}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/40">{tmpl.fields.length} {t("fieldsCount")}</span>
                  {(lang === "fa" ? tmpl.description_fa : tmpl.description_sv) && (
                    <span className="text-xs text-white/30 truncate max-w-[200px]">{lang === "fa" ? tmpl.description_fa : tmpl.description_sv}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {!readOnly && <><button onClick={() => startEdit(tmpl)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(tmpl.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors"><Trash2 size={16} /></button></>}
            </div>
          </motion.div>
        ))}
        {templates.length === 0 && <p className="text-center text-white/30 py-12">{t("noTemplates")}</p>}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
