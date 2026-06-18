/**
 * Kanon — Backend Data Seeder
 * --------------------------------------------------
 * Wipes all content (topics, activities, slides, form templates, social links)
 * and re-creates everything from `seed-data.ts`. Idempotent — safe to re-run.
 *
 *   npm run seed                 # default admin password "password"
 *   ADMIN_PASSWORD=xxx npm run seed
 *   BACKEND_HOST=http://127.0.0.1:8000 BACKEND_CANISTER_ID=... npm run seed
 *
 * The canister id and host are read from
 *   ../../.icp/cache/mappings/local.ids.json
 *   ../../.icp/cache/networks/local/descriptor.json
 * unless overridden by env vars.
 * BACKEND_CANISTER_ID=iooqr-rqaaa-aaaae-qkfia-cai \
 * BACKEND_HOST=https://icp-api.io \
 * ADMIN_PASSWORD='[admin_password]' \
 * npm run seed
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

import { HttpAgent } from "@icp-sdk/core/agent";
import { createActor } from "../src/backend/api/backend";
import type {
  FormFieldReturn,
  EventSessionReturn,
  Backend,
} from "../src/backend/api/backend";

import {
  settings,
  aboutContent,
  socialLinks,
  basicFormTemplate,
  moharramEventTemplate,
  topics,
  type SeedTopic,
} from "./seed-data";

// ---------------- Configuration ----------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..", "..", "..");

function readJSON<T = unknown>(p: string): T {
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function resolveBackendConfig() {
  const envCanister = process.env.BACKEND_CANISTER_ID;
  const envHost = process.env.BACKEND_HOST;

  let canisterId = envCanister;
  let host = envHost;
  let rootKey: string | undefined;

  try {
    const ids = readJSON<Record<string, string>>(
      resolve(projectRoot, ".icp/cache/mappings/local.ids.json")
    );
    canisterId ??= ids.backend;
  } catch {
    /* ignore */
  }

  try {
    const descriptor = readJSON<{
      gateway?: { host?: string; port?: number };
      "root-key"?: string;
    }>(resolve(projectRoot, ".icp/cache/networks/local/descriptor.json"));
    const gw = descriptor.gateway;
    if (!host && gw?.host && gw?.port) host = `http://${gw.host}:${gw.port}`;
    rootKey = descriptor["root-key"];
  } catch {
    /* ignore */
  }

  if (!canisterId) {
    throw new Error("Could not resolve BACKEND_CANISTER_ID");
  }
  host ??= "http://127.0.0.1:8000";

  return { canisterId, host, rootKey };
}

function isLocalHost(host: string): boolean {
  return (
    host.startsWith("http://127.0.0.1") ||
    host.startsWith("http://localhost") ||
    host.startsWith("https://127.0.0.1") ||
    host.startsWith("https://localhost")
  );
}

function resolveAgentHost(host: string): string {
  if (isLocalHost(host)) {
    return host;
  }

  if (host.includes("icp0.io") || host.includes("ic0.app")) {
    return "https://icp-api.io";
  }

  return host;
}

function allowRemoteTlsIfNeeded(host: string) {
  if (isLocalHost(host)) {
    return;
  }

  if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.warn(
      "[seed] enabling NODE_TLS_REJECT_UNAUTHORIZED=0 for remote IC gateway access"
    );
  }
}

// ---------------- Helpers ----------------

