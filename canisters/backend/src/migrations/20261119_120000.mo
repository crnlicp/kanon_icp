// Converts the pre-chain canister (inline initializers) to the migration chain:
// groups the scalar vars into `counters` and `config` records so mixins can
// share them, and drops the input-limit constants (now lib/Limits.mo).
// Maps are not listed and carry through unchanged.
module {
  type LocalizedText = { fa : Text; sv : Text };
  type SiteSettings = {
    landingBackgroundUrl : Text;
    logoUrl : Text;
    subtitle : LocalizedText;
    title : LocalizedText;
    topicsBackgroundUrl : Text;
  };
  type AboutContent = { body : LocalizedText; headerImageUrl : Text };
  type SeoSettings = {
    bingVerification : Text;
    canonicalBaseUrl : Text;
    defaultDescription : Text;
    defaultLang : Text;
    defaultOgImage : Text;
    defaultTitle : Text;
    googleAnalyticsId : Text;
    googleVerification : Text;
    robotsTxtExtra : Text;
    siteName : Text;
    titleTemplate : Text;
    twitterCardType : Text;
    twitterHandle : Text;
  };

  type OldActor = {
    var nextTopicId : Nat;
    var nextSlideId : Nat;
    var nextActivityId : Nat;
    var nextRegistrationId : Nat;
    var nextFormTemplateId : Nat;
    var nextEventRegTemplateId : Nat;
    var nextSocialLinkId : Nat;
    var nextContactMessageId : Nat;
    var assetCounter : Nat;
    var siteSettings : SiteSettings;
    var mockMode : Bool;
    var adminPasswordHash : Text;
    var aboutContent : AboutContent;
    var contactIntroContent : LocalizedText;
    var seoSettings : SeoSettings;
    maxAssetSize : Nat;
    maxEmailLen : Nat;
    maxFieldValueLen : Nat;
    maxFieldValues : Nat;
    maxMessageLen : Nat;
    maxNameLen : Nat;
    maxPersonCount : Nat;
    maxPhoneLen : Nat;
    maxSessions : Nat;
  };

  type NewActor = {
    counters : {
      var nextTopicId : Nat;
      var nextSlideId : Nat;
      var nextActivityId : Nat;
      var nextRegistrationId : Nat;
      var nextFormTemplateId : Nat;
      var nextEventRegTemplateId : Nat;
      var nextSocialLinkId : Nat;
      var nextContactMessageId : Nat;
      var assetCounter : Nat;
    };
    config : {
      var siteSettings : SiteSettings;
      var mockMode : Bool;
      var adminPasswordHash : Text;
      var aboutContent : AboutContent;
      var contactIntroContent : LocalizedText;
      var seoSettings : SeoSettings;
    };
  };

  public func migration(old : OldActor) : NewActor {
    {
      counters = {
        var nextTopicId = old.nextTopicId;
        var nextSlideId = old.nextSlideId;
        var nextActivityId = old.nextActivityId;
        var nextRegistrationId = old.nextRegistrationId;
        var nextFormTemplateId = old.nextFormTemplateId;
        var nextEventRegTemplateId = old.nextEventRegTemplateId;
        var nextSocialLinkId = old.nextSocialLinkId;
        var nextContactMessageId = old.nextContactMessageId;
        var assetCounter = old.assetCounter;
      };
      config = {
        var siteSettings = old.siteSettings;
        var mockMode = old.mockMode;
        var adminPasswordHash = old.adminPasswordHash;
        var aboutContent = old.aboutContent;
        var contactIntroContent = old.contactIntroContent;
        var seoSettings = old.seoSettings;
      };
    };
  };
};
