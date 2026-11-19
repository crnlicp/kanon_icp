import { useState } from "react";
import { motion } from "framer-motion";
import {
  Flag,
  Flower2,
  Code2,
  Music,
  Mountain,
  ChefHat,
  Languages,
  Trophy,
  Star,
  Camera,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useI18n } from "../../../i18n";
import { areaMetas, getActiveArea, setActiveArea } from "../../../mock/areaStore";
import type { AreaId } from "../../../mock/areaStore";

const iconMap: Record<string, React.ElementType> = {
  Flag,
  Flower2,
  Code2,
  Music,
  Mountain,
  ChefHat,
  Languages,
  Trophy,
  Star,
  Camera,
};

const colorBgMap: Record<string, string> = {
  "text-emerald-400": "bg-emerald-400/10 border-emerald-400/30",
  "text-violet-400": "bg-violet-400/10 border-violet-400/30",
  "text-cyan-400": "bg-cyan-400/10 border-cyan-400/30",
  "text-rose-400": "bg-rose-400/10 border-rose-400/30",
  "text-lime-400": "bg-lime-400/10 border-lime-400/30",
  "text-orange-400": "bg-orange-400/10 border-orange-400/30",
  "text-sky-400": "bg-sky-400/10 border-sky-400/30",
  "text-red-400": "bg-red-400/10 border-red-400/30",
  "text-amber-400": "bg-amber-400/10 border-amber-400/30",
  "text-slate-300": "bg-slate-300/10 border-slate-300/30",
};

const colorRingMap: Record<string, string> = {
  "text-emerald-400": "ring-emerald-400/40",
  "text-violet-400": "ring-violet-400/40",
  "text-cyan-400": "ring-cyan-400/40",
  "text-rose-400": "ring-rose-400/40",
  "text-lime-400": "ring-lime-400/40",
  "text-orange-400": "ring-orange-400/40",
  "text-sky-400": "ring-sky-400/40",
  "text-red-400": "ring-red-400/40",
  "text-amber-400": "ring-amber-400/40",
  "text-slate-300": "ring-slate-300/40",
};

export default function AdminDemoAreas() {
  const { t, localized } = useI18n();
  const [active, setActive] = useState<AreaId>(getActiveArea());
  const [switching, setSwitching] = useState<AreaId | null>(null);

  const handleSwitch = async (id: AreaId) => {
    if (id === active) return;
    setSwitching(id);
    setActiveArea(id);
    setActive(id);
    await new Promise((r) => setTimeout(r, 600));
    window.location.reload();
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">{t("demoAreas")}</h2>
        <p className="text-white/40 text-sm mt-1">{t("demoAreasDescription")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {areaMetas.map((area, idx) => {
          const Icon = iconMap[area.icon] ?? Flag;
          const isActive = area.id === active;
          const isSwitching = switching === area.id;
          const bgClass = colorBgMap[area.color] ?? "bg-white/5 border-white/10";
          const ringClass = colorRingMap[area.color] ?? "ring-white/20";

          return (
            <motion.div
              key={area.id}
              className={`relative glass rounded-2xl p-6 border transition-all ${
                isActive ? `ring-2 ${ringClass} ${bgClass}` : "border-white/10"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              {isActive && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 size={18} className={area.color} />
                </div>
              )}

              <div className={`inline-flex p-3 rounded-xl mb-4 ${bgClass}`}>
                <Icon size={24} className={area.color} />
              </div>

              <h3 className="text-base font-semibold text-white mb-1">
                {localized(area.name_fa, area.name_sv)}
              </h3>
              <p className="text-sm text-white/40 mb-5 leading-relaxed">
                {localized(area.description_fa, area.description_sv)}
              </p>

              {isActive ? (
                <div className={`flex items-center gap-2 text-xs font-semibold ${area.color}`}>
                  <CheckCircle2 size={14} />
                  {t("activeArea")}
                </div>
              ) : (
                <motion.button
                  onClick={() => handleSwitch(area.id)}
                  disabled={isSwitching !== null && switching !== null}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-medium transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isSwitching ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      {t("switchingArea")}
                    </>
                  ) : (
                    t("switchArea")
                  )}
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-white/25 mt-6">
        {t("demoAreaNote")}
      </p>
    </div>
  );
}
