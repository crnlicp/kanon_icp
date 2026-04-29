/// Shared domain types for the Kanon canister.
module {

  // ─── Domain Types ─────────────────────────────────────────────────────────

  public type LocalizedText = {
    fa : Text;
    sv : Text;
  };

  public type Topic = {
    id : Nat;
    slug : Text;
    title : LocalizedText;
    description : LocalizedText;
    icon : Text;
    backgroundUrl : Text;
    sortOrder : Nat;
    createdAt : Int;
  };

  public type HeroSlide = {
    id : Nat;
    topicId : Nat;
    imageUrl : Text;
    title : LocalizedText;
    subtitle : LocalizedText;
    ctaText : LocalizedText;
    ctaLink : Text;
    sortOrder : Nat;
  };

  public type Activity = {
    id : Nat;
    topicId : Nat;
    slug : Text;
    title : LocalizedText;
    excerpt : LocalizedText;
    body : LocalizedText;
    icon : Text;
    imageUrl : Text;
    hasRegistration : Bool;
    sortOrder : Nat;
    createdAt : Int;
  };

  public type Registration = {
    id : Nat;
    activityId : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
  };

  public type SiteSettings = {
    logoUrl : Text;
    title : LocalizedText;
    subtitle : LocalizedText;
    landingBackgroundUrl : Text;
    topicsBackgroundUrl : Text;
  };

  public type SocialLink = {
    id : Nat;
    platform : Text;
    url : Text;
    sortOrder : Nat;
  };

  public type AboutContent = {
    headerImageUrl : Text;
    body : LocalizedText;
  };

  public type ContactMessage = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
  };

  // ─── Candid Return Types ──────────────────────────────────────────────────
  // Flat structs expose localized fields without nested records.

  public type TopicReturn = {
    id : Nat;
    slug : Text;
    title_fa : Text;
    title_sv : Text;
    description_fa : Text;
    description_sv : Text;
    icon : Text;
    backgroundUrl : Text;
    sortOrder : Nat;
    createdAt : Int;
  };

  public type HeroSlideReturn = {
    id : Nat;
    topicId : Nat;
    imageUrl : Text;
    title_fa : Text;
    title_sv : Text;
    subtitle_fa : Text;
    subtitle_sv : Text;
    ctaText_fa : Text;
    ctaText_sv : Text;
    ctaLink : Text;
    sortOrder : Nat;
  };

  public type ActivityReturn = {
    id : Nat;
    topicId : Nat;
    slug : Text;
    title_fa : Text;
    title_sv : Text;
    excerpt_fa : Text;
    excerpt_sv : Text;
    body_fa : Text;
    body_sv : Text;
    icon : Text;
    imageUrl : Text;
    hasRegistration : Bool;
    sortOrder : Nat;
    createdAt : Int;
  };

  public type RegistrationReturn = {
    id : Nat;
    activityId : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
  };

  public type SiteSettingsReturn = {
    logoUrl : Text;
    title_fa : Text;
    title_sv : Text;
    subtitle_fa : Text;
    subtitle_sv : Text;
    landingBackgroundUrl : Text;
    topicsBackgroundUrl : Text;
    mockMode : Bool;
  };

  public type SocialLinkReturn = {
    id : Nat;
    platform : Text;
    url : Text;
    sortOrder : Nat;
  };

  public type AboutContentReturn = {
    headerImageUrl : Text;
    body_fa : Text;
    body_sv : Text;
  };

  public type ContactMessageReturn = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    createdAt : Int;
  };
}
