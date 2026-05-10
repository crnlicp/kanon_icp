/**
 * Route manifest for prerendering.
 * Queries the production canister to build the full list of URLs to visit.
 * Run: npx tsx scripts/prerender-routes.ts
 */

import { createActor } from "../src/backend/api/backend";

const CANISTER_ID = process.env.BACKEND_CANISTER_ID ?? "";
const CANONICAL_BASE = process.env.CANONICAL_BASE ?? "https://kanon.app";

const STATIC_ROUTES = [
  "/",
  "/sv/topics",
  "/fa/topics",
  "/sv/about",
  "/fa/about",
  "/sv/contact",
  "/fa/contact",
];

export async function buildRouteList(): Promise<string[]> {
  const routes: string[] = [...STATIC_ROUTES];

  if (!CANISTER_ID) {
    console.warn("BACKEND_CANISTER_ID not set — returning static routes only.");
    return routes;
  }

  const actor = createActor(CANISTER_ID as `${string}-${string}-${string}-${string}-${string}`, {
    agentOptions: { host: CANONICAL_BASE },
  });

  const topics = await actor.getTopics();
  for (const topic of topics) {
    routes.push(`/sv/topics/${topic.slug}`);
    routes.push(`/fa/topics/${topic.slug}`);
    const activities = await actor.getActivitiesByTopic(topic.id);
    for (const activity of activities) {
      routes.push(`/sv/topics/${topic.slug}/${activity.slug}`);
      routes.push(`/fa/topics/${topic.slug}/${activity.slug}`);
    }
  }

  return routes;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildRouteList().then((routes) => {
    console.log(`Found ${routes.length} routes:`);
    routes.forEach((r) => console.log("  " + CANONICAL_BASE + r));
  });
}
