import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, Mail, Phone, MessageSquare, Inbox } from "lucide-react";
import Toast from "../../../components/Toast";
import { useI18n } from "../../../i18n";
import type { ContactMessageReturn } from "../../../backend/api/backend";

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
