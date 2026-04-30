import type { backendInterface } from "../backend/api/backend";
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
    return mockRegistrations.filter((r) => r.activityId === activityId);
  },

  async getAllRegistrations() {
    return mockRegistrations;
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

  async createActivity(_token, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv, body_fa, body_sv, icon, imageUrl, hasRegistration, formTemplateId, customFormFields, sortOrder) {
    return {
      id: BigInt(Date.now()), topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv,
      body_fa, body_sv, icon, imageUrl, hasRegistration, formTemplateId: formTemplateId ?? undefined, customFormFields, sortOrder,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };
  },

  async updateActivity(_token, id, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv, body_fa, body_sv, icon, imageUrl, hasRegistration, formTemplateId, customFormFields, sortOrder) {
    return {
      id, topicId, slug, title_fa, title_sv, excerpt_fa, excerpt_sv,
      body_fa, body_sv, icon, imageUrl, hasRegistration, formTemplateId: formTemplateId ?? undefined, customFormFields, sortOrder, createdAt: 0n,
    };
  },

  async deleteActivity() { return true; },

  async createFormTemplate(_token, name_fa, name_sv, description_fa, description_sv, fields) {
    return {
      id: BigInt(Date.now()), name_fa, name_sv, description_fa, description_sv, fields,
      createdAt: BigInt(Date.now()) * 1_000_000n,
    };
  },

  async updateFormTemplate(_token, id, name_fa, name_sv, description_fa, description_sv, fields) {
    return { id, name_fa, name_sv, description_fa, description_sv, fields, createdAt: 0n };
  },

  async deleteFormTemplate() { return true; },

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

  async updateSettings(_token, logoUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, landingBackgroundUrl, topicsBackgroundUrl) {
    return { logoUrl, title_fa, title_sv, subtitle_fa, subtitle_sv, landingBackgroundUrl, topicsBackgroundUrl, mockMode: true };
  },

  async submitContactMessage(name, email, phone, message) {
    return { id: BigInt(Date.now()), name, email, phone, message, createdAt: BigInt(Date.now()) * 1_000_000n };
  },

  async submitRegistration(activityId, name, email, phone, message, _fieldValues) {
    return { id: BigInt(Date.now()), activityId, name, email, phone, message, fieldValues: [], createdAt: BigInt(Date.now()) * 1_000_000n };
  },

  async deleteContactMessage() { return true; },

  async uploadAsset() { return "/mock/asset"; },
  async deleteAsset() { return true; },

  // ── Auth operations — these should NEVER be called on mockBackend ─────
  // They exist only to satisfy the interface. The proxy routes them to the real backend.

  async adminLogin() { return null; },
  async adminLogout() {},
  async checkSession() { return false; },
  async changePassword() { return false; },
  async setMockMode() { return false; },
};