function sha256Hex(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function field(
  index: number,
  f: {
    fieldType: string;
    label_fa: string;
    label_sv: string;
    placeholder_fa?: string;
    placeholder_sv?: string;
    required: boolean;
    isLookupField: boolean;
    options?: { fa: string; sv: string }[];
    minValue?: number;
    maxValue?: number;
    scope?: "shared" | "perMember";
    excludeFromCapacityWhenChecked?: boolean;
    unique?: boolean;
    allowedValues?: string[];
  }
): FormFieldReturn {
  return {
    id: BigInt(index + 1),
    sortOrder: BigInt(index + 1),
    fieldType: f.fieldType,
    label_fa: f.label_fa,
    label_sv: f.label_sv,
    placeholder_fa: f.placeholder_fa ?? "",
    placeholder_sv: f.placeholder_sv ?? "",
    required: f.required,
    isLookupField: f.isLookupField,
    perMember: f.scope === "perMember",
    excludeFromCapacityWhenChecked: f.excludeFromCapacityWhenChecked ?? false,
    unique: f.unique ?? false,
    allowedValues: f.allowedValues ?? [],
    options: f.options ?? [],
    ...(f.minValue !== undefined ? { minValue: BigInt(f.minValue) } : {}),
    ...(f.maxValue !== undefined ? { maxValue: BigInt(f.maxValue) } : {}),
  };
}

const log = (msg: string) => console.log(`  ${msg}`);
const section = (msg: string) => console.log(`\n=== ${msg} ===`);

// ---------------- Wipe ----------------

async function wipe(backend: Backend, token: string) {
  section("Wiping existing data");

  const activities = await backend.getAllActivities();
  for (const a of activities) {
    await backend.deleteActivity(token, a.id);
  }
  log(`Deleted ${activities.length} activities`);

  const topicsExisting = await backend.getTopics();
  for (const t of topicsExisting) {
    const slides = await backend.getSlidesByTopic(t.id);
    for (const s of slides) await backend.deleteSlide(token, s.id);
    if (slides.length) log(`  Deleted ${slides.length} slides for topic '${t.slug}'`);
  }
  for (const t of topicsExisting) {
    await backend.deleteTopic(token, t.id);
  }
  log(`Deleted ${topicsExisting.length} topics`);

  const templates = await backend.getFormTemplates();
  for (const f of templates) {
    await backend.deleteFormTemplate(token, f.id);
  }
  log(`Deleted ${templates.length} form templates`);

  const eventTemplates = await backend.getEventRegistrationTemplates();
  for (const e of eventTemplates) {
    await backend.deleteEventRegistrationTemplate(token, e.id);
  }
  log(`Deleted ${eventTemplates.length} event registration templates`);

  const socials = await backend.getSocialLinks();
  for (const s of socials) {
    await backend.deleteSocialLink(token, s.id);
  }
  log(`Deleted ${socials.length} social links`);
}

// ---------------- Seed ----------------

async function seedSettings(backend: Backend, token: string) {
  section("Updating site settings");
  await backend.updateSettings(
    token,
    settings.logoUrl,
    settings.title_fa,
    settings.title_sv,
    settings.subtitle_fa,
    settings.subtitle_sv,
    settings.landingBackgroundUrl,
    settings.topicsBackgroundUrl,
    settings.contactIntro_fa,
    settings.contactIntro_sv
  );
  log("Site settings updated");
}

async function seedAbout(backend: Backend, token: string) {
  section("Updating About Us content");
  await backend.updateAboutContent(
    token,
    aboutContent.headerImageUrl,
    aboutContent.body_fa,
    aboutContent.body_sv
  );
  log("About content updated");
}

async function seedFormTemplate(backend: Backend, token: string): Promise<bigint> {
  section("Creating basic registration form template");
  const fields: FormFieldReturn[] = basicFormTemplate.fields.map((f, i) => field(i, f));
  const tpl = await backend.createFormTemplate(
    token,
    basicFormTemplate.name_fa,
    basicFormTemplate.name_sv,
    basicFormTemplate.description_fa,
    basicFormTemplate.description_sv,
    fields,
    1n,
    20n,
  );
  log(`Template '${basicFormTemplate.name_sv}' created (id=${tpl.id})`);
  return tpl.id;
}

async function seedTopic(
  backend: Backend,
  token: string,
  topic: SeedTopic,
  topicIndex: number,
  formTemplateId: bigint,
  eventTemplateIds: Map<string, bigint>
) {
  section(`Topic: ${topic.title_sv}`);

  const created = await backend.createTopic(
    token,
    topic.slug,
    topic.title_fa,
    topic.title_sv,
    topic.description_fa,
    topic.description_sv,
    topic.icon,
    topic.backgroundUrl,
    BigInt(topicIndex + 1)
  );
  log(`Topic created (id=${created.id})`);

  // Slides
  for (let i = 0; i < topic.slides.length; i++) {
    const s = topic.slides[i];
    await backend.createSlide(
      token,
      created.id,
      s.imageUrl,
      s.title_fa,
      s.title_sv,
      s.subtitle_fa,
      s.subtitle_sv,
      s.ctaText_fa,
      s.ctaText_sv,
      s.ctaLink,
      BigInt(i + 1)
    );
  }
  log(`  ${topic.slides.length} slides created`);

  // Events
  for (let i = 0; i < topic.events.length; i++) {
    const e = topic.events[i];
    const eventTemplateRef: bigint | null = e.eventTemplateKey
      ? eventTemplateIds.get(e.eventTemplateKey) ?? null
      : null;
    const hasReg = topic.registration === "form" || eventTemplateRef !== null;
    const regMode = eventTemplateRef !== null ? "event" : topic.registration === "form" ? "form" : "none";
    const templateRef: bigint | null = regMode === "form" ? formTemplateId : null;
    const customFields: FormFieldReturn[] = [];
    const sessions: EventSessionReturn[] = [];

    await backend.createActivity(
      token,
      created.id,
      e.slug,
      e.title_fa,
      e.title_sv,
      e.excerpt_fa,
      e.excerpt_sv,
      e.body_fa,
      e.body_sv,
      e.icon,
      e.imageUrl,
      hasReg,
      regMode,
      templateRef,
      eventTemplateRef, // eventTemplateId
      customFields,
      sessions,
      e.highlighted ?? false,
      BigInt(i + 1)
    );
  }
  log(`  ${topic.events.length} events created`);
}

async function seedEventTemplates(
  backend: Backend,
  token: string
): Promise<Map<string, bigint>> {
  section("Creating event registration templates");
  const map = new Map<string, bigint>();

  const eventTemplates = [moharramEventTemplate];
  for (const template of eventTemplates) {
    const sessions: EventSessionReturn[] = template.sessions.map((s, i) => ({
      id: BigInt(i + 1),
      sortOrder: BigInt(i + 1),
      date: s.date ?? "",
      name_fa: s.name_fa,
      name_sv: s.name_sv,
      capacity: BigInt(s.capacity),
      bufferCapacity: BigInt(s.bufferCapacity),
    }));
    const fields: FormFieldReturn[] = template.fields.map((f, i) => field(i, f));

    const tpl = await backend.createEventRegistrationTemplate(
      token,
      template.name_fa,
      template.name_sv,
      template.description_fa,
      template.description_sv,
      sessions,
      fields,
      template.perMemberMode,
      template.perMemberSessionSelection ?? false,
      BigInt(template.minMembers),
      BigInt(template.maxMembers)
    );
    log(`Template '${template.name_sv}' created (id=${tpl.id})`);
    map.set(template.key, tpl.id);
  }
  return map;
}

async function seedSocialLinks(backend: Backend, token: string) {
  section("Creating social links");
  for (let i = 0; i < socialLinks.length; i++) {
    const s = socialLinks[i];
    await backend.createSocialLink(token, s.platform, s.url, BigInt(i + 1));
  }
  log(`${socialLinks.length} social links created`);
}

// ---------------- Main ----------------

async function main() {
  const { canisterId, host, rootKey } = resolveBackendConfig();
  const agentHost = resolveAgentHost(host);
  allowRemoteTlsIfNeeded(host);
  console.log(`Backend canister: ${canisterId}`);
  console.log(`Host:             ${host}`);

  const localHost = isLocalHost(host);
  const agent = await HttpAgent.create({ host: agentHost, shouldFetchRootKey: localHost });
  if (rootKey && localHost) {
    try {
      await agent.fetchRootKey();
    } catch (e) {
      console.warn("fetchRootKey failed (continuing):", e);
    }
  }

  const backend = createActor(canisterId, { agent });

  // ---- Login ----
  const password = process.env.ADMIN_PASSWORD ?? "password";
  const hash = sha256Hex(password);
  section("Logging in as admin");
  const token = await backend.adminLogin(hash);
  if (!token) {
    throw new Error(
      "adminLogin returned null. Wrong password? Set ADMIN_PASSWORD env var."
    );
  }
  log(`Got session token: ${token.slice(0, 12)}…`);

  // ---- Wipe + Reseed ----
  await wipe(backend, token);
  await seedSettings(backend, token);
  await seedAbout(backend, token);
  const formTemplateId = await seedFormTemplate(backend, token);
  const eventTemplateIds = await seedEventTemplates(backend, token);

  for (let i = 0; i < topics.length; i++) {
    await seedTopic(backend, token, topics[i], i, formTemplateId, eventTemplateIds);
  }

  await seedSocialLinks(backend, token);

  section("Done");
  console.log(`Seeded:
  - settings + contact intro
  - about us content
  - ${topics.length} topics
  - ${topics.reduce((n, t) => n + t.slides.length, 0)} slides
  - ${topics.reduce((n, t) => n + t.events.length, 0)} events
  - 1 form template (assigned to Education/Sport/Art & Media events)
  - ${socialLinks.length} social links
`);
}

main().catch((e) => {
  console.error("\n[seed] failed:", e);
  process.exit(1);
});
