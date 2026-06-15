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

  // ─── Form Builder Types ───────────────────────────────────────────────────

  public type FormFieldType = {
    #text;
    #textarea;
    #email;
    #phone;
    #number;
    #select;
    #radio;
    #checkbox;
    #date;
  };

  public type FormField = {
    id : Nat;
    fieldType : FormFieldType;
    fieldLabel : LocalizedText;
    placeholder : LocalizedText;
    required : Bool;
    options : [LocalizedText]; // For select/radio/checkbox
    sortOrder : Nat;
    isLookupField : Bool;      // One field per form used to verify registration lookup
    minValue : ?Int;           // For number fields: optional minimum
    maxValue : ?Int;           // For number fields: optional maximum
  };

  public type FormTemplate = {
    id : Nat;
    name : LocalizedText;
    description : LocalizedText;
    fields : [FormField];
    createdAt : Int;
  };

  // ─── Event Registration Template ─────────────────────────────────────────

  public type EventRegistrationTemplate = {
    id          : Nat;
    name        : LocalizedText;
    description : LocalizedText;
    sessions    : [EventSession];
    fields      : [FormField];
    createdAt   : Int;
  };

  // ─── Event Session Types ──────────────────────────────────────────────────

  public type EventSession = {
    id             : Nat;
    name           : LocalizedText;
    date           : Text;           // ISO date string or ""
    capacity       : Nat;            // regular public capacity
    bufferCapacity : Nat;            // admin buffer (0 = none)
    sortOrder      : Nat;
  };

  // ─── Registration Rules ───────────────────────────────────────────────────

  public type RegistrationRules = {
    maxCapacity              : ?Nat;   // null = unlimited total registrations
    allowedPhones            : [Text]; // empty = open to all
    maxRegistrationsPerPhone : ?Nat;   // null = unlimited; 1 = one per phone
    blockDuplicateEmail      : Bool;
  };

  // ─── Activity ─────────────────────────────────────────────────────────────

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
    registrationMode : Text;   // "none" | "form" | "event"
    formTemplateId : ?Nat;
    eventTemplateId : ?Nat;
    customFormFields : [FormField];
    sessions : [EventSession];
    registrationRules : ?RegistrationRules;
    highlighted : ?Bool;       // optional for backward-compatible upgrades
    sortOrder : Nat;
    createdAt : Int;
  };

  // ─── Registration Types ───────────────────────────────────────────────────

  public type RegistrationFieldValue = {
    fieldId : Nat;
    fieldLabel : Text;
    value : Text;
  };

  public type RegistrationSessionSnapshot = {
    sessionId   : Nat;
    sessionName : Text;  // snapshot of name at submission time
  };

  public type Registration = {
    id : Nat;
    activityId : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    personCount : Nat;
    selectedSessions : [RegistrationSessionSnapshot];
    fieldValues : [RegistrationFieldValue];
    createdAt : Int;
    archived : ?Bool;       // optional for backward-compatible upgrades
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

  public type FormFieldReturn = {
    id : Nat;
    fieldType : Text; // "text", "textarea", "email", "phone", "number", "select", "radio", "checkbox", "date"
    label_fa : Text;
    label_sv : Text;
    placeholder_fa : Text;
    placeholder_sv : Text;
    required : Bool;
    options : [{ fa : Text; sv : Text }];
    sortOrder : Nat;
    isLookupField : Bool;
    minValue : ?Int;
    maxValue : ?Int;
  };

  public type FormTemplateReturn = {
    id : Nat;
    name_fa : Text;
    name_sv : Text;
    description_fa : Text;
    description_sv : Text;
    fields : [FormFieldReturn];
    createdAt : Int;
  };

  public type EventRegistrationTemplateReturn = {
    id             : Nat;
    name_fa        : Text;
    name_sv        : Text;
    description_fa : Text;
    description_sv : Text;
    sessions       : [EventSessionReturn];
    fields         : [FormFieldReturn];
    createdAt      : Int;
  };

  public type EventSessionReturn = {
    id             : Nat;
    name_fa        : Text;
    name_sv        : Text;
    date           : Text;
    capacity       : Nat;
    bufferCapacity : Nat;
    sortOrder      : Nat;
  };

  // Public availability — buffer exposed so users understand the two tiers
  public type SessionAvailabilityReturn = {
    sessionId        : Nat;
    name_fa          : Text;
    name_sv          : Text;
    date             : Text;
    capacity         : Nat;          // regular limit
    bufferCapacity   : Nat;          // buffer limit
    confirmedCount   : Nat;          // people with confirmed status
    bufferCount      : Nat;          // people in buffer
    regularFull      : Bool;         // confirmedCount >= capacity
    totalFull        : Bool;         // confirmedCount + bufferCount >= capacity + bufferCapacity
    sortOrder        : Nat;
  };

  // Admin stats — full detail including buffer usage
  public type SessionStatsReturn = {
    sessionId         : Nat;
    name_fa           : Text;
    name_sv           : Text;
    date              : Text;
    capacity          : Nat;
    bufferCapacity    : Nat;
    confirmedCount    : Nat;
    bufferCount       : Nat;
    registrationCount : Nat;         // number of registration records
    sortOrder         : Nat;
  };

  // Per-session status in registration result — computed dynamically, never stored
  public type SessionStatusReturn = {
    sessionId   : Nat;
    sessionName : Text;
    status      : Text;  // "confirmed" or "buffer"
  };

  // Registration return with computed session statuses
  public type RegistrationWithStatusReturn = {
    id               : Nat;
    activityId       : Nat;
    name             : Text;
    email            : Text;
    phone            : Text;
    message          : Text;
    personCount      : Nat;
    selectedSessions : [SessionStatusReturn];
    fieldValues      : [{ fieldId : Nat; fieldLabel : Text; value : Text }];
    createdAt        : Int;
    archived         : Bool;
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
    registrationMode : Text;
    formTemplateId : ?Nat;
    eventTemplateId : ?Nat;
    customFormFields : [FormFieldReturn];
    sessions : [EventSessionReturn];
    regMaxCapacity : ?Nat;
    regAllowedPhones : [Text];
    regMaxRegistrationsPerPhone : ?Nat;
    regBlockDuplicateEmail : Bool;
    highlighted : Bool;
    sortOrder : Nat;
    createdAt : Int;
  };

  public type RegistrationFieldValueReturn = {
    fieldId : Nat;
    fieldLabel : Text;
    value : Text;
  };

  // Legacy return type kept for getAllRegistrations / getRegistrations (admin)
  public type RegistrationReturn = {
    id : Nat;
    activityId : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    personCount : Nat;
    selectedSessions : [{ sessionId : Nat; sessionName : Text }];
    fieldValues : [RegistrationFieldValueReturn];
    createdAt : Int;
    archived : Bool;
  };

  public type SubmitRegistrationResult = {
    #ok                   : RegistrationWithStatusReturn;
    #capacityFull;
    #phoneNotAllowed;
    #maxRegistrationsReached;
    #duplicateEmail;
    #registrationDisabled;
    #invalidInput;
    #sessionsUnavailable  : [Nat];  // session IDs that are totally full
  };

  public type SiteSettingsReturn = {
    logoUrl : Text;
    title_fa : Text;
    title_sv : Text;
    subtitle_fa : Text;
    subtitle_sv : Text;
    landingBackgroundUrl : Text;
    topicsBackgroundUrl : Text;
    contactIntro_fa : Text;
    contactIntro_sv : Text;
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

  // ─── SEO Types ───────────────────────────────────────────────────────────────

  public type SeoSettings = {
    siteName : Text;
    titleTemplate : Text;      // e.g. "{page_title} | {site_name}"
    defaultTitle : Text;
    defaultDescription : Text;
    defaultOgImage : Text;     // full URL
    twitterHandle : Text;      // @handle
    twitterCardType : Text;    // "summary_large_image" | "summary"
    googleVerification : Text;
    bingVerification : Text;
    canonicalBaseUrl : Text;   // e.g. "https://kanon.app"
    defaultLang : Text;        // "sv" or "fa"
    googleAnalyticsId : Text;  // "G-XXXXXXXXXX" or ""
    robotsTxtExtra : Text;     // admin-editable extra disallow rules, newline-separated
  };

  public type PageSeoOverride = {
    slug : Text;              // matches route, e.g. "sv/topics/musik/piano"
    title : Text;             // "" = use global template
    description : Text;       // "" = use default
    ogImage : Text;           // "" = use default
    canonicalUrl : Text;      // "" = auto-generate
    noIndex : Bool;
    noFollow : Bool;
    jsonLd : Text;            // raw JSON-LD string, "" if none
    sitemapInclude : Bool;
    sitemapPriority : Text;   // "0.5", "0.8", etc.
    sitemapChangefreq : Text; // "weekly", "monthly", etc.
    lastModified : Text;      // ISO date string
  };
}
