import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import FileUpload from "../../../components/FileUpload";
import AssetImage from "../../../components/AssetImage";
import { useI18n } from "../../../i18n";
import type { TopicReturn, HeroSlideReturn } from "../../../backend/api/backend";

interface Topic {
  id: number;
  slug: string;
  title_sv: string;
}

interface Slide {
  id: number;
  topicId: number;
  imageUrl: string;
  title_fa: string;
  title_sv: string;
  subtitle_fa: string;
  subtitle_sv: string;
  ctaText_fa: string;
  ctaText_sv: string;
  ctaLink: string;
  sortOrder: number;
}

interface Props {
  token: string;
  readOnly?: boolean;
}

const emptyForm = {
  topicId: 0,
  imageUrl: "",
  title_fa: "",
  title_sv: "",
  subtitle_fa: "",
  subtitle_sv: "",
  ctaText_fa: "",
  ctaText_sv: "",
  ctaLink: "",
  sortOrder: 0,
};

export default function AdminSlides({ token, readOnly }: Props) {
  const { t } = useI18n();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number>(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getTopics().then((data: TopicReturn[]) => {
        const ts = data.map((t: TopicReturn) => ({ id: Number(t.id), slug: t.slug, title_sv: t.title_sv }));
        setTopics(ts);
        if (ts.length > 0) setSelectedTopicId(ts[0].id);
        setLoading(false);
      });
    });
  }, []);

  const loadSlides = useCallback(async () => {
    if (!selectedTopicId) return;
    const { backend } = await import("../../../actor");
    const data = await backend.getSlidesByTopic(BigInt(selectedTopicId));
    setSlides(data.map((s: HeroSlideReturn) => ({ ...s, id: Number(s.id), topicId: Number(s.topicId), sortOrder: Number(s.sortOrder) })));
  }, [selectedTopicId]);

  useEffect(() => {
    loadSlides();
  }, [loadSlides]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      const tid = BigInt(form.topicId || selectedTopicId);
      if (editing !== null) {
        await backend.updateSlide(token, BigInt(editing), tid, form.imageUrl, form.title_fa, form.title_sv, form.subtitle_fa, form.subtitle_sv, form.ctaText_fa, form.ctaText_sv, form.ctaLink, BigInt(form.sortOrder));
        setToast({ message: t("slideUpdated"), type: "success", visible: true });
      } else {
        await backend.createSlide(token, tid, form.imageUrl, form.title_fa, form.title_sv, form.subtitle_fa, form.subtitle_sv, form.ctaText_fa, form.ctaText_sv, form.ctaLink, BigInt(form.sortOrder));
        setToast({ message: t("slideCreated"), type: "success", visible: true });
      }
      await loadSlides();
      resetForm();
    } catch {
      setToast({ message: t("failedToSaveSlide"), type: "error", visible: true });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteSlide"))) return;
    try {
      const { backend } = await import("../../../actor");
      await backend.deleteSlide(token, BigInt(id));
      setToast({ message: t("slideDeleted"), type: "success", visible: true });
      await loadSlides();
    } catch {
      setToast({ message: t("failedToDelete"), type: "error", visible: true });
    }
  };

  const startEdit = (slide: Slide) => {
    setEditing(slide.id);
    setForm({
      topicId: slide.topicId,
      imageUrl: slide.imageUrl,
      title_fa: slide.title_fa,
      title_sv: slide.title_sv,
      subtitle_fa: slide.subtitle_fa,
      subtitle_sv: slide.subtitle_sv,
      ctaText_fa: slide.ctaText_fa,
      ctaText_sv: slide.ctaText_sv,
      ctaLink: slide.ctaLink,
      sortOrder: slide.sortOrder,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditing(null);
    setForm({ ...emptyForm, topicId: selectedTopicId });
    setShowForm(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";
  const selectClass = inputClass.replace("bg-white/5", "bg-[#0f172a]");

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{t("heroSlides")}</h2>
        {!readOnly && <motion.button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors text-sm" whileTap={{ scale: 0.98 }}>
          <Plus size={16} /> {t("addSlide")}
        </motion.button>}
      </div>

      {/* Topic Selector */}
      <div className="mb-6">
        <select value={selectedTopicId} onChange={(e) => setSelectedTopicId(Number(e.target.value))} className={selectClass}>
          {topics.map((t) => (
            <option key={t.id} value={t.id} className="bg-[#0f172a] text-white">{t.title_sv} ({t.slug})</option>
          ))}
        </select>
      </div>

      {/* Modal Form */}
      <Modal
        open={showForm}
        onClose={resetForm}
        title={editing !== null ? t("editSlide") : t("newSlide")}
      >
          <div className="space-y-5">
            <FileUpload
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              token={token}
              label="Image"
              accept="image/*"
            />
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
                <label className="block text-sm text-white/50 mb-1.5">Subtitle (فارسی)</label>
                <input value={form.subtitle_fa} onChange={(e) => setForm({ ...form, subtitle_fa: e.target.value })} className={inputClass} dir="rtl" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Subtitle (Svenska)</label>
                <input value={form.subtitle_sv} onChange={(e) => setForm({ ...form, subtitle_sv: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">CTA Text (فارسی)</label>
                <input value={form.ctaText_fa} onChange={(e) => setForm({ ...form, ctaText_fa: e.target.value })} className={inputClass} dir="rtl" />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">CTA Text (Svenska)</label>
                <input value={form.ctaText_sv} onChange={(e) => setForm({ ...form, ctaText_sv: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">CTA Link</label>
                <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className={inputClass} />
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

      {/* List */}
      <div className="space-y-3">
        {slides.map((slide) => (
          <motion.div key={slide.id} className="glass rounded-xl p-4 flex items-center justify-between" layout>
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {slide.imageUrl && <AssetImage src={slide.imageUrl} alt="" className="w-16 h-10 rounded-lg object-cover shrink-0" />}
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{slide.title_sv || "Untitled"}</p>
                <p className="text-white/40 text-sm truncate">{slide.subtitle_sv}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {!readOnly && <><button onClick={() => startEdit(slide)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(slide.id)} className="p-2 rounded-lg hover:bg-accent/10 text-white/40 hover:text-accent transition-colors"><Trash2 size={16} /></button></>}
            </div>
          </motion.div>
        ))}
        {slides.length === 0 && <p className="text-center text-white/30 py-12">{t("noSlides")}</p>}
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
}
