import type { backendInterface, RegistrationReturn } from "../backend/api/backend";
import {
  mockSettings,
  mockTopics,
  mockActivities,
  mockSlides,
  mockAbout,
  mockContactMessages,
  mockSocialLinks,
  mockRegistrations,
  mockFormTemplates,
  mockEventRegistrationTemplates,
} from "./mockData";

/**
 * Mock backend that returns static sample data for all read operations.
 * Write operations are no-ops that return mock success responses.
 * Auth operations are NOT handled here — they must be routed to the real backend.
 */
export const mockBackend: backendInterface = {
  // ── Read operations return mock data ──────────────────────────────────

  async getSettings() {
    return mockSettings;
  },

  async getTopics() {
    return mockTopics;
  },

  async getTopic(id) {
    return mockTopics.find((t) => t.id === id) ?? null;
  },

  async getTopicBySlug(slug) {
    return mockTopics.find((t) => t.slug === slug) ?? null;
  },

  async getActivitiesByTopic(topicId) {
    return mockActivities.filter((a) => a.topicId === topicId);
  },

  async getActivity(id) {
    return mockActivities.find((a) => a.id === id) ?? null;
  },

  async getActivityBySlug(topicId, slug) {
    return (
      mockActivities.find((a) => a.topicId === topicId && a.slug === slug) ??
      null
    );
  },

  async getAllActivities() {
    return mockActivities;
  },

  async getSlidesByTopic(topicId) {
    return mockSlides.filter((s) => s.topicId === topicId);
  },

  async getAboutContent() {
    return mockAbout;
  },

  async getSocialLinks() {
    return mockSocialLinks;
  },

  async getContactMessages() {
    return mockContactMessages;
  },

  async getRegistrations(_token, activityId) {
    return mockRegistrations
      .filter((r) => r.activityId === activityId)
      .map((r): RegistrationReturn => ({ ...r, archived: false }));
  },

  async getRegistrationsWithStatus(_token, activityId) {
    const activity = mockActivities.find((a) => a.id === activityId);
    const sessions = activity?.sessions ?? [];
    const regs = mockRegistrations.filter((r) => r.activityId === activityId);
    const sorted = [...regs].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
    return regs.map((reg) => {
      const selectedSessions = reg.selectedSessions.map((ss) => {
        const session = sessions.find((s) => s.id === ss.sessionId);
        let status = "confirmed";
        if (session) {
          const cap = Number(session.capacity);
          let cumulative = 0;
          for (const r of sorted) {
            if (!r.selectedSessions.some((s) => s.sessionId === ss.sessionId)) continue;
            if (r.id === reg.id) { status = cumulative < cap ? "confirmed" : "buffer"; break; }
            cumulative += Number(r.personCount);
          }
        }
        return { sessionId: ss.sessionId, sessionName: ss.sessionName, status };
      });
      return {
        id: reg.id, activityId: reg.activityId,
        name: reg.name, email: reg.email, phone: reg.phone, message: reg.message ?? "",
        personCount: reg.personCount, selectedSessions,
        fieldValues: reg.fieldValues.map((fv) => ({ fieldId: fv.fieldId, fieldLabel: fv.fieldLabel, value: fv.value })),
        members: [],
        createdAt: reg.createdAt,
        archived: false,
      };
    });
  },

  async getAllRegistrations() {
    return mockRegistrations.map((r): RegistrationReturn => ({ ...r, archived: false }));
  },

  async getFormTemplates() {
    return mockFormTemplates;
  },

  async getFormTemplate(id) {
    return mockFormTemplates.find((t) => t.id === id) ?? null;
  },

  async getActivityFormFields(activityId) {
    const activity = mockActivities.find((a) => a.id === activityId);
    if (!activity || !activity.hasRegistration) return null;
    if (activity.customFormFields.length > 0) return activity.customFormFields;
    if (activity.formTemplateId) {
      const template = mockFormTemplates.find((t) => t.id === activity.formTemplateId);
      if (template) return template.fields;
    }
    return null;
  },

  async getActivityRegistrationConfig(activityId: bigint) {
    const activity = mockActivities.find((a) => a.id === activityId);
    if (!activity) return null;
    const allFields = activity.customFormFields ?? [];
    const sharedFields = allFields.filter((f) => !f.perMember || f.isLookupField);
    const perMemberFields = allFields.filter((f) => f.perMember && !f.isLookupField);
    return {
      activityId,
      hasRegistration: activity.hasRegistration,
      perMemberMode: perMemberFields.length > 0,
      minMembers: 1n,
      maxMembers: 20n,
      sharedFields,
      perMemberFields,
      sessions: activity.sessions ?? [],
    };
  },

  async getAsset() {
    return null;
  },

  async listAssets() {
    return [];
  },

  // ── Write operations are no-ops ───────────────────────────────────────

  async createTopic(_token, slug, title_fa, title_sv, description_fa, description_sv, icon, backgroundUrl, sortOrder) {
    return {
      id: BigInt(Date.now()), slug, title_fa, title_sv, description_fa, description_sv,
      icon, backgroundUrl, sortOrder, createdAt: BigInt(Date.now()) * 1_000_000n,
    };
  },

  async updateTopic(_token, id, slug, title_fa, title_sv, description_fa, description_sv, icon, backgroundUrl, sortOrder) {
    return {
      id, slug, title_fa, title_sv, description_fa, description_sv,
      icon, backgroundUrl, sortOrder, createdAt: 0n,
    };
  },

  async deleteTopic() { return true; },

  async createActivity(_token, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv, body_fa, body_sv, icon, imageUrl, hasRegistration, registrationMode, formTemplateId, eventTemplateId, customFormFields, sessions, highlighted, sortOrder) {
    return {
      id: BigInt(Date.now()), topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv,
      body_fa, body_sv, icon, imageUrl, hasRegistration, registrationMode,
      formTemplateId: formTemplateId ?? undefined,
      eventTemplateId: eventTemplateId ?? undefined,
      customFormFields,
      sessions,
      highlighted,
      sortOrder,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };
  },

  async updateActivity(_token, id, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv, body_fa, body_sv, icon, imageUrl, hasRegistration, registrationMode, formTemplateId, eventTemplateId, customFormFields, sessions, highlighted, sortOrder) {
    return {
      id, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv,
      body_fa, body_sv, icon, imageUrl, hasRegistration, registrationMode,
      formTemplateId: formTemplateId ?? undefined,
      eventTemplateId: eventTemplateId ?? undefined,
      customFormFields,
      sessions,
      highlighted,
      sortOrder,
      createdAt: 0n,
    };
  },

  async deleteActivity() { return true; },

  async createFormTemplate(_token, name_fa, name_sv, description_fa, description_sv, fields, minMembers, maxMembers) {
    return {
      id: BigInt(Date.now()), name_fa, name_sv, description_fa, description_sv, fields,
      createdAt: BigInt(Date.now()) * 1_000_000n,
      minMembers, maxMembers,
    };
  },

  async updateFormTemplate(_token, id, name_fa, name_sv, description_fa, description_sv, fields, minMembers, maxMembers) {
    return { id, name_fa, name_sv, description_fa, description_sv, fields, createdAt: 0n, minMembers, maxMembers };
  },

  async deleteFormTemplate() { return true; },

  async getEventRegistrationTemplates() { return mockEventRegistrationTemplates; },
  async getEventRegistrationTemplate(id: bigint) { return mockEventRegistrationTemplates.find((t) => t.id === id) ?? null; },
  async createEventRegistrationTemplate(_token: string, name_fa: string, name_sv: string, description_fa: string, description_sv: string, sessions: import("../backend/api/backend").EventSessionReturn[], fields: import("../backend/api/backend").FormFieldReturn[], perMemberMode: boolean, minMembers: bigint, maxMembers: bigint) {
    return { id: BigInt(Date.now()), name_fa, name_sv, description_fa, description_sv, sessions, fields, createdAt: BigInt(Date.now()) * 1_000_000n, perMemberMode, minMembers, maxMembers };
  },
  async updateEventRegistrationTemplate(_token: string, id: bigint, name_fa: string, name_sv: string, description_fa: string, description_sv: string, sessions: import("../backend/api/backend").EventSessionReturn[], fields: import("../backend/api/backend").FormFieldReturn[], perMemberMode: boolean, minMembers: bigint, maxMembers: bigint) {
    return { id, name_fa, name_sv, description_fa, description_sv, sessions, fields, createdAt: 0n, perMemberMode, minMembers, maxMembers };
  },
  async deleteEventRegistrationTemplate() { return true; },
  async getActivitiesUsingEventTemplate(_id: bigint) { return [] as { id: bigint; slug: string; title_fa: string; title_sv: string; liveRegistrationCount: bigint }[]; },

  async createSlide(_token, topicId, imageUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, ctaText_fa, ctaText_sv, ctaLink, sortOrder) {
    return {
      id: BigInt(Date.now()), topicId, imageUrl, title_fa, title_sv,
      subtitle_fa, subtitle_sv, ctaText_fa, ctaText_sv, ctaLink, sortOrder,
    };
  },

  async updateSlide(_token, id, topicId, imageUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, ctaText_fa, ctaText_sv, ctaLink, sortOrder) {
    return {
      id, topicId, imageUrl, title_fa, title_sv,
      subtitle_fa, subtitle_sv, ctaText_fa, ctaText_sv, ctaLink, sortOrder,
    };
  },

  async deleteSlide() { return true; },

  async createSocialLink(_token, platform, url, sortOrder) {
    return { id: BigInt(Date.now()), platform, url, sortOrder };
  },

  async updateSocialLink(_token, id, platform, url, sortOrder) {
    return { id, platform, url, sortOrder };
  },

  async deleteSocialLink() { return true; },

  async updateAboutContent(_token, headerImageUrl, body_fa, body_sv) {
    return { headerImageUrl, body_fa, body_sv };
  },

  async updateSettings(_token, logoUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, landingBackgroundUrl, topicsBackgroundUrl, contactIntro_fa, contactIntro_sv) {
    return { logoUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, landingBackgroundUrl, topicsBackgroundUrl, contactIntro_fa, contactIntro_sv, mockMode: true };
  },

  async submitContactMessage(name, email, phone, message) {
    return { id: BigInt(Date.now()), name, email, phone, message, createdAt: BigInt(Date.now()) * 1_000_000n };
  },

  async submitRegistration(activityId, name, email, phone, message, personCount, _selectedSessionIds, _fieldValues, _members) {
    return { __kind__: "ok" as const, ok: { id: BigInt(Date.now()), activityId, name, email, phone, message, personCount, selectedSessions: [], fieldValues: [], createdAt: BigInt(Date.now()) * 1_000_000n, archived: false, members: [] } };
  },

  async deleteContactMessage() { return true; },

  async getSessionAvailability(activityId) {
    const activity = mockActivities.find((a) => a.id === activityId);
    if (!activity || activity.sessions.length === 0) return [];
    const regs = mockRegistrations.filter((r) => r.activityId === activityId);
    const sorted = [...regs].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
    return activity.sessions.map((session) => {
      let confirmed = 0, buffered = 0;
      const cap = Number(session.capacity), buf = Number(session.bufferCapacity);
      for (const r of sorted) {
        if (!r.selectedSessions.some((ss) => ss.sessionId === session.id)) continue;
        const n = Number(r.personCount);
        if (confirmed + n <= cap) confirmed += n;
        else if (buffered + n <= buf) buffered += n;
      }
      return {
        sessionId: session.id, name_fa: session.name_fa, name_sv: session.name_sv,
        date: session.date, capacity: session.capacity, bufferCapacity: session.bufferCapacity,
        confirmedCount: BigInt(confirmed), bufferCount: BigInt(buffered),
        regularFull: confirmed >= cap, totalFull: confirmed >= cap && buffered >= buf,
        sortOrder: session.sortOrder,
      };
    });
  },

  async getSessionStats(_token, activityId) {
    const activity = mockActivities.find((a) => a.id === activityId);
    if (!activity || activity.sessions.length === 0) return [];
    const regs = mockRegistrations.filter((r) => r.activityId === activityId);
    const sorted = [...regs].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
    return activity.sessions.map((session) => {
      let confirmed = 0, buffered = 0;
      const cap = Number(session.capacity), buf = Number(session.bufferCapacity);
      for (const r of sorted) {
        if (!r.selectedSessions.some((ss) => ss.sessionId === session.id)) continue;
        const n = Number(r.personCount);
        if (confirmed + n <= cap) confirmed += n;
        else if (buffered + n <= buf) buffered += n;
      }
      const regCount = regs.filter((r) => r.selectedSessions.some((ss) => ss.sessionId === session.id)).length;
      return {
        sessionId: session.id, name_fa: session.name_fa, name_sv: session.name_sv,
        date: session.date, capacity: session.capacity, bufferCapacity: session.bufferCapacity,
        confirmedCount: BigInt(confirmed), bufferCount: BigInt(buffered),
        registrationCount: BigInt(regCount), sortOrder: session.sortOrder,
      };
    });
  },

  async getRegistrationById(id, lookupValue) {
    const reg = mockRegistrations.find((r) => {
      if (r.id !== id) return false;
      if (r.phone === lookupValue) return true;
      return r.fieldValues.some((fv) => fv.value.toLowerCase() === lookupValue.toLowerCase());
    });
    if (!reg) return null;
    const activity = mockActivities.find((a) => a.id === reg.activityId);
    const sessions = activity?.sessions ?? [];
    const regs = mockRegistrations.filter((r) => r.activityId === reg.activityId);
    const sorted = [...regs].sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
    const selectedSessions = reg.selectedSessions.map((ss) => {
      const session = sessions.find((s) => s.id === ss.sessionId);
      let status = "confirmed";
      if (session) {
        const cap = Number(session.capacity);
        let cumulative = 0;
        for (const r of sorted) {
          if (!r.selectedSessions.some((s) => s.sessionId === ss.sessionId)) continue;
          if (r.id === reg.id) { status = cumulative < cap ? "confirmed" : "buffer"; break; }
          cumulative += Number(r.personCount);
        }
      }
      return { sessionId: ss.sessionId, sessionName: ss.sessionName, status };
    });
    return {
      id: reg.id, activityId: reg.activityId,
      name: reg.name, email: reg.email, phone: reg.phone, message: reg.message ?? "",
      personCount: reg.personCount, selectedSessions,
      fieldValues: reg.fieldValues.map((fv) => ({ fieldId: fv.fieldId, fieldLabel: fv.fieldLabel, value: fv.value })),
      createdAt: reg.createdAt,
      archived: false,
      members: [],
    };
  },

  async cancelRegistration(id, lookupValue) {
    return mockRegistrations.some((r) => {
      if (r.id !== id) return false;
      if (r.phone === lookupValue) return true;
      return r.fieldValues.some((fv) => fv.value.toLowerCase() === lookupValue.toLowerCase());
    });
  },

  async modifyRegistration(id, lookupValue, newPersonCount, _newSessionIds, _fieldValues, _newMembers) {
    const reg = mockRegistrations.find((r) => {
      if (r.id !== id) return false;
      if (r.phone === lookupValue) return true;
      return r.fieldValues.some((fv) => fv.value.toLowerCase() === lookupValue.toLowerCase());
    });
    if (!reg) return { __kind__: "invalidInput" as const, invalidInput: null };
    return {
      __kind__: "ok" as const,
      ok: {
        id: reg.id, activityId: reg.activityId,
        name: reg.name, email: reg.email, phone: reg.phone, message: reg.message ?? "",
        personCount: newPersonCount, selectedSessions: [],
        fieldValues: [], createdAt: reg.createdAt,
        archived: false,
        members: [],
      },
    };
  },

  async uploadAsset() { return "/mock/asset"; },
  async deleteAsset() { return true; },

  // ── SEO stubs — no-ops or empty data in mock mode ──────────────────────

  async getSeoSettings() {
    return {
      siteName: "Kanon", titleTemplate: "{page_title} | {site_name}",
      defaultTitle: "Kanon - Kultur, utbildning och sport",
      defaultDescription: "", defaultOgImage: "", twitterHandle: "",
      twitterCardType: "summary_large_image", googleVerification: "",
      bingVerification: "", canonicalBaseUrl: "https://kanon.app",
      defaultLang: "sv", googleAnalyticsId: "", robotsTxtExtra: "",
    };
  },
  async updateSeoSettings() {},
  async getPageSeoOverride() { return null; },
  async setPageSeoOverride() {},
  async deletePageSeoOverride() {},
  async listPageSeoOverrides() { return []; },
  async getRobotsTxt() { return "User-agent: *\nDisallow: /admin\nSitemap: https://kanon.app/sitemap.xml\n"; },
  async getSitemapXml() { return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n</urlset>"; },
  async http_request() { return { status_code: 404, headers: [] as Array<[string, string]>, body: new Uint8Array(), streaming_strategy: undefined }; },

  // ── Auth operations — these should NEVER be called on mockBackend ─────
  // They exist only to satisfy the interface. The proxy routes them to the real backend.

  async adminLogin() { return null; },
  async adminLogout() {},
  async checkSession() { return false; },
  async changePassword() { return false; },
  async setMockMode() { return false; },
  async setRegistrationArchived() { return true; },
};
