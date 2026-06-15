import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { KeyRound, Save, Loader2 } from "lucide-react";
import Toast from "../../../components/Toast";
import { useI18n } from "../../../i18n";

interface Props {
  token: string;
}

const MIN_PASSWORD_LENGTH = 6;

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminPassword({ token }: Props) {
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (saving) return;

      if (newPassword.length < MIN_PASSWORD_LENGTH) {
        setToast({ message: t("passwordTooShort"), type: "error", visible: true });
        return;
      }
      if (newPassword !== confirmPassword) {
        setToast({ message: t("passwordsDoNotMatch"), type: "error", visible: true });
        return;
      }
      if (currentPassword === newPassword) {
        setToast({ message: t("newPasswordSameAsCurrent"), type: "error", visible: true });
        return;
      }

      setSaving(true);
      try {
        const { backend } = await import("../../../actor");
        const currentHash = await sha256Hex(currentPassword);

        // Verify the current password by attempting an admin login.
        // This produces a throwaway session token if the password is correct.
        const verifyToken = await backend.adminLogin(currentHash);
        if (!verifyToken) {
          setToast({ message: t("currentPasswordIncorrect"), type: "error", visible: true });
          setSaving(false);
          return;
        }

        const newHash = await sha256Hex(newPassword);
        const ok = await backend.changePassword(token, newHash);

        // Clean up the throwaway verification token regardless of outcome.
        try {
          await backend.adminLogout(verifyToken);
        } catch {
          /* ignore */
        }

        if (!ok) {
          setToast({ message: t("passwordChangeFailed"), type: "error", visible: true });
          setSaving(false);
          return;
        }

        setToast({ message: t("passwordChanged"), type: "success", visible: true });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch {
        setToast({ message: t("passwordChangeFailed"), type: "error", visible: true });
      }
      setSaving(false);
    },
    [currentPassword, newPassword, confirmPassword, saving, token, t]
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <KeyRound size={24} className="text-primary" />
          {t("changePassword")}
        </h2>
        <p className="text-sm text-white/40 mt-2">{t("changePasswordSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5 max-w-xl">
        <div>
          <label className="block text-sm text-white/50 mb-1.5">{t("currentPassword")}</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">{t("newPassword")}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClass}
          />
          <p className="text-xs text-white/40 mt-1.5">{t("passwordMinLengthHint")}</p>
        </div>

        <div>
          <label className="block text-sm text-white/50 mb-1.5">{t("confirmNewPassword")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            className={inputClass}
          />
        </div>

        <motion.button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? t("changingPassword") : t("changePassword")}
        </motion.button>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
