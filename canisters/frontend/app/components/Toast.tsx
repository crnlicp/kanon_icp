import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useI18n } from "../i18n";

interface ToastProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, visible, onClose }: ToastProps) {
  const { isRtl } = useI18n();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed bottom-6 ${isRtl ? "left-6 right-6 sm:right-auto" : "right-6 left-6 sm:left-auto"} z-[100] max-w-sm`}
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
        >
          <div
            className={`glass-strong rounded-xl p-4 flex items-center gap-3 ${
              type === "success" ? "border-primary/30" : "border-accent/30"
            }`}
          >
            {type === "success" ? (
              <CheckCircle size={24} className="text-primary shrink-0" />
            ) : (
              <XCircle size={24} className="text-accent shrink-0" />
            )}
            <span className="text-sm text-white/90 flex-1">{message}</span>
            <button onClick={onClose} className="text-white/40 hover:text-white/70">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
