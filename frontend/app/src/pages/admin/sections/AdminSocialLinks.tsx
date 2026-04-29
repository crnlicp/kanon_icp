import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import { useI18n } from "../../../i18n";
import type { SocialLinkReturn } from "../../../backend/api/backend";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  sortOrder: number;
}

interface Props {
  token: string;
}

const emptyForm = {
  platform: "",
  url: "",
  sortOrder: 0,
};

const platformOptions = ["instagram", "facebook", "youtube", "twitter", "website", "email"];

export default function AdminSocialLinks({ token }: Props) {
  const { t } = useI18n();
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  const loadLinks = useCallback(async () => {
    const { backend } = await import("../../../actor");
    const data = await backend.getSocialLinks();
    setLinks(data.map((l: SocialLinkReturn) => ({ ...l, id: Number(l.id), sortOrder: Number(l.sortOrder) })));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      if (editing !== null) {
        await backend.updateSocialLink(token, BigInt(editing), form.platform, form.url, BigInt(form.sortOrder));
        setToast({ message: t("linkUpdated"), type: "success", visible: true });
      } else {
        await backend.createSocialLink(token, form.platform, form.url, BigInt(form.sortOrder));
        setToast({ message: t("linkCreated"), type: "success", visible: true });
      }
      await loadLinks();
      resetForm();
    } catch {
      setToast({ message: t("failedToSaveLink"), type: "error", visible: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteLink"))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.deleteSocialLink(token, BigInt(id));
      setToast({ message: t("linkDeleted"), type: "success", visible: true });
      await loadLinks();
    } catch {
      setToast({ message: t("failedToDelete"), type: "error", visible: true });
    }
  };

  const startEdit = (link: SocialLink) => {
    setEditing(link.id);
    setForm({ platform: link.platform, url: link.url, sortOrder: link.sortOrder });
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{t("socialLinks")}</h2>
        <motion.button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm" whileTap={{ scale: 0.98 }}>
          <Plus size={16} /> {t("addLink")}
        </motion.button>
      </div>

      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editLink") : t("newLink")}
      >
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Platform</label>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className={inputClass}>
                  <option value="" className="bg-navy">Select...</option>
                  {platformOptions.map((p) => (
                    <option key={p} value={p} className="bg-navy">{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">URL</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Sort Order</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 pt-3">
              <motion.button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm" whileTap={{ scale: 0.98 }}>
                <Save size={16} /> {saving ? t("saving") : t("save")}
              </motion.button>
              <button onClick={resetForm} className="px-6 py-2.5 text-white/50 hover:text-white/80 text-sm">{t("cancel")}</button>
            </div>
          </div>
      </Modal>

      <div className="space-y-3">
        {links.map((link) => (
          <motion.div key={link.id} className="glass rounded-xl p-4 flex items-center justify-between" layout>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium capitalize">{link.platform}</p>
              <p className="text-white/40 text-sm truncate">{link.url}</p>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button onClick={() => startEdit(link)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(link.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors"><Trash2 size={16} /></button>
            </div>
          </motion.div>
        ))}
        {links.length === 0 && <p className="text-center text-white/30 py-12">{t("noLinks")}</p>}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
