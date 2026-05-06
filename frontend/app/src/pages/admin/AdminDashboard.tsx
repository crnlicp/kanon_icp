import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Layers,
  Activity,
  Link2,
  LogOut,
  Image,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Info,
  MessageSquare,
  LayoutDashboard,
  FlaskConical,
  ClipboardList,
  FileText,
  Globe2,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n";
import { isMockMode, refreshMockMode } from "../../actor";
import type { Language } from "../../i18n/translations";
import AdminOverview from "./sections/AdminOverview";
import AdminSettings from "./sections/AdminSettings";
import AdminTopics from "./sections/AdminTopics";
import AdminActivities from "./sections/AdminActivities";
import AdminSocialLinks from "./sections/AdminSocialLinks";
import AdminSlides from "./sections/AdminSlides";
import AdminAbout from "./sections/AdminAbout";
import AdminContact from "./sections/AdminContact";
import AdminRegistrations from "./sections/AdminRegistrations";
import AdminFormTemplates from "./sections/AdminFormTemplates";
import AdminDemoAreas from "./sections/AdminDemoAreas";
import WavingFlag from "../../components/WavingFlag";

type Section = "dashboard" | "settings" | "topics" | "slides" | "activities" | "registrations" | "formTemplates" | "social" | "about" | "contact" | "demoAreas";

const sectionIds: { id: Section; labelKey: string; icon: React.ElementType }[] = [
  { id: "dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { id: "settings", labelKey: "siteSettings", icon: Settings },
  { id: "topics", labelKey: "topics", icon: Layers },
  { id: "slides", labelKey: "heroSlides", icon: Image },
  { id: "activities", labelKey: "activities", icon: Activity },
  { id: "registrations", labelKey: "registrations", icon: ClipboardList },
  { id: "formTemplates", labelKey: "formTemplates", icon: FileText },
  { id: "about", labelKey: "aboutUs", icon: Info },
  { id: "contact", labelKey: "contactMessages", icon: MessageSquare },
  { id: "social", labelKey: "socialLinks", icon: Link2 },
  { id: "demoAreas", labelKey: "demoAreas", icon: Globe2 },
];

export default function AdminDashboard() {
  const { logout, token } = useAuth();
  const { t, lang, setLang, isRtl } = useI18n();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mockActive, setMockActive] = useState(isMockMode());

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeSection]);

  useEffect(() => {
    refreshMockMode().then((enabled) => setMockActive(enabled));
  }, []);

  const handleDisableMock = async () => {
    try {
      const { backend } = await import("../../actor");
      await backend.setMockMode(token!, false);
      await refreshMockMode();
      window.location.reload();
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-[#1a1a2e] to-navy flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-strong py-3 px-6 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-bold text-white">{t("adminPanel")}</span>
        <button onClick={logout} className="text-accent/70 hover:text-accent">
          <LogOut size={20} />
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-strong z-40 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        initial={false}
      >
        <div className="p-6 border-b border-white/10">
          <button onClick={() => setActiveSection("dashboard")} className="text-left">
            <h2 className="text-xl font-bold text-white hover:text-primary transition-colors">{t("adminDashboard")}</h2>
            <p className="text-sm text-white/40 mt-1">{t("contentManagement")}</p>
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-1">
          {sectionIds.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === section.id
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              <section.icon size={18} />
              {t(section.labelKey as Parameters<typeof t>[0])}
              {activeSection === section.id && (
                isRtl
                  ? <ChevronLeft size={14} className="mr-auto" />
                  : <ChevronRight size={14} className="ml-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex gap-1.5 mb-2">
            {(["fa", "sv"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all ${lang === l
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-white/40 hover:text-white/70 bg-white/5 border border-white/10"
                  }`}
              >
                {l === "fa" ?
                  <div className="h-3 flex items-center justify-center gap-2">
                    <div className="w-5 h-5">
                      <WavingFlag
                        src="/assets/flag-iran.svg"
                        alt="Sweden"
                        amplitude={2}
                        frequency={0.3}
                        speed={0.05}
                      />
                    </div>
                    فارسی
                  </div>
                  :
                  <div className="h-3 flex items-center justify-center gap-2">
                    <div className="w-5 h-5">
                      <WavingFlag
                        src="/assets/flag-sweden.svg"
                        alt="Sweden"
                        amplitude={2}
                        frequency={0.3}
                        speed={0.05}
                      />
                    </div>
                    Svenska
                  </div>}
              </button>
            ))}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-accent/70 hover:text-accent hover:bg-accent/5 transition-colors"
          >
            <LogOut size={18} />
            {t("logout")}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 md:p-12 pt-18 md:pt-12 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto">
          {mockActive && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-amber-500/15 border border-amber-500/30 px-5 py-3">
              <FlaskConical size={18} className="text-amber-400 shrink-0" />
              <p className="text-sm text-amber-200 flex-1">{t("mockModeBanner")}</p>
              <button
                onClick={handleDisableMock}
                className="text-xs font-semibold text-amber-300 hover:text-amber-100 underline underline-offset-2 shrink-0"
              >
                {t("disableMockMode")}
              </button>
            </div>
          )}
          {activeSection === "dashboard" && <AdminOverview token={token!} />}
          {activeSection === "settings" && <AdminSettings token={token!} />}
          {activeSection === "topics" && <AdminTopics token={token!} readOnly={mockActive} />}
          {activeSection === "slides" && <AdminSlides token={token!} readOnly={mockActive} />}
          {activeSection === "activities" && <AdminActivities token={token!} readOnly={mockActive} />}
          {activeSection === "registrations" && <AdminRegistrations token={token!} />}
          {activeSection === "formTemplates" && <AdminFormTemplates token={token!} readOnly={mockActive} />}
          {activeSection === "about" && <AdminAbout token={token!} readOnly={mockActive} />}
          {activeSection === "contact" && <AdminContact token={token!} readOnly={mockActive} />}
          {activeSection === "social" && <AdminSocialLinks token={token!} readOnly={mockActive} />}
          {activeSection === "demoAreas" && <AdminDemoAreas />}
        </div>
      </main>
    </div>
  );
}
