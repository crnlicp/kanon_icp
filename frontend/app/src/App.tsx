import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { I18nProvider, useI18n } from "./i18n";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import TopicsPage from "./pages/TopicsPage";
import TopicHomePage from "./pages/TopicHomePage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import type { TopicReturn, SocialLinkReturn, SiteSettingsReturn } from "./backend/api/backend";

interface TopicLink {
  slug: string;
  title: string;
}

interface SocialLinkData {
  id: number;
  platform: string;
  url: string;
}

function PublicLayout() {
  const { lang, localized } = useI18n();
  const [topics, setTopics] = useState<TopicLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    import("./actor").then(({ backend }) => {
      backend.getTopics().then((data: TopicReturn[]) => {
        setTopics(
          data.map((t: TopicReturn) => ({
            slug: t.slug,
            title: localized(t.title_fa, t.title_sv),
          }))
        );
      });
      backend.getSocialLinks().then((data: SocialLinkReturn[]) => {
        setSocialLinks(data.map((l: SocialLinkReturn) => ({ ...l, id: Number(l.id) })));
      });
      backend.getSettings().then((s: SiteSettingsReturn) => {
        setLogoUrl(s.logoUrl);
        setTitle(localized(s.title_fa, s.title_sv));
      });
    });
  }, [lang, localized]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoUrl={logoUrl} title={title} topics={topics} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer socialLinks={socialLinks} />
    </div>
  );
}

function AdminRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Public pages with header/footer */}
            <Route element={<PublicLayout />}>
              <Route path="/:lang/topics" element={<TopicsPage />} />
              <Route path="/:lang/topics/:topicSlug" element={<TopicHomePage />} />
              <Route path="/:lang/topics/:topicSlug/:activitySlug" element={<ActivityDetailPage />} />
              <Route path="/:lang/about" element={<AboutPage />} />
              <Route path="/:lang/contact" element={<ContactPage />} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}
