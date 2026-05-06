import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import FileUpload from "../../../components/FileUpload";
import AssetImage from "../../../components/AssetImage";
import FormBuilder from "../../../components/FormBuilder";
import { useI18n } from "../../../i18n";
import type { TopicReturn, ActivityReturn, FormFieldReturn, FormTemplateReturn } from "../../../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_sv: string;
}

interface ActivityItem {
  id: number;
  topicId: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  excerpt_fa: string;
  excerpt_sv: string;
  body_fa: string;
  body_sv: string;
  icon: string;
  imageUrl: string;
  hasRegistration: boolean;
  formTemplateId?: number;
  customFormFields: FormFieldReturn[];
  sortOrder: number;
}

type FormMode = "default" | "template" | "custom";

interface Props {
  token: string;
  readOnly?: boolean;
}

const emptyForm = {
  topicId: 0,
  slug: "",
  title_fa: "",
  title_sv: "",
  excerpt_fa: "",
  excerpt_sv: "",
  body_fa: "",
  body_sv: "",
  icon: "Activity",
  imageUrl: "",
  hasRegistration: false,
  formMode: "default" as FormMode,
  formTemplateId: 0,
  customFormFields: [] as FormFieldReturn[],
  sortOrder: 0,
};

export default function AdminActivities({ token, readOnly }: Props) {
  const { t, lang } = useI18n();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [templates, setTemplates] = useState<FormTemplateReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      Promise.all([
        backend.getTopics(),
        backend.getFormTemplates(),
      ]).then(([topicData, templateData]: [TopicReturn[], FormTemplateReturn[]]) => {
        const ts = topicData.map((t: TopicReturn) => ({ id: Number(t.id), slug: t.slug, title_sv: t.title_sv }));
        setTopics(ts);
        setTemplates(templateData);
        if (ts.length > 0) setSelectedTopicId(ts[0].id);
        setLoading(false);
      });
    });
  }, []);

  const loadActivities = useCallback(async () => {
    if (!selectedTopicId) return;
    const { backend } = await import("../../../actor");
    const data = await backend.getActivitiesByTopic(BigInt(selectedTopicId));
    setActivities(data.map((a: ActivityReturn) => ({
      ...a,
      id: Number(a.id),
      topicId: Number(a.topicId),
      formTemplateId: a.formTemplateId != null ? Number(a.formTemplateId) : undefined,
      sortOrder: Number(a.sortOrder),
    })));
  }, [selectedTopicId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      const tid = BigInt(form.topicId || selectedTopicId);
      const templateId = form.hasRegistration && form.formMode === "template" && form.formTemplateId
        ? BigInt(form.formTemplateId)
        : null;
      const customFields = form.hasRegistration && form.formMode === "custom"
        ? form.customFormFields
        : [];
      if (editing !== null) {
        await backend.updateActivity(
          token, BigInt(editing), tid, form.slug,
          form.title_fa, form.title_sv,
          form.excerpt_fa, form.excerpt_sv,
          form.body_fa, form.body_sv,
          form.icon, form.imageUrl, form.hasRegistration,
          templateId, customFields,
          BigInt(form.sortOrder)
        );
        setToast({ message: t("activityUpdated"), type: "success", visible: true });
      } else {
        await backend.createActivity(
          token, tid, form.slug,
          form.title_fa, form.title_sv,
          form.excerpt_fa, form.excerpt_sv,
          form.body_fa, form.body_sv,
          form.icon, form.imageUrl, form.hasRegistration,
          templateId, customFields,
          BigInt(form.sortOrder)
        );
        setToast({ message: t("activityCreated"), type: "success", visible: true });
      }
      await loadActivities();
      resetForm();
    } catch {
      setToast({ message: t("failedToSaveActivity"), type: "error", visible: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteActivity"))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.deleteActivity(token, BigInt(id));
      setToast({ message: t("activityDeleted"), type: "success", visible: true });
      await loadActivities();
    } catch {
      setToast({ message: t("failedToDelete"), type: "error", visible: true });
    }
  };

  const startEdit = (act: ActivityItem) => {
    setEditing(act.id);
    // Determine form mode from existing data
    let formMode: FormMode = "default";
    if (act.customFormFields.length > 0) {
      formMode = "custom";
    } else if (act.formTemplateId) {
      formMode = "template";
    }
    setForm({
      topicId: act.topicId,
      slug: act.slug,
      title_fa: act.title_fa,
      title_sv: act.title_sv,
      excerpt_fa: act.excerpt_fa,
      excerpt_sv: act.excerpt_sv,
      body_fa: act.body_fa,
      body_sv: act.body_sv,
      icon: act.icon,
      imageUrl: act.imageUrl,
      hasRegistration: act.hasRegistration,
      formMode,
      formTemplateId: act.formTemplateId ?? 0,
      customFormFields: act.customFormFields,
      sortOrder: act.sortOrder,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyForm, topicId: selectedTopicId });
    setShowForm(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("activities")}</h2>
        {!readOnly && <motion.button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm" whileTap={{ scale: 0.98 }}>
          <Plus size={16} /> {t("addActivity")}
        </motion.button>}
      </div>

      {/* Topic Selector */}
      <div className="mb-6">
        <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors">
          {topics.map((t) => (
            <option key={t.id} value={t.id} className="bg-black/70">{t.title_sv} ({t.slug})</option>
          ))}
        </select>
      </div>

      {/* Modal Form */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editActivity") : t("newActivity")}
      >
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Icon (Lucide)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Title (فارسی)</label>
                <input value={form.title_fa} onChange={(e) => setForm({ ...form, title_fa: e.target.value })} className={inputClass} dir="rtl" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Title (Svenska)</label>
                <input value={form.title_sv} onChange={(e) => setForm({ ...form, title_sv: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Excerpt (فارسی)</label>
                <textarea value={form.excerpt_fa} onChange={(e) => setForm({ ...form, excerpt_fa: e.target.value })} className={inputClass} dir="rtl" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Excerpt (Svenska)</label>
                <textarea value={form.excerpt_sv} onChange={(e) => setForm({ ...form, excerpt_sv: e.target.value })} className={inputClass} rows={2} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Body (فارسی)</label>
                <textarea value={form.body_fa} onChange={(e) => setForm({ ...form, body_fa: e.target.value })} className={inputClass} dir="rtl" rows={5} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Body (Svenska)</label>
                <textarea value={form.body_sv} onChange={(e) => setForm({ ...form, body_sv: e.target.value })} className={inputClass} rows={5} />
              </div>
            </div>
            <FileUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              token={token}
              label="Image"
              accept="image/*"
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.hasRegistration} onChange={(e) => setForm({ ...form, hasRegistration: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-white/70">{t("enableRegistration")}</span>
            </label>
            {/* Form mode selector - shown when registration is enabled */}
            {form.hasRegistration && (
              <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                <div>
                  <label className="block text-sm text-white/50 mb-2">{t("formMode")}</label>
                  <div className="flex gap-2">
                    {(["default", "template", "custom"] as FormMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setForm({ ...form, formMode: mode })}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          form.formMode === mode
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-white/5 text-white/40 border border-white/10 hover:text-white/70"
                        }`}
                      >
                        {t(mode === "default" ? "defaultForm" : mode === "template" ? "useTemplate" : "customForm")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template selector */}
                {form.formMode === "template" && (
                  <div>
                    <label className="block text-sm text-white/50 mb-1.5">{t("selectTemplate")}</label>
                    <select
                      value={form.formTemplateId}
                      onChange={(e) => setForm({ ...form, formTemplateId: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
                    >
                      <option value={0} className="bg-black/70">-- {t("selectTemplate")} --</option>
                      {templates.map((tmpl) => (
                        <option key={Number(tmpl.id)} value={Number(tmpl.id)} className="bg-black/70">
                          {lang === "fa" ? tmpl.name_fa : tmpl.name_sv} ({tmpl.fields.length} {t("fieldsCount")})
                        </option>
                      ))}
                    </select>
                    {/* Preview selected template fields */}
                    {form.formTemplateId > 0 && (() => {
                      const selectedTemplate = templates.find((t) => Number(t.id) === form.formTemplateId);
                      if (!selectedTemplate) return null;
                      return (
                        <div className="mt-3">
                          <p className="text-xs text-white/40 mb-1.5">{t("formPreview")}</p>
                          <FormBuilder fields={selectedTemplate.fields} onChange={() => {}} readOnly />
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Custom form builder */}
                {form.formMode === "custom" && (
                  <div>
                    <label className="block text-sm text-white/50 mb-2">{t("formBuilder")}</label>
                    <FormBuilder
                      fields={form.customFormFields}
                      onChange={(fields) => setForm({ ...form, customFormFields: fields })}
                    />
                  </div>
                )}
              </div>
            )}
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
        {activities.map((act) => (
          <motion.div key={act.id} className="glass rounded-xl p-4 flex items-center justify-between" layout>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {act.imageUrl && <AssetImage src={act.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-primary/60 font-mono">{act.slug}</span>
                  {act.hasRegistration && <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/70">
                    {act.customFormFields.length > 0 ? t("customForm") : act.formTemplateId ? t("useTemplate") : t("defaultForm")}
                  </span>}
                </div>
                <p className="text-white font-medium truncate">{act.title_sv}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {!readOnly && <><button onClick={() => startEdit(act)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(act.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors"><Trash2 size={16} /></button></>}
            </div>
          </motion.div>
        ))}
        {activities.length === 0 && <p className="text-center text-white/30 py-12">{t("noActivities")}</p>}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
