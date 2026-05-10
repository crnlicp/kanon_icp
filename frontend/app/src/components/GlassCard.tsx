import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  hover?: boolean;
  delay?: number;
}

const MotionLink = motion(Link);

const hoverEffect = {
  y: -12,
  boxShadow:
    "0 35px 60px -15px rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)",
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

export default function GlassCard({
  children,
  className = "",
  onClick,
  href,
  hover = true,
  delay = 0,
}: GlassCardProps) {
  const sharedClass = `glass rounded-2xl sm:rounded-3xl p-7 sm:p-9 ${onClick || href ? 'cursor-pointer' : ''} ${className}`;
  const animProps = {
    initial: { opacity: 0, y: 30 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { delay, duration: 0.5, ease: "easeOut" as const },
    whileHover: hover ? hoverEffect : undefined,
    whileTap: hover ? { scale: 0.98 as const } : undefined,
  };

  if (href) {
    return (
      <MotionLink to={href} className={sharedClass} onClick={onClick} {...animProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.div className={sharedClass} onClick={onClick} {...animProps}>
      {children}
    </motion.div>
  );
}
