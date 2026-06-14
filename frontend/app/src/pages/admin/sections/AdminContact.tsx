import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Mail, Phone, MessageSquare, Inbox, Save } from "lucide-react";
import Toast from "../../../components/Toast";
import { useI18n } from "../../../i18n";
import type { ContactMessageReturn, SiteSettingsReturn } from "../../../backend/api/backend";

interface Props {
  token: string;
  readOnly?: boolean;
}

interface ContactMsg {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: number;
}

export default function AdminContact({ token, readOnly }: Props) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettingsReturn | null>(null);
  const [introFa, setIntroFa] = useState("");
  const [introSv, setIntroSv] = useState("");
  const [savingIntro, setSavingIntro] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error"; visible: boolean }>({
    message: "", type: "success", visible: false,
  });

  const fetchMessages = useCallback(async () => {
    try {
      const { backend } = await import("../../../actor");
      const data: ContactMessageReturn[] = await backend.getContactMessages(token);
      setMessages(
        data
          .map((m) => ({
            id: Number(m.id),
            name: m.name,
            email: m.email,
            phone: m.phone,
            message: m.message,
            createdAt: Number(m.createdAt),
          }))
          .sort((a, b) => b.createdAt - a.createdAt)
      );
    } catch {
      setToast({ message: t("failedToLoadMessages"), type: "error", visible: true });
    }
    setLoading(false);
  }, [token, t]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    import("../../../actor").then(({ backend }) => {
      backend.getSettings().then((s: SiteSettingsReturn) => {
        setSettings(s);
        setIntroFa(s.contactIntro_fa || "");
        setIntroSv(s.contactIntro_sv || "");
      }).catch(() => undefined);
    });
  }, []);

  const handleSaveIntro = async () => {
    if (!settings) return;
    setSavingIntro(true);
    try {
      const { backend } = await import("../../../actor");
      await backend.updateSettings(
        token,
        settings.logoUrl,
        settings.title_fa,
        settings.title_sv,
        settings.subtitle_fa,
        settings.subtitle_sv,
        settings.landingBackgroundUrl,
        settings.topicsBackgroundUrl,
        introFa,
        introSv,
      );
      setSettings({ ...settings, contactIntro_fa: introFa, contactIntro_sv: introSv });
      setToast({ message: t("contactIntroSaved"), type: "success", visible: true });
    } catch {
      setToast({ message: t("failedToSaveSettings"), type: "error", visible: true });
    }
    setSavingIntro(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDeleteMessage"))) return;
    try {
      const { backend } = await import("../../../actor");
      const ok = await backend.deleteContactMessage(token, BigInt(id));
      if (ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setToast({ message: t("messageDeleted"), type: "success", visible: true });
      } else {
        setToast({ message: t("failedToDeleteMessage"), type: "error", visible: true });
      }
    } catch {
      setToast({ message: t("failedToDeleteMessage"), type: "error", visible: true });
    }
  };

  const formatDate = (ns: number) => {
    const ms = ns / 1_000_000;
    return new Date(ms).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Contact Intro HTML editor (displayed above the contact form on the public page) */}
      {!readOnly && (
        <motion.div
          className="glass rounded-2xl p-6 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">{t("contactIntro")}</h2>
              <p className="text-xs text-white/40 mt-1">{t("contactIntroDescription")}</p>
            </div>
            <motion.button
              onClick={handleSaveIntro}
              disabled={savingIntro || !settings}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={15} />
              {savingIntro ? t("saving") : t("save")}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("contactIntro")} (فارسی)</label>
              <textarea
                value={introFa}
                onChange={(e) => setIntroFa(e.target.value)}
                rows={8}
                dir="rtl"
                placeholder="<p>…</p>"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">{t("contactIntro")} (Svenska)</label>
              <textarea
                value={introSv}
                onChange={(e) => setIntroSv(e.target.value)}
                rows={8}
                placeholder="<p>…</p>"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm font-mono"
              />
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">{t("contactMessages")}</h2>
        <span className="text-sm text-white/40">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      {messages.length === 0 ? (
        <motion.div
          className="glass rounded-2xl p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Inbox size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40">{t("noMessages")}</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              className="glass rounded-2xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg truncate">{msg.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-white/40">
                      <Mail size={13} />
                      <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">
                        {msg.email}
                      </a>
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-white/40">
                        <Phone size={13} />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-white/30">{formatDate(msg.createdAt)}</span>
                  {!readOnly && <motion.button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 rounded-lg text-white/30 hover:text-accent hover:bg-accent/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>}
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <MessageSquare size={14} className="text-white/20 mt-0.5 shrink-0" />
                <p className="text-sm text-white/60 whitespace-pre-wrap break-words">{msg.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
