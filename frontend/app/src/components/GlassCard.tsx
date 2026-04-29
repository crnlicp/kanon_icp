import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  onClick,
  hover = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-2xl sm:rounded-3xl p-7 sm:p-9 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={
        hover
          ? {
              y: -12,
              boxShadow:
                "0 35px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : undefined
      }
      whileTap={hover ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
