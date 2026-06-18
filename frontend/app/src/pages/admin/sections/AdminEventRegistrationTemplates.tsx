import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save, CalendarCheck, AlertTriangle } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import EventRegistrationTemplateBuilder from "../../../components/EventRegistrationTemplateBuilder";
import { useI18n } from "../../../i18n";
import type { EventRegistrationTemplateReturn, EventSessionReturn, FormFieldReturn } from "../../../backend/api/backend";

interface TemplateItem {
  id: number;
  name_fa: string;
  name_sv: string;
  description_fa: string;
  description_sv: string;
  sessions: EventSessionReturn[];
  fields: FormFieldReturn[];
  perMemberMode: boolean;
  minMembers: bigint;
  maxMembers: bigint;
  perMemberSessionSelection: boolean;
}

interface UsageItem {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  liveRegistrationCount: number;
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
  sessions: [] as EventSessionReturn[],
  fields: [] as FormFieldReturn[],
  perMemberMode: false,
  minMembers: 1n,
  maxMembers: 20n,
  perMemberSessionSelection: false,
};

export default function AdminEventRegistrationTemplates({ token, readOnly }: Props) {
  const { t, lang } = useI18n();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [usage, setUsage] = useState<UsageItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  const loadTemplates = useCallback(async () => {
    const { backend } = await import("../../../actor");
    const data = await backend.getEventRegistrationTemplates();
    setTemplates(data.map((t: EventRegistrationTemplateReturn) => ({
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
        await backend.updateEventRegistrationTemplate(
          token, BigInt(editing),
          form.name_fa, form.name_sv,
          form.description_fa, form.description_sv,
          form.sessions,
          form.fields,
          form.perMemberMode,
          form.perMemberSessionSelection,
          form.minMembers,
          form.maxMembers,
        );
        setToast({ message: t("templateUpdated"), type: "success", visible: true });
      } else {
        await backend.createEventRegistrationTemplate(
          token,
          form.name_fa, form.name_sv,
          form.description_fa, form.description_sv,
          form.sessions,
          form.fields,
          form.perMemberMode,
          form.perMemberSessionSelection,
          form.minMembers,
          form.maxMembers,
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
      await backend.deleteEventRegistrationTemplate(token, BigInt(id));
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
      sessions: tmpl.sessions,
      fields: tmpl.fields,
      perMemberMode: tmpl.perMemberMode,
      minMembers: tmpl.minMembers,
      maxMembers: tmpl.maxMembers,
      perMemberSessionSelection: tmpl.perMemberSessionSelection,
    });
    setShowForm(true);
    // Fetch which activities currently bind to this template so the admin can
    // see whether session edits will be auto-propagated or skipped.
    import("../../../actor").then(({ backend }) => {
      backend.getActivitiesUsingEventTemplate(BigInt(tmpl.id)).then((rows) => {
        setUsage(rows.map((r) => ({
          id: Number(r.id),
          slug: r.slug,
          title_fa: r.title_fa,
          title_sv: r.title_sv,
          liveRegistrationCount: Number(r.liveRegistrationCount),
        })));
      }).catch(() => setUsage([]));
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
    setUsage([]);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("eventRegTemplates")}</h2>
        {!readOnly && (
          <motion.button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm"
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} /> {t("addEventRegTemplate")}
          </motion.button>
        )}
      </div>

      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editEventRegTemplate") : t("addEventRegTemplate")}
      >
        {editing !== null && usage.length > 0 && (
          <div className="mb-5 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs">
            <div className="flex items-start gap-2 text-yellow-300/90">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="font-medium">
                  {t("eventTemplateUsage")} ({usage.length})
                </p>
                <p className="text-white/50">{t("eventTemplateAutoSyncNote")}</p>
                <ul className="space-y-0.5 mt-1">
                  {usage.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-2">
                      <span className="text-white/70 truncate">
                        {lang === "fa" ? u.title_fa : u.title_sv}
                      </span>
                      {u.liveRegistrationCount > 0 ? (
                        <span className="text-yellow-400/80 shrink-0">
                          {u.liveRegistrationCount} {t("liveRegistrations")}
                        </span>
                      ) : (
                        <span className="text-green-400/70 shrink-0">—</span>
                      )}
                    </li>
                  ))}
                </ul>
                {usage.some((u) => u.liveRegistrationCount > 0) && (
                  <p className="text-white/40 italic mt-1">{t("eventTemplateSkippedNote")}.</p>
                )}
              </div>
            </div>
          </div>
        )}
        <EventRegistrationTemplateBuilder
          template={form}
          onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
        />
        <div className="flex gap-3 pt-5 mt-2 border-t border-white/10">
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
            whileTap={{ scale: 0.98 }}
          >
            <Save size={16} /> {saving ? t("saving") : t("save")}
          </motion.button>
          <button onClick={resetForm} className="px-6 py-2.5 text-white/50 hover:text-white/80 text-sm">{t("cancel")}</button>
        </div>
      </Modal>

      <div className="space-y-3">
        {templates.map((tmpl) => (
          <motion.div key={tmpl.id} className="glass rounded-xl p-4 flex items-center justify-between" layout>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarCheck size={18} className="text-primary/70" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{lang === "fa" ? tmpl.name_fa : tmpl.name_sv}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-white/40">{tmpl.sessions.length} {t("session")}</span>
                  <span className="text-xs text-white/40">{tmpl.fields.length} {t("fieldsCount")}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {!readOnly && (
                <>
                  <button onClick={() => startEdit(tmpl)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(tmpl.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors"><Trash2 size={16} /></button>
                </>
              )}
            </div>
          </motion.div>
        ))}
        {templates.length === 0 && <p className="text-center text-white/30 py-12">{t("noEventRegTemplates")}</p>}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
