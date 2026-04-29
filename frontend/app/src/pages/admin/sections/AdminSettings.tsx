import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import Toast from "../../../components/Toast";
import FileUpload from "../../../components/FileUpload";
import { useI18n } from "../../../i18n";
import type { SiteSettingsReturn } from "../../../backend/api/backend";

interface Props {
  token: string;
}

export default function AdminSettings({ token }: Props) {
  const { t } = useI18n();
  const [form, setForm] = useState({
    logoUrl: "",
    title_fa: "",
    title_sv: "",
    subtitle_fa: "",
    subtitle_sv: "",
    landingBackgroundUrl: "",
    topicsBackgroundUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getSettings().then((s: SiteSettingsReturn) => {
        setForm({
          logoUrl: s.logoUrl,
          title_fa: s.title_fa,
          title_sv: s.title_sv,
          subtitle_fa: s.subtitle_fa,
          subtitle_sv: s.subtitle_sv,
          landingBackgroundUrl: s.landingBackgroundUrl,
          topicsBackgroundUrl: s.topicsBackgroundUrl,
        });
        setLoading(false);
      });
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      await backend.updateSettings(
        token,
        form.logoUrl,
        form.title_fa,
        form.title_sv,
        form.subtitle_fa,
        form.subtitle_sv,
        form.landingBackgroundUrl,
        form.topicsBackgroundUrl
      );
      setToast({ message: t("settingsSaved"), type: "success", visible: true });
    } catch {
      setToast({ message: t("failedToSaveSettings"), type: "error", visible: true });
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

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{t("siteSettings")}</h2>
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
          value={form.logoUrl}
          onChange={(url) => setForm({ ...form, logoUrl: url })}
          token={token}
          label="Logo"
          accept="image/*"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Title (فارسی)</label>
            <input
              value={form.title_fa}
              onChange={(e) => setForm({ ...form, title_fa: e.target.value })}
              className={inputClass}
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Title (Svenska)</label>
            <input
              value={form.title_sv}
              onChange={(e) => setForm({ ...form, title_sv: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Subtitle (فارسی)</label>
            <input
              value={form.subtitle_fa}
              onChange={(e) => setForm({ ...form, subtitle_fa: e.target.value })}
              className={inputClass}
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm text-white/50 mb-1.5">Subtitle (Svenska)</label>
            <input
              value={form.subtitle_sv}
              onChange={(e) => setForm({ ...form, subtitle_sv: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <FileUpload
          value={form.landingBackgroundUrl}
          onChange={(url) => setForm({ ...form, landingBackgroundUrl: url })}
          token={token}
          label="Landing Background"
        />

        <FileUpload
          value={form.topicsBackgroundUrl}
          onChange={(url) => setForm({ ...form, topicsBackgroundUrl: url })}
          token={token}
          label="Topics Page Background"
        />
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
