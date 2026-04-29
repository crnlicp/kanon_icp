import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import FileUpload from "../../../components/FileUpload";
import { useI18n } from "../../../i18n";
import type { TopicReturn } from "../../../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_fa: string;
  title_sv: string;
  description_fa: string;
  description_sv: string;
  icon: string;
  backgroundUrl: string;
  sortOrder: number;
}

interface Props {
  token: string;
}

const emptyForm = {
  slug: "",
  title_fa: "",
  title_sv: "",
  description_fa: "",
  description_sv: "",
  icon: "Layers",
  backgroundUrl: "",
  sortOrder: 0,
};

export default function AdminTopics({ token }: Props) {
  const { t } = useI18n();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  const loadTopics = useCallback(async () => {
    const { backend } = await import("../../../actor");
    const data = await backend.getTopics();
    setTopics(data.map((t: TopicReturn) => ({ ...t, id: Number(t.id), sortOrder: Number(t.sortOrder) })));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTopics();
  }, [loadTopics]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      if (editing !== null) {
        await backend.updateTopic(
          token, BigInt(editing), form.slug,
          form.title_fa, form.title_sv,
          form.description_fa, form.description_sv,
          form.icon, form.backgroundUrl, BigInt(form.sortOrder)
        );
        setToast({ message: t("topicUpdated"), type: "success", visible: true });
      } else {
        await backend.createTopic(
          token, form.slug,
          form.title_fa, form.title_sv,
          form.description_fa, form.description_sv,
          form.icon, form.backgroundUrl, BigInt(form.sortOrder)
        );
        setToast({ message: t("topicCreated"), type: "success", visible: true });
      }
      await loadTopics();
      resetForm();
    } catch {
      setToast({ message: t("failedToSaveTopic"), type: "error", visible: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteTopic"))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.deleteTopic(token, BigInt(id));
      setToast({ message: t("topicDeleted"), type: "success", visible: true });
      await loadTopics();
    } catch {
      setToast({ message: t("failedToDeleteTopic"), type: "error", visible: true });
    }
  };

  const startEdit = (topic: Topic) => {
    setEditing(topic.id);
    setForm({
      slug: topic.slug,
      title_fa: topic.title_fa,
      title_sv: topic.title_sv,
      description_fa: topic.description_fa,
      description_sv: topic.description_sv,
      icon: topic.icon,
      backgroundUrl: topic.backgroundUrl,
      sortOrder: topic.sortOrder,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{t("topics")}</h2>
        <motion.button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          {t("addTopic")}
        </motion.button>
      </div>

      {/* Modal Form */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editTopic") : t("newTopic")}
      >
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. cultural" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Icon (Lucide name)</label>
                <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g. Palette" className={inputClass} />
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
                <label className="block text-sm text-white/50 mb-1.5">Description (فارسی)</label>
                <textarea value={form.description_fa} onChange={(e) => setForm({ ...form, description_fa: e.target.value })} className={inputClass} dir="rtl" rows={2} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Description (Svenska)</label>
                <textarea value={form.description_sv} onChange={(e) => setForm({ ...form, description_sv: e.target.value })} className={inputClass} rows={2} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                value={form.backgroundUrl}
                onChange={(url) => setForm({ ...form, backgroundUrl: url })}
                token={token}
                label="Background"
              />
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <motion.button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm" whileTap={{ scale: 0.98 }}>
                <Save size={16} /> {saving ? t("saving") : t("save")}
              </motion.button>
              <button onClick={resetForm} className="px-6 py-2.5 text-white/50 hover:text-white/80 text-sm">
                {t("cancel")}
              </button>
            </div>
          </div>
      </Modal>

      {/* List */}
      <div className="space-y-3">
        {topics.map((topic) => (
          <motion.div
            key={topic.id}
            className="glass rounded-xl p-4 flex items-center justify-between"
            layout
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-primary/60 font-mono">{topic.slug}</span>
                <span className="text-xs text-white/30">#{topic.sortOrder}</span>
              </div>
              <p className="text-white font-medium truncate">{topic.title_sv}</p>
              <p className="text-white/40 text-sm truncate" dir="rtl">{topic.title_fa}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button onClick={() => startEdit(topic)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => handleDelete(topic.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
        {topics.length === 0 && (
          <p className="text-center text-white/30 py-12">{t("noTopics")}</p>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
