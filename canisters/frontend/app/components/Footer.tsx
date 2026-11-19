import { motion } from "framer-motion";
import { Instagram, Facebook, Youtube, Twitter, Globe, Mail } from "lucide-react";
import { useI18n } from "../i18n";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
}

const iconMap: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  twitter: Twitter,
  website: Globe,
  email: Mail,
};

export default function Footer({ socialLinks = [] }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="glass-dark mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
        <div className="flex flex-col items-center gap-5">
          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = iconMap[link.platform.toLowerCase()] || Globe;
                return (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-primary hover:border-primary/30 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Copyright */}
          <p className="text-sm text-white/30">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
