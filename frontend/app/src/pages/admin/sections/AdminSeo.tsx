import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Copy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Toast from "../../../components/Toast";
import Modal from "../../../components/Modal";
import SeoSnippetPreview from "../../../components/SeoSnippetPreview";
import type { SeoSettings, PageSeoOverride } from "../../../backend/api/backend";

type Tab = "global" | "overrides" | "sitemap" | "robots";

interface Props {
  token: string;
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors text-sm";
const textareaClass = inputClass + " resize-y min-h-[80px]";

const DEFAULT_SEO: SeoSettings = {
  siteName: "Kanon",
  titleTemplate: "{page_title} | {site_name}",
  defaultTitle: "Kanon - Kultur, utbildning och sport",
  defaultDescription: "",
  defaultOgImage: "",
  twitterHandle: "",
  twitterCardType: "summary_large_image",
  googleVerification: "",
  bingVerification: "",
  canonicalBaseUrl: "https://kanon.app",
  defaultLang: "sv",
  googleAnalyticsId: "",
  robotsTxtExtra: "",
};

const DEFAULT_OVERRIDE: PageSeoOverride = {
  slug: "",
  title: "",
  description: "",
  ogImage: "",
  canonicalUrl: "",
  noIndex: false,
  noFollow: false,
  jsonLd: "",
  sitemapInclude: true,
  sitemapPriority: "0.5",
  sitemapChangefreq: "weekly",
  lastModified: "",
};

export default function AdminSeo({ token }: Props) {
  const [tab, setTab] = useState<Tab>("global");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  const [seo, setSeo] = useState<SeoSettings>(DEFAULT_SEO);

  const [overrides, setOverrides] = useState<PageSeoOverride[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOverride, setEditingOverride] =
    useState<PageSeoOverride>(DEFAULT_OVERRIDE);
  const [jsonLdError, setJsonLdError] = useState<string | null>(null);
  const [jsonLdValid, setJsonLdValid] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const [sitemapXml, setSitemapXml] = useState<string | null>(null);
  const [sitemapLoading, setSitemapLoading] = useState(false);
  const [robotsTxt, setRobotsTxt] = useState<string | null>(null);
  const [robotsLoading, setRobotsLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      import("../../../actor").then(({ backend }) => backend.getSeoSettings()),
      import("../../../actor").then(({ backend }) =>
        backend.listPageSeoOverrides(token)
      ),
    ]).then(([settings, list]) => {
      setSeo(settings);
      setOverrides(list);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    if (tab === "robots" && robotsTxt === null) loadRobotsTxt();
    if (tab === "sitemap" && sitemapXml === null) loadSitemap();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (message: string, type: "success" | "error") =>
    setToast({ message, type, visible: true });

  const handleSaveGlobal = async () => {
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      await backend.updateSeoSettings(token, seo);
      showToast("SEO settings saved!", "success");
    } catch {
      showToast("Failed to save SEO settings", "error");
    }
    setSaving(false);
  };

  const openAddModal = () => {
    setEditingOverride(DEFAULT_OVERRIDE);
    setJsonLdError(null);
    setJsonLdValid(false);
    setModalOpen(true);
  };

  const openEditModal = (o: PageSeoOverride) => {
    setEditingOverride({ ...o });
    setJsonLdError(null);
    setJsonLdValid(o.jsonLd !== "" && isValidJson(o.jsonLd));
    setModalOpen(true);
  };

  const isValidJson = (s: string) => {
    try {
      JSON.parse(s);
      return true;
    } catch {
      return false;
    }
  };

  const handleValidateJsonLd = () => {
    if (!editingOverride.jsonLd) {
      setJsonLdError(null);
      setJsonLdValid(false);
      return;
    }
    if (isValidJson(editingOverride.jsonLd)) {
      setJsonLdError(null);
      setJsonLdValid(true);
    } else {
      setJsonLdError("Invalid JSON — please check your syntax");
      setJsonLdValid(false);
    }
  };

  const handleSaveOverride = async () => {
    if (!editingOverride.slug) {
      showToast("Slug is required", "error");
      return;
    }
    setSaving(true);
    try {
      const { backend } = await import("../../../actor");
      await backend.setPageSeoOverride(token, editingOverride);
      const updated = await backend.listPageSeoOverrides(token);
      setOverrides(updated);
      setModalOpen(false);
      showToast("Override saved!", "success");
    } catch {
      showToast("Failed to save override", "error");
    }
    setSaving(false);
  };

  const handleDeleteOverride = async (slug: string) => {
    if (!window.confirm(`Delete SEO override for "${slug}"?`)) return;
    setDeletingSlug(slug);
    try {
      const { backend } = await import("../../../actor");
      await backend.deletePageSeoOverride(token, slug);
      setOverrides((prev) => prev.filter((o) => o.slug !== slug));
      showToast("Override deleted", "success");
    } catch {
      showToast("Failed to delete override", "error");
    }
    setDeletingSlug(null);
  };

  const loadSitemap = async () => {
    setSitemapLoading(true);
    try {
      const { backend } = await import("../../../actor");
      setSitemapXml(await backend.getSitemapXml());
    } catch {
      setSitemapXml("Failed to load sitemap.");
    }
    setSitemapLoading(false);
  };

  const loadRobotsTxt = async () => {
    setRobotsLoading(true);
    try {
      const { backend } = await import("../../../actor");
      setRobotsTxt(await backend.getRobotsTxt());
    } catch {
      setRobotsTxt("Failed to load robots.txt.");
    }
    setRobotsLoading(false);
  };

  const copyToClipboard = (text: string) =>
    navigator.clipboard.writeText(text).then(() => showToast("Copied!", "success"));

  const resolvedTitle = seo.titleTemplate
    .replace("{page_title}", seo.defaultTitle || "Page Title")
    .replace("{site_name}", seo.siteName || "Site Name");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-primary animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "global", label: "Global Settings" },
    { id: "overrides", label: `Per-Page Overrides (${overrides.length})` },
    { id: "sitemap", label: "Sitemap Preview" },
    { id: "robots", label: "Robots.txt" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">SEO Management</h2>

      {/* Tab Bar */}
      <div className="flex flex-wrap gap-1 mb-6 glass rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-primary/15 text-primary border border-primary/20"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Global Settings ── */}
      {tab === "global" && (
        <div className="space-y-6">
          {/* Site Identity */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Site Identity</h3>
              <motion.button
                onClick={handleSaveGlobal}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={15} />
                {saving ? "Saving…" : "Save"}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Site Name</label>
                <input
                  value={seo.siteName}
                  onChange={(e) => setSeo({ ...seo, siteName: e.target.value })}
                  className={inputClass}
                  placeholder="Kanon"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Canonical Base URL
                </label>
                <input
                  value={seo.canonicalBaseUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalBaseUrl: e.target.value })}
                  className={inputClass}
                  placeholder="https://kanon.app"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                Title Template{" "}
                <span className="text-white/30 font-normal">
                  — tokens:{" "}
                  <code className="bg-white/5 px-1 py-0.5 rounded text-xs">
                    {"{page_title}"}
                  </code>{" "}
                  <code className="bg-white/5 px-1 py-0.5 rounded text-xs">
                    {"{site_name}"}
                  </code>
                </span>
              </label>
              <input
                value={seo.titleTemplate}
                onChange={(e) => setSeo({ ...seo, titleTemplate: e.target.value })}
                className={inputClass}
                placeholder="{page_title} | {site_name}"
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                Default Title{" "}
                <span
                  className={`text-xs ${seo.defaultTitle.length > 60 ? "text-orange-400" : "text-white/30"}`}
                >
                  ({seo.defaultTitle.length}/60)
                </span>
              </label>
              <input
                value={seo.defaultTitle}
                onChange={(e) => setSeo({ ...seo, defaultTitle: e.target.value })}
                className={inputClass}
                placeholder="Kanon - Kultur, utbildning och sport"
              />
            </div>

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                Default Meta Description{" "}
                <span
                  className={`text-xs ${seo.defaultDescription.length > 160 ? "text-orange-400" : "text-white/30"}`}
                >
                  ({seo.defaultDescription.length}/160)
                </span>
              </label>
              <textarea
                value={seo.defaultDescription}
                onChange={(e) => setSeo({ ...seo, defaultDescription: e.target.value })}
                className={textareaClass}
                rows={3}
              />
            </div>

            <SeoSnippetPreview
              title={resolvedTitle}
              description={seo.defaultDescription}
              url={seo.canonicalBaseUrl || "https://kanon.app"}
            />

            <div>
              <label className="block text-sm text-white/50 mb-1.5">
                Default OG Image URL
              </label>
              <input
                value={seo.defaultOgImage}
                onChange={(e) => setSeo({ ...seo, defaultOgImage: e.target.value })}
                className={inputClass}
                placeholder="https://kanon.app/og-image.jpg"
              />
              {seo.defaultOgImage && (
                <img
                  src={seo.defaultOgImage}
                  alt="OG preview"
                  className="mt-2 h-20 rounded-lg object-cover border border-white/10"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* Social */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-white">Social & Twitter Card</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Twitter Handle
                </label>
                <input
                  value={seo.twitterHandle}
                  onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                  className={inputClass}
                  placeholder="@kanonapp"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Twitter Card Type
                </label>
                <select
                  value={seo.twitterCardType}
                  onChange={(e) => setSeo({ ...seo, twitterCardType: e.target.value })}
                  className={inputClass + " cursor-pointer"}
                >
                  <option value="summary_large_image" className="bg-black/70">summary_large_image</option>
                  <option value="summary" className="bg-black/70">summary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Console & Analytics */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h3 className="font-semibold text-white">Search Console & Analytics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Google Verification Token
                </label>
                <input
                  value={seo.googleVerification}
                  onChange={(e) =>
                    setSeo({ ...seo, googleVerification: e.target.value })
                  }
                  className={inputClass}
                  placeholder="google-site-verification content value"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Bing Verification Token
                </label>
                <input
                  value={seo.bingVerification}
                  onChange={(e) =>
                    setSeo({ ...seo, bingVerification: e.target.value })
                  }
                  className={inputClass}
                  placeholder="msvalidate.01 content value"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Google Analytics ID
                </label>
                <input
                  value={seo.googleAnalyticsId}
                  onChange={(e) =>
                    setSeo({ ...seo, googleAnalyticsId: e.target.value })
                  }
                  className={inputClass}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">
                  Default Language
                </label>
                <select
                  value={seo.defaultLang}
                  onChange={(e) => setSeo({ ...seo, defaultLang: e.target.value })}
                  className={inputClass + " cursor-pointer"}
                >
                  <option value="sv" className="bg-black/70">sv — Swedish</option>
                  <option value="fa" className="bg-black/70">fa — Farsi/Persian</option>
                </select>
              </div>
            </div>
          </div>

          {/* robots.txt extra rules */}
          <div className="glass rounded-2xl p-6 space-y-3">
            <h3 className="font-semibold text-white">robots.txt Extra Rules</h3>
            <p className="text-xs text-white/40">
              Added after the default{" "}
              <code className="bg-white/5 px-1 rounded">Disallow: /admin</code> rules,
              one rule per line.
            </p>
            <textarea
              value={seo.robotsTxtExtra}
              onChange={(e) => setSeo({ ...seo, robotsTxtExtra: e.target.value })}
              className={textareaClass}
              rows={4}
              placeholder={"Disallow: /staging\nDisallow: /private"}
            />
          </div>
        </div>
      )}

      {/* ── Tab 2: Per-Page Overrides ── */}
      {tab === "overrides" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/50">
              {overrides.length} override(s) configured
            </p>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={15} />
              Add Override
            </button>
          </div>

          {overrides.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-white/40 text-sm">
              No per-page SEO overrides configured yet.
            </div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-5 py-3 text-white/40 font-medium">
                      Slug
                    </th>
                    <th className="text-left px-5 py-3 text-white/40 font-medium hidden md:table-cell">
                      Title Override
                    </th>
                    <th className="text-center px-4 py-3 text-white/40 font-medium">
                      noIndex
                    </th>
                    <th className="text-center px-4 py-3 text-white/40 font-medium">
                      Sitemap
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {overrides.map((o) => (
                    <tr
                      key={o.slug}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 text-white/80 font-mono text-xs">
                        {o.slug}
                      </td>
                      <td className="px-5 py-3 text-white/50 hidden md:table-cell">
                        {o.title || (
                          <span className="text-white/20 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {o.noIndex ? (
                          <span className="text-red-400 text-xs font-medium">
                            noindex
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {o.sitemapInclude ? (
                          <span className="text-green-400 text-xs font-bold">✓</span>
                        ) : (
                          <span className="text-red-400 text-xs font-bold">✗</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => openEditModal(o)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteOverride(o.slug)}
                            disabled={deletingSlug === o.slug}
                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                          >
                            {deletingSlug === o.slug ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Sitemap Preview ── */}
      {tab === "sitemap" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadSitemap}
              disabled={sitemapLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {sitemapLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              {sitemapXml ? "Refresh" : "Load Sitemap"}
            </button>
            {seo.canonicalBaseUrl && (
              <button
                onClick={() =>
                  copyToClipboard(seo.canonicalBaseUrl + "/sitemap.xml")
                }
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 rounded-xl text-sm font-medium transition-colors"
              >
                <Copy size={14} />
                Copy sitemap URL
              </button>
            )}
            {sitemapXml && (
              <span className="text-xs text-white/40">
                {(sitemapXml.match(/<url>/g) ?? []).length} URL(s) in sitemap
              </span>
            )}
          </div>
          {sitemapXml ? (
            <pre className="glass rounded-2xl p-5 text-xs text-green-300/80 overflow-auto max-h-[60vh] leading-relaxed whitespace-pre-wrap font-mono">
              {sitemapXml}
            </pre>
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-white/40 text-sm">
              {sitemapLoading
                ? "Loading sitemap…"
                : 'Click "Load Sitemap" to preview the generated XML.'}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 4: Robots.txt ── */}
      {tab === "robots" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={loadRobotsTxt}
              disabled={robotsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {robotsLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Refresh
            </button>
            {robotsTxt && (
              <button
                onClick={() => copyToClipboard(robotsTxt)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 rounded-xl text-sm font-medium transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            )}
          </div>
          {robotsTxt ? (
            <pre className="glass rounded-2xl p-5 text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">
              {robotsTxt}
            </pre>
          ) : (
            <div className="glass rounded-2xl p-12 text-center text-white/40 text-sm">
              {robotsLoading ? "Loading…" : "Loading robots.txt…"}
            </div>
          )}
        </div>
      )}

      {/* ── Per-Page Override Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingOverride.slug && overrides.some((o) => o.slug === editingOverride.slug)
            ? `Edit Override: ${editingOverride.slug}`
            : "Add Page SEO Override"
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/50 mb-1.5">
              Route Slug{" "}
              <span className="text-white/30">
                (e.g. <code className="bg-white/5 px-1 rounded text-xs">sv/topics/musik/piano</code>)
              </span>
            </label>
            <input
              value={editingOverride.slug}
              onChange={(e) =>
                setEditingOverride({ ...editingOverride, slug: e.target.value })
              }
              className={inputClass}
              placeholder="sv/topics/musik"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">
              Title Override{" "}
              <span className="text-white/30">(empty = use global template)</span>
              <span
                className={`ml-2 text-xs ${editingOverride.title.length > 60 ? "text-orange-400" : "text-white/30"}`}
              >
                ({editingOverride.title.length}/60)
              </span>
            </label>
            <input
              value={editingOverride.title}
              onChange={(e) =>
                setEditingOverride({ ...editingOverride, title: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">
              Description Override
              <span
                className={`ml-2 text-xs ${editingOverride.description.length > 160 ? "text-orange-400" : "text-white/30"}`}
              >
                ({editingOverride.description.length}/160)
              </span>
            </label>
            <textarea
              value={editingOverride.description}
              onChange={(e) =>
                setEditingOverride({
                  ...editingOverride,
                  description: e.target.value,
                })
              }
              className={textareaClass}
              rows={3}
            />
          </div>

          <SeoSnippetPreview
            title={editingOverride.title || resolvedTitle}
            description={editingOverride.description || seo.defaultDescription}
            url={
              (seo.canonicalBaseUrl || "") +
              (editingOverride.slug ? "/" + editingOverride.slug : "")
            }
          />

          <div>
            <label className="block text-sm text-white/50 mb-1.5">
              OG Image URL Override
            </label>
            <input
              value={editingOverride.ogImage}
              onChange={(e) =>
                setEditingOverride({ ...editingOverride, ogImage: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-1.5">
              Canonical URL Override
            </label>
            <input
              value={editingOverride.canonicalUrl}
              onChange={(e) =>
                setEditingOverride({
                  ...editingOverride,
                  canonicalUrl: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(
              [
                { key: "noIndex", label: "noIndex" },
                { key: "noFollow", label: "noFollow" },
                { key: "sitemapInclude", label: "Include in Sitemap" },
              ] as { key: "noIndex" | "noFollow" | "sitemapInclude"; label: string }[]
            ).map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    setEditingOverride({
                      ...editingOverride,
                      [key]: !editingOverride[key],
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    editingOverride[key] ? "bg-primary" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      editingOverride[key] ? "ltr:translate-x-6 rtl:-translate-x-6" : "ltr:translate-x-1 rtl:-translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-white/60">{label}</span>
              </label>
            ))}
          </div>

          {/* JSON-LD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm text-white/50">JSON-LD Override</label>
              <button
                type="button"
                onClick={handleValidateJsonLd}
                className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white/80 transition-colors"
              >
                Validate JSON
              </button>
            </div>
            <textarea
              value={editingOverride.jsonLd}
              onChange={(e) => {
                setEditingOverride({ ...editingOverride, jsonLd: e.target.value });
                setJsonLdValid(false);
                setJsonLdError(null);
              }}
              className={textareaClass}
              rows={4}
              placeholder={'{"@context":"https://schema.org","@type":"WebPage"…}'}
            />
            {jsonLdError && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <XCircle size={12} />
                {jsonLdError}
              </p>
            )}
            {jsonLdValid && (
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <CheckCircle size={12} />
                Valid JSON
              </p>
            )}
          </div>

          {/* Sitemap fields */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Priority</label>
              <select
                value={editingOverride.sitemapPriority}
                onChange={(e) =>
                  setEditingOverride({
                    ...editingOverride,
                    sitemapPriority: e.target.value,
                  })
                }
                className={inputClass + " cursor-pointer"}
              >
                {["0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1.0"].map(
                  (v) => (
                    <option key={v} value={v} className="bg-black/70">
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Changefreq</label>
              <select
                value={editingOverride.sitemapChangefreq}
                onChange={(e) =>
                  setEditingOverride({
                    ...editingOverride,
                    sitemapChangefreq: e.target.value,
                  })
                }
                className={inputClass + " cursor-pointer"}
              >
                {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map(
                  (v) => (
                    <option key={v} value={v} className="bg-black/70">
                      {v}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-1.5">Last Modified</label>
              <input
                type="date"
                value={editingOverride.lastModified}
                onChange={(e) =>
                  setEditingOverride({
                    ...editingOverride,
                    lastModified: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-white/10">
            <motion.button
              onClick={handleSaveOverride}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-navy font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={15} />
              {saving ? "Saving…" : "Save Override"}
            </motion.button>
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 text-sm text-white/50 hover:text-white/80 border border-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
