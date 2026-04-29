import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import Toast from "../../../components/Toast";
import FileUpload from "../../../components/FileUpload";
import { useI18n } from "../../../i18n";
import type { AboutContentReturn } from "../../../backend/api/backend";

interface Props {
  token: string;
}

export default function AdminAbout({ token }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    headerImageUrl: "",
    body_fa: "",
    body_sv: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "", type: "success", visible: false,
  });

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getAboutContent().then((data: AboutContentReturn) => {
        setForm({
          headerImageUrl: data.headerImageUrl,
          body_fa: data.body_fa,
          body_sv: data.body_sv,
        });
        setLoading(false);
      });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      await backend.updateAboutContent(token, form.headerImageUrl, form.body_fa, form.body_sv);
      setToast({ message: t("aboutSaved"), type: "success", visible: true });
    } catch {
      setToast({ message: t("failedToSaveAbout"), type: "error", visible: true });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  const textareaClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm font-mono resize-y";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{t("aboutContent")}</h2>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={16} />
          {saving ? t("saving") : t("save")}
        </motion.button>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <FileUpload
          value={form.headerImageUrl}
          onChange={(url) => setForm({ ...form, headerImageUrl: url })}
          token={token}
          label={t("headerImage")}
          accept="image/*"
        />

        <div>
          <label className="block text-sm text-white/50 mb-1.5">{t("bodyHtmlFa")}</label>
          <textarea
            value={form.body_fa}
            onChange={(e) => setForm({ ...form, body_fa: e.target.value })}
            rows={12}
            className={textareaClass}
            dir="rtl"
            placeholder="<h2>عنوان</h2><p>متن...</p>"
          />
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">{t("bodyHtmlSv")}</label>
          <textarea
            value={form.body_sv}
            onChange={(e) => setForm({ ...form, body_sv: e.target.value })}
            rows={12}
            className={textareaClass}
            placeholder="<h2>Title</h2><p>Content...</p>"
          />
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
