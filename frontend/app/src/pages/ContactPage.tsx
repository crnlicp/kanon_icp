import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { useI18n } from "../i18n";
import Toast from "../components/Toast";
import GlassCard from "../components/GlassCard";

export default function ContactPage() {
  const { t, isRtl } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "", type: "success", visible: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { backend } = await import("../actor");
      const result = await backend.submitContactMessage(form.name, form.email, form.phone, form.message);
      if (result) {
        setToast({ message: t("messageSent"), type: "success", visible: true });
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setToast({ message: t("messageSendError"), type: "error", visible: true });
      }
    } catch {
      setToast({ message: t("messageSendError"), type: "error", visible: true });
    }
    setSubmitting(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10 lg:px-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 text-glow">
            {t("contactUs")}
          </h1>
          <p className="text-lg text-white/50">{t("contactFormSubtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GlassCard>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">{t("name")}</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className={inputClass}
                  dir={isRtl ? "rtl" : "ltr"}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">{t("email")}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">{t("phone")}</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">{t("message")}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                  dir={isRtl ? "rtl" : "ltr"}
                />
              </div>
              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {submitting ? t("loading") : t("submit")}
              </motion.button>
            </form>
          </GlassCard>
        </motion.div>
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
