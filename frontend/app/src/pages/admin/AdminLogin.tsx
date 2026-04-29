import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import Toast from "../../components/Toast";
import { useI18n } from "../../i18n";

export default function AdminLogin() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        // Hash password using SubtleCrypto (SHA-256)
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        const { backend } = await import("../../actor");
        const result = await backend.adminLogin(hashHex);
        if (result) {
          login(result);
        } else {
          setToast({ message: t("invalidPassword"), type: "error", visible: true });
        }
      } catch {
        setToast({ message: t("loginFailed"), type: "error", visible: true });
      }
      setLoading(false);
    },
    [password, login, t]
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-navy via-[#1a1a2e] to-navy">
      <motion.div
        className="glass-strong rounded-3xl p-8 sm:p-12 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Lock size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t("adminPanel")}</h1>
          <p className="text-white/40 text-sm mt-1">{t("enterPassword")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn size={18} />
            {loading ? t("loggingIn") : t("logIn")}
          </motion.button>
        </form>
      </motion.div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
