/// Site settings, mock mode and About page content.

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";

mixin (
  auth : Auth.State,
  config : T.Config,
) {



  // ─── Site Settings ────────────────────────────────────────────────────────

  public query func getSettings() : async T.SiteSettingsReturn {
    H.settingsToReturn(config.siteSettings, config.mockMode, config.contactIntroContent)
  };

  public func updateSettings(
    token : Text,
    logoUrl : Text,
    title_fa : Text,
    title_sv : Text,
    subtitle_fa : Text,
    subtitle_sv : Text,
    landingBackgroundUrl : Text,
    topicsBackgroundUrl : Text,
    contactIntro_fa : Text,
    contactIntro_sv : Text,
  ) : async T.SiteSettingsReturn {
    Auth.requireAuth(auth, token);
    config.siteSettings := {
      logoUrl;
      title = { fa = title_fa; sv = title_sv };
      subtitle = { fa = subtitle_fa; sv = subtitle_sv };
      landingBackgroundUrl;
      topicsBackgroundUrl;
    };
    config.contactIntroContent := { fa = contactIntro_fa; sv = contactIntro_sv };
    H.settingsToReturn(config.siteSettings, config.mockMode, config.contactIntroContent)
  };

  public func setMockMode(token : Text, enabled : Bool) : async Bool {
    Auth.requireAuth(auth, token);
    config.mockMode := enabled;
    true
  };
  // ─── About Us ───────────────────────────────────────────────────────────

  public query func getAboutContent() : async T.AboutContentReturn {
    H.aboutToReturn(config.aboutContent)
  };

  public func updateAboutContent(
    token : Text,
    headerImageUrl : Text,
    body_fa : Text,
    body_sv : Text,
  ) : async T.AboutContentReturn {
    Auth.requireAuth(auth, token);
    config.aboutContent := {
      headerImageUrl;
      body = { fa = body_fa; sv = body_sv };
    };
    H.aboutToReturn(config.aboutContent)
  };


};
