import type { SeoSettings } from "../backend/api/backend";

interface ActivityLike {
  title_fa: string;
  title_sv: string;
  body_fa?: string;
  body_sv?: string;
  imageUrl?: string;
  sessions?: Array<{ date?: string; name_fa: string; name_sv: string }>;
}

interface TopicLike {
  title_fa: string;
  title_sv: string;
}

function localized(fa: string, sv: string, lang: string) {
  return lang === "fa" ? fa : sv;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function websiteSchema(settings: SeoSettings): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: settings.canonicalBaseUrl,
    inLanguage: ["sv", "fa"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${settings.canonicalBaseUrl}/sv/topics`,
    },
  };
}

export function organizationSchema(settings: SeoSettings): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: settings.canonicalBaseUrl,
    logo: settings.defaultOgImage || undefined,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(
  activity: ActivityLike,
  url: string,
  lang: string,
  baseUrl: string
): object {
  const title = localized(activity.title_fa, activity.title_sv, lang);
  const body = localized(activity.body_fa ?? "", activity.body_sv ?? "", lang);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: stripHtml(body).slice(0, 160),
    image: activity.imageUrl || undefined,
    url,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: "Kanon",
      url: baseUrl,
    },
  };
}

export function eventSchema(
  activity: ActivityLike,
  url: string,
  lang: string,
  baseUrl: string
): object {
  const title = localized(activity.title_fa, activity.title_sv, lang);
  const body = localized(activity.body_fa ?? "", activity.body_sv ?? "", lang);
  const firstSession = activity.sessions?.[0];
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description: stripHtml(body).slice(0, 160),
    image: activity.imageUrl || undefined,
    url,
    inLanguage: lang,
    startDate: firstSession?.date || undefined,
    organizer: {
      "@type": "Organization",
      name: "Kanon",
      url: baseUrl,
    },
  };
}

export function topicBreadcrumb(
  topicName: string,
  topicUrl: string,
  topicsLabel: string,
  topicsUrl: string
): object {
  return breadcrumbSchema([
    { name: topicsLabel, url: topicsUrl },
    { name: topicName, url: topicUrl },
  ]);
}

export function activityBreadcrumb(
  topicsLabel: string,
  topicsUrl: string,
  topicName: string,
  topicUrl: string,
  activityName: string,
  activityUrl: string
): object {
  return breadcrumbSchema([
    { name: topicsLabel, url: topicsUrl },
    { name: topicName, url: topicUrl },
    { name: activityName, url: activityUrl },
  ]);
}

export function topicSchema(topic: TopicLike, url: string, lang: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: localized(topic.title_fa, topic.title_sv, lang),
    url,
    inLanguage: lang,
  };
}
