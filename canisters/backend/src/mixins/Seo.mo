/// SEO settings, page overrides, robots.txt, sitemap and the HTTP gateway.
import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

import T "../types";
import Auth "../lib/Auth";

mixin (
  auth : Auth.State,
  config : T.Config,
  topics : Map.Map<Nat, T.Topic>,
  activities : Map.Map<Nat, T.Activity>,
  pageOverrides : Map.Map<Text, T.PageSeoOverride>,
) {



  // ─── SEO helpers ──────────────────────────────────────────────────────────

  func textStartsWith(text : Text, prefix : Text) : Bool {
    let ti = text.chars();
    for (pc in prefix.chars()) {
      switch (ti.next()) {
        case (?tc) { if (tc != pc) return false };
        case null { return false };
      };
    };
    true
  };

  // Convert nanosecond IC timestamp to ISO-8601 date string (YYYY-MM-DD).
  // Uses the civil-date algorithm from howardhinnant.github.io/date_algorithms.html.
  func nowToIsoDate() : Text {
    let ns : Int = Time.now();
    let totalDays : Int = ns / 1_000_000_000 / 86_400;
    let z : Int = totalDays + 719_468;
    let era : Int = if (z >= 0) { z / 146_097 } else { (z - 146_096) / 146_097 };
    let doe : Int = z - era * 146_097;
    let yoe : Int = (doe - doe / 1_460 + doe / 36_524 - doe / 146_096) / 365;
    let y : Int = yoe + era * 400;
    let doy : Int = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp : Int = (5 * doy + 2) / 153;
    let d : Int = doy - (153 * mp + 2) / 5 + 1;
    let m : Int = mp + (if (mp < 10) { 3 } else { -9 });
    let year : Int = y + (if (m <= 2) { 1 } else { 0 });
    let pad2 = func(n : Int) : Text {
      if (n < 10) { "0" # Int.toText(n) } else { Int.toText(n) }
    };
    Int.toText(year) # "-" # pad2(m) # "-" # pad2(d)
  };

  func makeSitemapUrlEntry(
    loc : Text,
    slug : Text,
    defaultPriority : Text,
    today : Text,
  ) : Text {
    let ov = Map.get(pageOverrides, Text.compare, slug);
    let shouldInclude = switch (ov) {
      case (?o) { o.sitemapInclude and not o.noIndex };
      case null { true };
    };
    if (not shouldInclude) { return "" };
    let priority = switch (ov) {
      case (?o) { if (o.sitemapPriority != "") o.sitemapPriority else defaultPriority };
      case null { defaultPriority };
    };
    let changefreq = switch (ov) {
      case (?o) { if (o.sitemapChangefreq != "") o.sitemapChangefreq else "weekly" };
      case null { "weekly" };
    };
    let lastmod = switch (ov) {
      case (?o) { if (o.lastModified != "") o.lastModified else today };
      case null { today };
    };
    "  <url>\n" #
    "    <loc>" # loc # "</loc>\n" #
    "    <lastmod>" # lastmod # "</lastmod>\n" #
    "    <changefreq>" # changefreq # "</changefreq>\n" #
    "    <priority>" # priority # "</priority>\n" #
    "  </url>\n"
  };

  func assembleRobotsTxt() : Text {
    var txt = "User-agent: *\n";
    txt #= "Disallow: /admin\n";
    txt #= "Disallow: /admin/*\n";
    if (config.seoSettings.robotsTxtExtra != "") {
      txt #= config.seoSettings.robotsTxtExtra # "\n";
    };
    txt #= "Sitemap: " # config.seoSettings.canonicalBaseUrl # "/sitemap.xml\n";
    txt
  };

  func assembleSitemapXml() : Text {
    let baseUrl = config.seoSettings.canonicalBaseUrl;
    let today = nowToIsoDate();
    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    xml #= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    for (lang in ["sv", "fa"].values()) {
      xml #= makeSitemapUrlEntry(baseUrl # "/" # lang # "/topics", lang # "/topics", "0.8", today);
      xml #= makeSitemapUrlEntry(baseUrl # "/" # lang # "/about", lang # "/about", "0.5", today);
      xml #= makeSitemapUrlEntry(baseUrl # "/" # lang # "/contact", lang # "/contact", "0.5", today);
      for ((_, topic) in Map.entries(topics)) {
        let topicPath = lang # "/topics/" # topic.slug;
        xml #= makeSitemapUrlEntry(baseUrl # "/" # topicPath, topicPath, "0.7", today);
        for ((_, activity) in Map.entries(activities)) {
          if (activity.topicId == topic.id) {
            let actPath = lang # "/topics/" # topic.slug # "/" # activity.slug;
            xml #= makeSitemapUrlEntry(baseUrl # "/" # actPath, actPath, "0.6", today);
          };
        };
      };
    };
    xml #= "</urlset>";
    xml
  };

  // ─── SEO API ──────────────────────────────────────────────────────────────

  public query func getSeoSettings() : async T.SeoSettings {
    config.seoSettings
  };

  public func updateSeoSettings(token : Text, settings : T.SeoSettings) : async () {
    Auth.requireAuth(auth, token);
    config.seoSettings := settings;
  };

  public query func getPageSeoOverride(slug : Text) : async ?T.PageSeoOverride {
    Map.get(pageOverrides, Text.compare, slug)
  };

  public func setPageSeoOverride(token : Text, override : T.PageSeoOverride) : async () {
    Auth.requireAuth(auth, token);
    Map.add(pageOverrides, Text.compare, override.slug, override);
  };

  public func deletePageSeoOverride(token : Text, slug : Text) : async () {
    Auth.requireAuth(auth, token);
    ignore Map.delete(pageOverrides, Text.compare, slug);
  };

  public query func listPageSeoOverrides(token : Text) : async [T.PageSeoOverride] {
    Auth.requireAuth(auth, token);
    Iter.toArray(
      Iter.map<(Text, T.PageSeoOverride), T.PageSeoOverride>(
        Map.entries(pageOverrides),
        func((_, o)) { o },
      )
    )
  };

  public query func getRobotsTxt() : async Text {
    assembleRobotsTxt()
  };

  public query func getSitemapXml() : async Text {
    assembleSitemapXml()
  };

  // ─── HTTP Gateway ─────────────────────────────────────────────────────────

  public query func http_request(req : T.HttpRequest) : async T.HttpResponse {
    if (req.url == "/robots.txt" or textStartsWith(req.url, "/robots.txt?")) {
      {
        status_code = 200;
        headers = [("Content-Type", "text/plain; charset=utf-8")];
        body = Text.encodeUtf8(assembleRobotsTxt());
        streaming_strategy = null;
      }
    } else if (req.url == "/sitemap.xml" or textStartsWith(req.url, "/sitemap.xml?")) {
      {
        status_code = 200;
        headers = [("Content-Type", "application/xml; charset=utf-8")];
        body = Text.encodeUtf8(assembleSitemapXml());
        streaming_strategy = null;
      }
    } else {
      {
        status_code = 404;
        headers = [("Content-Type", "text/plain")];
        body = Text.encodeUtf8("Not found");
        streaming_strategy = null;
      }
    }
  };

};
