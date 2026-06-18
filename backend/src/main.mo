import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Blob "mo:core/Blob";

import T "./Types";
import H "./Helpers";

persistent actor {

  // ─── Type aliases ─────────────────────────────────────────────────────────

  type Topic = T.Topic;
  type HeroSlide = T.HeroSlide;
  type Activity = T.Activity;
  type Registration = T.Registration;
  type SiteSettings = T.SiteSettings;
  type SocialLink = T.SocialLink;
  type FormField = T.FormField;
  type FormTemplate = T.FormTemplate;
  type EventRegistrationTemplate = T.EventRegistrationTemplate;
  type EventSession = T.EventSession;
  type TopicReturn = T.TopicReturn;
  type HeroSlideReturn = T.HeroSlideReturn;
  type ActivityReturn = T.ActivityReturn;
  type RegistrationReturn = T.RegistrationReturn;
  type RegistrationWithStatusReturn = T.RegistrationWithStatusReturn;
  type SubmitRegistrationResult = T.SubmitRegistrationResult;
  type SiteSettingsReturn = T.SiteSettingsReturn;
  type SocialLinkReturn = T.SocialLinkReturn;
  type FormFieldReturn = T.FormFieldReturn;
  type FormTemplateReturn = T.FormTemplateReturn;
  type EventRegistrationTemplateReturn = T.EventRegistrationTemplateReturn;
  type EventSessionReturn = T.EventSessionReturn;
  type SessionAvailabilityReturn = T.SessionAvailabilityReturn;
  type SessionStatsReturn = T.SessionStatsReturn;
  type AboutContent = T.AboutContent;
  type AboutContentReturn = T.AboutContentReturn;
  type ContactMessage = T.ContactMessage;
  type ContactMessageReturn = T.ContactMessageReturn;
  type SeoSettings = T.SeoSettings;
  type PageSeoOverride = T.PageSeoOverride;

  // IC HTTP gateway types
  type HttpToken = {};
  type StreamingCallbackResponse = { body : Blob; token : ?HttpToken };
  type StreamingStrategy = {
    #Callback : {
      callback : shared query HttpToken -> async StreamingCallbackResponse;
      token : HttpToken;
    };
  };
  type HttpRequest = {
    method : Text;
    url : Text;
    headers : [(Text, Text)];
    body : Blob;
  };
  type HttpResponse = {
    status_code : Nat16;
    headers : [(Text, Text)];
    body : Blob;
    streaming_strategy : ?StreamingStrategy;
  };

  // ─── State ────────────────────────────────────────────────────────────────

  let topics = Map.empty<Nat, Topic>();
  var nextTopicId : Nat = 1;

  let heroSlides = Map.empty<Nat, HeroSlide>();
  var nextSlideId : Nat = 1;

  let activities = Map.empty<Nat, Activity>();
  var nextActivityId : Nat = 1;

  let registrations = Map.empty<Nat, Registration>();
  var nextRegistrationId : Nat = 1;

  let formTemplates = Map.empty<Nat, FormTemplate>();
  var nextFormTemplateId : Nat = 1;

  let eventRegTemplates = Map.empty<Nat, EventRegistrationTemplate>();
  var nextEventRegTemplateId : Nat = 1;

  let socialLinks = Map.empty<Nat, SocialLink>();
  var nextSocialLinkId : Nat = 1;

  var siteSettings : SiteSettings = {
    logoUrl = "";
    title = { fa = "کانون"; sv = "Kanon" };
    subtitle = { fa = "فرهنگی، آموزشی و ورزشی"; sv = "Kultur, utbildning och sport" };
    landingBackgroundUrl = "";
    topicsBackgroundUrl = "";
  };

  // Mock mode flag (separate from SiteSettings to preserve upgrade compatibility)
  var mockMode : Bool = false;

  // Admin password hash (SHA-256 hex). Default: "password"
  var adminPasswordHash : Text = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

  // About Us content
  var aboutContent : AboutContent = {
    headerImageUrl = "";
    body = { fa = ""; sv = "" };
  };

  // Contact page intro (HTML, localized) — separate var to keep SiteSettings upgrade-safe
  var contactIntroContent : T.LocalizedText = { fa = ""; sv = "" };

  // Contact form messages
  let contactMessages = Map.empty<Nat, ContactMessage>();
  var nextContactMessageId : Nat = 1;

  // Sessions: token → expiry timestamp (nanoseconds).
  // Transient so all sessions are invalidated on canister upgrade.
  transient let sessions = Map.empty<Text, Int>();
  transient var sessionCounter : Nat = 0;

  // Asset storage
  let assets = Map.empty<Text, Blob>();
  var assetCounter : Nat = 0;

  // ─── SEO State ────────────────────────────────────────────────────────────

  var seoSettings : SeoSettings = {
    siteName = "Kanon";
    titleTemplate = "{page_title} | {site_name}";
    defaultTitle = "Kanon - Kultur, utbildning och sport";
    defaultDescription = "Kanon - en webbplats för kultur, utbildning och sport";
    defaultOgImage = "";
    twitterHandle = "";
    twitterCardType = "summary_large_image";
    googleVerification = "";
    bingVerification = "";
    canonicalBaseUrl = "https://kanon.app";
    defaultLang = "sv";
    googleAnalyticsId = "";
    robotsTxtExtra = "";
  };

  let pageOverrides = Map.empty<Text, PageSeoOverride>();

  // ─── Auth helpers ─────────────────────────────────────────────────────────

  func generateToken(time : Int) : Text {
    sessionCounter += 1;
    "sk-" # Int.toText(time) # "-" # Nat.toText(sessionCounter)
  };

  func isValidSession(token : Text) : Bool {
    switch (Map.get(sessions, Text.compare, token)) {
      case (?expiry) { Time.now() < expiry };
      case null { false };
    }
  };

  func requireAuth(token : Text) {
    if (not isValidSession(token)) {
      Runtime.trap("Unauthorized: invalid or expired session");
    };
  };

  // ─── Auth API ─────────────────────────────────────────────────────────────

  public func adminLogin(passwordHash : Text) : async ?Text {
    if (passwordHash == adminPasswordHash) {
      let token = generateToken(Time.now());
      let expiry = Time.now() + 86_400_000_000_000; // 24 hours
      Map.add(sessions, Text.compare, token, expiry);
      ?token
    } else {
      null
    }
  };

  public func adminLogout(token : Text) : async () {
    ignore Map.delete(sessions, Text.compare, token);
  };

  public query func checkSession(token : Text) : async Bool {
    isValidSession(token)
  };

  public func changePassword(token : Text, newPasswordHash : Text) : async Bool {
    requireAuth(token);
    adminPasswordHash := newPasswordHash;
    true
  };

  // ─── Site Settings ────────────────────────────────────────────────────────

  public query func getSettings() : async SiteSettingsReturn {
    H.settingsToReturn(siteSettings, mockMode, contactIntroContent)
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
  ) : async SiteSettingsReturn {
    requireAuth(token);
    siteSettings := {
      logoUrl;
      title = { fa = title_fa; sv = title_sv };
      subtitle = { fa = subtitle_fa; sv = subtitle_sv };
      landingBackgroundUrl;
      topicsBackgroundUrl;
    };
    contactIntroContent := { fa = contactIntro_fa; sv = contactIntro_sv };
    H.settingsToReturn(siteSettings, mockMode, contactIntroContent)
  };

  public func setMockMode(token : Text, enabled : Bool) : async Bool {
    requireAuth(token);
    mockMode := enabled;
    true
  };

  // ─── Topics CRUD ──────────────────────────────────────────────────────────

  public query func getTopics() : async [TopicReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, Topic), TopicReturn>(
        Map.entries(topics),
        func ((_, t)) { H.topicToReturn(t) }
      )
    );
    Array.sort(arr, func (a : TopicReturn, b : TopicReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public query func getTopic(id : Nat) : async ?TopicReturn {
    switch (Map.get(topics, Nat.compare, id)) {
      case (?t) { ?H.topicToReturn(t) };
      case null { null };
    }
  };

  public query func getTopicBySlug(slug : Text) : async ?TopicReturn {
    for ((_, t) in Map.entries(topics)) {
      if (t.slug == slug) {
        return ?H.topicToReturn(t);
      };
    };
    null
  };

  public func createTopic(
    token : Text,
    slug : Text,
    title_fa : Text,
    title_sv : Text,
    description_fa : Text,
    description_sv : Text,
    icon : Text,
    backgroundUrl : Text,
    sortOrder : Nat,
  ) : async TopicReturn {
    requireAuth(token);
    let id = nextTopicId;
    nextTopicId += 1;
    let topic : Topic = {
      id;
      slug;
      title = { fa = title_fa; sv = title_sv };
      description = { fa = description_fa; sv = description_sv };
      icon;
      backgroundUrl;
      sortOrder;
      createdAt = Time.now();
    };
    Map.add(topics, Nat.compare, id, topic);
    H.topicToReturn(topic)
  };

  public func updateTopic(
    token : Text,
    id : Nat,
    slug : Text,
    title_fa : Text,
    title_sv : Text,
    description_fa : Text,
    description_sv : Text,
    icon : Text,
    backgroundUrl : Text,
    sortOrder : Nat,
  ) : async ?TopicReturn {
    requireAuth(token);
    switch (Map.get(topics, Nat.compare, id)) {
      case (?existing) {
        let updated : Topic = {
          id;
          slug;
          title = { fa = title_fa; sv = title_sv };
          description = { fa = description_fa; sv = description_sv };
          icon;
          backgroundUrl;
          sortOrder;
          createdAt = existing.createdAt;
        };
        Map.add(topics, Nat.compare, id, updated);
        ?H.topicToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteTopic(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(topics, Nat.compare, id)) {
      case (?_) {
        ignore Map.delete(topics, Nat.compare, id);
        for ((sid, s) in Map.entries(heroSlides)) {
          if (s.topicId == id) { ignore Map.delete(heroSlides, Nat.compare, sid) };
        };
        for ((aid, a) in Map.entries(activities)) {
          if (a.topicId == id) { ignore Map.delete(activities, Nat.compare, aid) };
        };
        true
      };
      case null { false };
    }
  };

  // ─── Hero Slides CRUD ─────────────────────────────────────────────────────

  public query func getSlidesByTopic(topicId : Nat) : async [HeroSlideReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, HeroSlide), HeroSlideReturn>(
        Iter.filter<(Nat, HeroSlide)>(
          Map.entries(heroSlides),
          func ((_, s)) { s.topicId == topicId }
        ),
        func ((_, s)) { H.slideToReturn(s) }
      )
    );
    Array.sort(arr, func (a : HeroSlideReturn, b : HeroSlideReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public func createSlide(
    token : Text,
    topicId : Nat,
    imageUrl : Text,
    title_fa : Text,
    title_sv : Text,
    subtitle_fa : Text,
    subtitle_sv : Text,
    ctaText_fa : Text,
    ctaText_sv : Text,
    ctaLink : Text,
    sortOrder : Nat,
  ) : async HeroSlideReturn {
    requireAuth(token);
    let id = nextSlideId;
    nextSlideId += 1;
    let slide : HeroSlide = {
      id;
      topicId;
      imageUrl;
      title = { fa = title_fa; sv = title_sv };
      subtitle = { fa = subtitle_fa; sv = subtitle_sv };
      ctaText = { fa = ctaText_fa; sv = ctaText_sv };
      ctaLink;
      sortOrder;
    };
    Map.add(heroSlides, Nat.compare, id, slide);
    H.slideToReturn(slide)
  };

  public func updateSlide(
    token : Text,
    id : Nat,
    topicId : Nat,
    imageUrl : Text,
    title_fa : Text,
    title_sv : Text,
    subtitle_fa : Text,
    subtitle_sv : Text,
    ctaText_fa : Text,
    ctaText_sv : Text,
    ctaLink : Text,
    sortOrder : Nat,
  ) : async ?HeroSlideReturn {
    requireAuth(token);
    switch (Map.get(heroSlides, Nat.compare, id)) {
      case (?_) {
        let updated : HeroSlide = {
          id;
          topicId;
          imageUrl;
          title = { fa = title_fa; sv = title_sv };
          subtitle = { fa = subtitle_fa; sv = subtitle_sv };
          ctaText = { fa = ctaText_fa; sv = ctaText_sv };
          ctaLink;
          sortOrder;
        };
        Map.add(heroSlides, Nat.compare, id, updated);
        ?H.slideToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteSlide(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(heroSlides, Nat.compare, id)) {
      case (?_) { ignore Map.delete(heroSlides, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── Activity helpers ─────────────────────────────────────────────────────

  func buildSessions(raw : [EventSessionReturn]) : [EventSession] {
    Array.map<EventSessionReturn, EventSession>(raw, func (s) {
      {
        id             = s.id;
        name           = { fa = s.name_fa; sv = s.name_sv };
        date           = s.date;
        capacity       = s.capacity;
        bufferCapacity = s.bufferCapacity;
        sortOrder      = s.sortOrder;
      }
    })
  };

  func buildFormFields(raw : [FormFieldReturn]) : [FormField] {
    Array.map<FormFieldReturn, FormField>(raw, func (f) {
      {
        id = f.id;
        fieldType = H.textToFieldType(f.fieldType);
        fieldLabel = { fa = f.label_fa; sv = f.label_sv };
        placeholder = { fa = f.placeholder_fa; sv = f.placeholder_sv };
        required = f.required;
        options = Array.map<{ fa : Text; sv : Text }, T.LocalizedText>(
          f.options, func (o) { { fa = o.fa; sv = o.sv } }
        );
        sortOrder = f.sortOrder;
        isLookupField = f.isLookupField;
        minValue = f.minValue;
        maxValue = f.maxValue;
        perMember = ?f.perMember;
        excludeFromCapacityWhenChecked = ?f.excludeFromCapacityWhenChecked;
        unique = ?f.unique;
        allowedValues = ?f.allowedValues;
      }
    })
  };

  // True if the activity has any non-archived registrations.
  // Used to decide whether it is safe to re-sync template sessions onto it.
  func activityHasLiveRegistrations(activityId : Nat) : Bool {
    for ((_, r) in Map.entries(registrations)) {
      if (r.activityId == activityId) {
        let isArchived = switch (r.archived) { case (?b) b; case null false };
        if (not isArchived) { return true };
      };
    };
    false
  };

  // Count non-archived registrations for an activity.
  func liveRegistrationCount(activityId : Nat) : Nat {
    var n : Nat = 0;
    for ((_, r) in Map.entries(registrations)) {
      if (r.activityId == activityId) {
        let isArchived = switch (r.archived) { case (?b) b; case null false };
        if (not isArchived) { n += 1 };
      };
    };
    n
  };

  // ─── Activities CRUD ──────────────────────────────────────────────────────

  public query func getActivitiesByTopic(topicId : Nat) : async [ActivityReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, Activity), ActivityReturn>(
        Iter.filter<(Nat, Activity)>(
          Map.entries(activities),
          func ((_, a)) { a.topicId == topicId }
        ),
        func ((_, a)) { H.activityToReturn(a) }
      )
    );
    Array.sort(arr, func (a : ActivityReturn, b : ActivityReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public query func getActivityBySlug(topicId : Nat, slug : Text) : async ?ActivityReturn {
    for ((_, a) in Map.entries(activities)) {
      if (a.topicId == topicId and a.slug == slug) {
        return ?H.activityToReturn(a);
      };
    };
    null
  };

  public query func getActivity(id : Nat) : async ?ActivityReturn {
    switch (Map.get(activities, Nat.compare, id)) {
      case (?a) { ?H.activityToReturn(a) };
      case null { null };
    }
  };

  public query func getAllActivities() : async [ActivityReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, Activity), ActivityReturn>(
        Map.entries(activities),
        func ((_, a)) { H.activityToReturn(a) }
      )
    );
    Array.sort(arr, func (a : ActivityReturn, b : ActivityReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public func createActivity(
    token : Text,
    topicId : Nat,
    slug : Text,
    title_fa : Text,
    title_sv : Text,
    excerpt_fa : Text,
    excerpt_sv : Text,
    body_fa : Text,
    body_sv : Text,
    icon : Text,
    imageUrl : Text,
    hasRegistration : Bool,
    registrationMode : Text,
    formTemplateId : ?Nat,
    eventTemplateId : ?Nat,
    customFormFields : [FormFieldReturn],
    actSessions : [EventSessionReturn],
    highlighted : Bool,
    sortOrder : Nat,
  ) : async ActivityReturn {
    requireAuth(token);
    let id = nextActivityId;
    nextActivityId += 1;
    // Sessions: snapshot from template (or use custom) — needed for registration integrity.
    let resolvedSessions : [EventSession] = switch (eventTemplateId) {
      case (?tid) {
        switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
          case (?t) { t.sessions };
          case null { buildSessions(actSessions) };
        }
      };
      case null { buildSessions(actSessions) };
    };
    // Fields: when using an event template, leave customFormFields empty so
    // getActivityFormFields resolves them live from the template.
    let resolvedFields : [FormField] = switch (eventTemplateId) {
      case (?_) { [] };
      case null { buildFormFields(customFormFields) };
    };
    let activity : Activity = {
      id;
      topicId;
      slug;
      title = { fa = title_fa; sv = title_sv };
      excerpt = { fa = excerpt_fa; sv = excerpt_sv };
      body = { fa = body_fa; sv = body_sv };
      icon;
      imageUrl;
      hasRegistration;
      registrationMode;
      formTemplateId;
      eventTemplateId;
      customFormFields = resolvedFields;
      sessions = resolvedSessions;
      highlighted = ?highlighted;
      sortOrder;
      createdAt = Time.now();
    };
    Map.add(activities, Nat.compare, id, activity);
    H.activityToReturn(activity)
  };

  public func updateActivity(
    token : Text,
    id : Nat,
    topicId : Nat,
    slug : Text,
    title_fa : Text,
    title_sv : Text,
    excerpt_fa : Text,
    excerpt_sv : Text,
    body_fa : Text,
    body_sv : Text,
    icon : Text,
    imageUrl : Text,
    hasRegistration : Bool,
    registrationMode : Text,
    formTemplateId : ?Nat,
    eventTemplateId : ?Nat,
    customFormFields : [FormFieldReturn],
    actSessions : [EventSessionReturn],
    highlighted : Bool,
    sortOrder : Nat,
  ) : async ?ActivityReturn {
    requireAuth(token);
    switch (Map.get(activities, Nat.compare, id)) {
      case (?existing) {
        // Sessions: if switching template, only snapshot from it when safe
        // (no existing non-archived registrations). Otherwise preserve existing
        // session snapshot to keep registrations consistent.
        let resolvedSessions : [EventSession] = switch (eventTemplateId) {
          case (?tid) {
            switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
              case (?t) {
                if (activityHasLiveRegistrations(id)) { existing.sessions }
                else { t.sessions }
              };
              case null { buildSessions(actSessions) };
            }
          };
          case null { buildSessions(actSessions) };
        };
        // Fields: when using an event template, leave customFormFields empty so
        // getActivityFormFields resolves them live from the template.
        let resolvedFields : [FormField] = switch (eventTemplateId) {
          case (?_) { [] };
          case null { buildFormFields(customFormFields) };
        };
        let updated : Activity = {
          id;
          topicId;
          slug;
          title = { fa = title_fa; sv = title_sv };
          excerpt = { fa = excerpt_fa; sv = excerpt_sv };
          body = { fa = body_fa; sv = body_sv };
          icon;
          imageUrl;
          hasRegistration;
          registrationMode;
          formTemplateId;
          eventTemplateId;
          customFormFields = resolvedFields;
          sessions = resolvedSessions;
          highlighted = ?highlighted;
          sortOrder;
          createdAt = existing.createdAt;
        };
        Map.add(activities, Nat.compare, id, updated);
        ?H.activityToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteActivity(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(activities, Nat.compare, id)) {
      case (?_) { ignore Map.delete(activities, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── Form Templates CRUD ────────────────────────────────────────────────

  public query func getFormTemplates() : async [FormTemplateReturn] {
    Iter.toArray(
      Iter.map<(Nat, FormTemplate), FormTemplateReturn>(
        Map.entries(formTemplates),
        func ((_, t)) { H.templateToReturn(t) }
      )
    )
  };

  public query func getFormTemplate(id : Nat) : async ?FormTemplateReturn {
    switch (Map.get(formTemplates, Nat.compare, id)) {
      case (?t) { ?H.templateToReturn(t) };
      case null { null };
    }
  };

  public func createFormTemplate(
    token : Text,
    name_fa : Text,
    name_sv : Text,
    description_fa : Text,
    description_sv : Text,
    fields : [FormFieldReturn],
    minMembers : Nat,
    maxMembers : Nat,
  ) : async FormTemplateReturn {
    requireAuth(token);
    let id = nextFormTemplateId;
    nextFormTemplateId += 1;
    let template : FormTemplate = {
      id;
      name = { fa = name_fa; sv = name_sv };
      description = { fa = description_fa; sv = description_sv };
      fields = buildFormFields(fields);
      createdAt = Time.now();
      minMembers = ?minMembers;
      maxMembers = ?maxMembers;
    };
    Map.add(formTemplates, Nat.compare, id, template);
    H.templateToReturn(template)
  };

  public func updateFormTemplate(
    token : Text,
    id : Nat,
    name_fa : Text,
    name_sv : Text,
    description_fa : Text,
    description_sv : Text,
    fields : [FormFieldReturn],
    minMembers : Nat,
    maxMembers : Nat,
  ) : async ?FormTemplateReturn {
    requireAuth(token);
    switch (Map.get(formTemplates, Nat.compare, id)) {
      case (?existing) {
        let updated : FormTemplate = {
          id;
          name = { fa = name_fa; sv = name_sv };
          description = { fa = description_fa; sv = description_sv };
          fields = buildFormFields(fields);
          createdAt = existing.createdAt;
          minMembers = ?minMembers;
          maxMembers = ?maxMembers;
        };
        Map.add(formTemplates, Nat.compare, id, updated);
        ?H.templateToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteFormTemplate(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(formTemplates, Nat.compare, id)) {
      case (?_) { ignore Map.delete(formTemplates, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── Event Registration Templates CRUD ───────────────────────────────────

  public query func getEventRegistrationTemplates() : async [EventRegistrationTemplateReturn] {
    Iter.toArray(
      Iter.map<(Nat, EventRegistrationTemplate), EventRegistrationTemplateReturn>(
        Map.entries(eventRegTemplates),
        func ((_, t)) { H.eventRegTemplateToReturn(t) }
      )
    )
  };

  public query func getEventRegistrationTemplate(id : Nat) : async ?EventRegistrationTemplateReturn {
    switch (Map.get(eventRegTemplates, Nat.compare, id)) {
      case (?t) { ?H.eventRegTemplateToReturn(t) };
      case null { null };
    }
  };

  public func createEventRegistrationTemplate(
    token : Text,
    name_fa : Text,
    name_sv : Text,
    description_fa : Text,
    description_sv : Text,
    tmplSessions : [EventSessionReturn],
    fields : [FormFieldReturn],
    perMemberMode : Bool,
    perMemberSessionSelection : Bool,
    minMembers : Nat,
    maxMembers : Nat,
  ) : async EventRegistrationTemplateReturn {
    requireAuth(token);
    let id = nextEventRegTemplateId;
    nextEventRegTemplateId += 1;
    let tmpl : EventRegistrationTemplate = {
      id;
      name = { fa = name_fa; sv = name_sv };
      description = { fa = description_fa; sv = description_sv };
      sessions = buildSessions(tmplSessions);
      fields = buildFormFields(fields);
      createdAt = Time.now();
      perMemberMode = ?perMemberMode;
      perMemberSessionSelection = ?perMemberSessionSelection;
      minMembers = ?minMembers;
      maxMembers = ?maxMembers;
    };
    Map.add(eventRegTemplates, Nat.compare, id, tmpl);
    H.eventRegTemplateToReturn(tmpl)
  };

  public func updateEventRegistrationTemplate(
    token : Text,
    id : Nat,
    name_fa : Text,
    name_sv : Text,
    description_fa : Text,
    description_sv : Text,
    tmplSessions : [EventSessionReturn],
    fields : [FormFieldReturn],
    perMemberMode : Bool,
    perMemberSessionSelection : Bool,
    minMembers : Nat,
    maxMembers : Nat,
  ) : async ?EventRegistrationTemplateReturn {
    requireAuth(token);
    switch (Map.get(eventRegTemplates, Nat.compare, id)) {
      case (?existing) {
        let updated : EventRegistrationTemplate = {
          id;
          name = { fa = name_fa; sv = name_sv };
          description = { fa = description_fa; sv = description_sv };
          sessions = buildSessions(tmplSessions);
          fields = buildFormFields(fields);
          createdAt = existing.createdAt;
          perMemberMode = ?perMemberMode;
          perMemberSessionSelection = ?perMemberSessionSelection;
          minMembers = ?minMembers;
          maxMembers = ?maxMembers;
        };
        Map.add(eventRegTemplates, Nat.compare, id, updated);

        // Auto-resync sessions onto every activity bound to this template that
        // has no live registrations yet. Activities with existing registrations
        // keep their snapshot to avoid breaking registration data integrity.
        for ((aid, a) in Map.entries(activities)) {
          let bound = switch (a.eventTemplateId) {
            case (?tid) { tid == id };
            case null { false };
          };
          if (bound and not activityHasLiveRegistrations(aid)) {
            let synced : Activity = {
              id = a.id;
              topicId = a.topicId;
              slug = a.slug;
              title = a.title;
              excerpt = a.excerpt;
              body = a.body;
              icon = a.icon;
              imageUrl = a.imageUrl;
              hasRegistration = a.hasRegistration;
              registrationMode = a.registrationMode;
              formTemplateId = a.formTemplateId;
              eventTemplateId = a.eventTemplateId;
              customFormFields = a.customFormFields;
              sessions = updated.sessions;
              highlighted = a.highlighted;
              sortOrder = a.sortOrder;
              createdAt = a.createdAt;
            };
            Map.add(activities, Nat.compare, aid, synced);
          };
        };

        ?H.eventRegTemplateToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteEventRegistrationTemplate(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(eventRegTemplates, Nat.compare, id)) {
      case (?_) { ignore Map.delete(eventRegTemplates, Nat.compare, id); true };
      case null { false };
    }
  };

  // Activities currently bound to a given event registration template, with
  // their live (non-archived) registration count. Used by the admin UI to
  // explain which events will / won't auto-resync when the template changes.
  public query func getActivitiesUsingEventTemplate(templateId : Nat) : async [{
    id : Nat;
    slug : Text;
    title_fa : Text;
    title_sv : Text;
    liveRegistrationCount : Nat;
  }] {
    let buf = List.empty<{ id : Nat; slug : Text; title_fa : Text; title_sv : Text; liveRegistrationCount : Nat }>();
    for ((aid, a) in Map.entries(activities)) {
      let bound = switch (a.eventTemplateId) {
        case (?tid) { tid == templateId };
        case null { false };
      };
      if (bound) {
        List.add(buf, {
          id = aid;
          slug = a.slug;
          title_fa = a.title.fa;
          title_sv = a.title.sv;
          liveRegistrationCount = liveRegistrationCount(aid);
        });
      };
    };
    List.toArray(buf)
  };

  // ─── Activity Form Fields Resolution ──────────────────────────────────

  public query func getActivityFormFields(activityId : Nat) : async ?[FormFieldReturn] {
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        if (not activity.hasRegistration) {
          return null;
        };
        if (activity.customFormFields.size() > 0) {
          return ?Array.map<FormField, FormFieldReturn>(activity.customFormFields, H.fieldToReturn);
        };
        switch (activity.formTemplateId) {
          case (?tid) {
            switch (Map.get(formTemplates, Nat.compare, tid)) {
              case (?template) {
                return ?Array.map<FormField, FormFieldReturn>(template.fields, H.fieldToReturn)
              };
              case null {};
            }
          };
          case null {};
        };
        switch (activity.eventTemplateId) {
          case (?tid) {
            switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
              case (?template) {
                return ?Array.map<FormField, FormFieldReturn>(template.fields, H.fieldToReturn)
              };
              case null {};
            }
          };
          case null {};
        };
        null;
      };
      case null { null };
    }
  };

  // Returns the resolved registration form configuration for an activity:
  // split shared / per-member fields, per-member-mode flag, member limits,
  // and the snapshotted session list. Lets the public form render in one
  // round-trip without re-implementing scope logic on the client.
  public query func getActivityRegistrationConfig(activityId : Nat) : async ?T.ActivityRegistrationConfigReturn {
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        let pm = resolveActivityPerMemberConfig(activity);
        ?{
          activityId      = activity.id;
          hasRegistration = activity.hasRegistration;
          perMemberMode   = pm.enabled;
          perMemberSessionSelection = pm.perMemberSessionSelection;
          minMembers      = pm.minMembers;
          maxMembers      = pm.maxMembers;
          sharedFields    = Array.map<FormField, FormFieldReturn>(pm.sharedFields, H.fieldToReturn);
          perMemberFields = Array.map<FormField, FormFieldReturn>(pm.perMemberFields, H.fieldToReturn);
          sessions        = Array.map<EventSession, EventSessionReturn>(activity.sessions, H.sessionToReturn);
        }
      };
      case null { null };
    }
  };

  // ─── Session availability helpers ─────────────────────────────────────────

  // Get all registrations for an activity as an array (for capacity computation).
  // Archived registrations are excluded so archiving frees the slot.
  func regsForActivity(activityId : Nat) : [T.Registration] {
    Iter.toArray(
      Iter.map<(Nat, T.Registration), T.Registration>(
        Iter.filter<(Nat, T.Registration)>(
          Map.entries(registrations),
          func ((_, r)) {
            let isArchived = switch (r.archived) { case (?b) b; case null false };
            r.activityId == activityId and not isArchived
          }
        ),
        func ((_, r)) { r }
      )
    )
  };

  // Compute SessionAvailabilityReturn for each session of an activity
  func computeAvailability(activity : Activity) : [SessionAvailabilityReturn] {
    let actRegs = regsForActivity(activity.id);
    Array.map<EventSession, SessionAvailabilityReturn>(activity.sessions, func (s) {
      let (confirmed, buffer) = H.computeSessionCounts(actRegs, s.id, s.capacity, s.bufferCapacity, null);
      {
        sessionId      = s.id;
        name_fa        = s.name.fa;
        name_sv        = s.name.sv;
        date           = s.date;
        capacity       = s.capacity;
        bufferCapacity = s.bufferCapacity;
        confirmedCount = confirmed;
        bufferCount    = buffer;
        regularFull    = confirmed >= s.capacity;
        totalFull      = confirmed + buffer >= s.capacity + s.bufferCapacity;
        sortOrder      = s.sortOrder;
      }
    })
  };

  // ─── Session Availability Queries ─────────────────────────────────────────

  public query func getSessionAvailability(activityId : Nat) : async [SessionAvailabilityReturn] {
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) { computeAvailability(activity) };
      case null { [] };
    }
  };

  public query func getSessionStats(token : Text, activityId : Nat) : async [SessionStatsReturn] {
    requireAuth(token);
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        let actRegs = regsForActivity(activityId);
        Array.map<EventSession, SessionStatsReturn>(activity.sessions, func (s) {
          let (confirmed, buffer) = H.computeSessionCounts(actRegs, s.id, s.capacity, s.bufferCapacity, null);
          // Count distinct registration records for this session
          var regCount : Nat = 0;
          for (reg in actRegs.vals()) {
            for (ss in reg.selectedSessions.vals()) {
              if (ss.sessionId == s.id) { regCount += 1 };
            };
          };
          {
            sessionId         = s.id;
            name_fa           = s.name.fa;
            name_sv           = s.name.sv;
            date              = s.date;
            capacity          = s.capacity;
            bufferCapacity    = s.bufferCapacity;
            confirmedCount    = confirmed;
            bufferCount       = buffer;
            registrationCount = regCount;
            sortOrder         = s.sortOrder;
          }
        })
      };
      case null { [] };
    }
  };

  // ─── Registrations ────────────────────────────────────────────────────────

  let maxNameLen : Nat = 200;
  let maxEmailLen : Nat = 200;
  let maxPhoneLen : Nat = 50;
  let maxMessageLen : Nat = 2000;
  let maxFieldValueLen : Nat = 2000;
  let maxFieldValues : Nat = 50;
  let maxPersonCount : Nat = 20;
  let maxSessions : Nat = 20;

  // Check if a text value is in an array (case-sensitive)
  func arrayContainsText(arr : [Text], val : Text) : Bool {
    for (t in arr.vals()) {
      if (t == val) { return true };
    };
    false
  };

  // Check if a Nat is in an array
  func arrayContainsNat(arr : [Nat], val : Nat) : Bool {
    for (n in arr.vals()) {
      if (n == val) { return true };
    };
    false
  };

  // Snapshot session names from activity.sessions for the given IDs
  func snapshotSessions(
    sessionIds : [Nat],
    actSessions : [EventSession],
  ) : [T.RegistrationSessionSnapshot] {
    Array.map<Nat, T.RegistrationSessionSnapshot>(sessionIds, func (sid) {
      var name = "Session " # Nat.toText(sid);
      for (s in actSessions.vals()) {
        if (s.id == sid) { name := s.name.fa # " / " # s.name.sv };
      };
      { sessionId = sid; sessionName = name }
    })
  };

  // ─── Per-member mode helpers ──────────────────────────────────────────────

  // Resolve whether an activity uses per-member mode + the field split. Only
  // event-template-bound activities can enable per-member mode; activity-level
  // event-custom mode keeps the legacy single-counter behavior.
  func resolveActivityPerMemberConfig(activity : Activity) : {
    enabled         : Bool;
    perMemberSessionSelection : Bool;
    minMembers      : Nat;
    maxMembers      : Nat;
    sharedFields    : [FormField];
    perMemberFields : [FormField];
  } {
    let allFields = resolveActivityFields(activity);
    var enabled = false;
    var perMemberSessions = false;
    var minM : Nat = 1;
    var maxM : Nat = maxPersonCount;
    switch (activity.eventTemplateId) {
      case (?tid) {
        switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
          case (?tmpl) {
            enabled := switch (tmpl.perMemberMode) { case (?b) b; case null false };
            perMemberSessions := switch (tmpl.perMemberSessionSelection) { case (?b) b; case null false };
            minM := switch (tmpl.minMembers) {
              case (?n) { if (n < 1) 1 else n };
              case null { 1 };
            };
            maxM := switch (tmpl.maxMembers) {
              case (?n) {
                if (n < 1) 1
                else if (n > maxPersonCount) maxPersonCount
                else n
              };
              case null { maxPersonCount };
            };
          };
          case null {};
        };
      };
      case null {
        // Fall back to the form template's member bounds when present.
        switch (activity.formTemplateId) {
          case (?tid) {
            switch (Map.get(formTemplates, Nat.compare, tid)) {
              case (?tmpl) {
                minM := switch (tmpl.minMembers) {
                  case (?n) { if (n < 1) 1 else n };
                  case null { 1 };
                };
                maxM := switch (tmpl.maxMembers) {
                  case (?n) {
                    if (n < 1) 1
                    else if (n > maxPersonCount) maxPersonCount
                    else n
                  };
                  case null { maxPersonCount };
                };
              };
              case null {};
            };
          };
          case null {};
        };
      };
    };
    if (minM > maxM) { minM := maxM };

    let perBuf = List.empty<FormField>();
    let sharedBuf = List.empty<FormField>();
    for (f in allFields.vals()) {
      let isPerMember = switch (f.perMember) { case (?b) b; case null false };
      // Lookup fields are forced shared even if mistakenly flagged per-member.
      if (isPerMember and not f.isLookupField) {
        perBuf.add(f);
      } else {
        sharedBuf.add(f);
      };
    };
    {
      enabled = enabled and perBuf.size() > 0;
      perMemberSessionSelection = perMemberSessions and enabled and perBuf.size() > 0 and activity.sessions.size() > 0;
      minMembers = minM;
      maxMembers = maxM;
      sharedFields = List.toArray(sharedBuf);
      perMemberFields = List.toArray(perBuf);
    }
  };

  // Resolve a single member submission into a stored RegistrationMember.
  // countsTowardCapacity is false when any per-member field flagged
  // excludeFromCapacityWhenChecked has value == "true".
  // sessionIds, when non-null, snapshots a per-member session list.
  func resolveMember(
    memberValues    : [{ fieldId : Nat; value : Text }],
    perMemberFields : [FormField],
    sessionIds      : ?[Nat],
    actSessions     : [EventSession],
  ) : T.RegistrationMember {
    let values = Array.map<{ fieldId : Nat; value : Text }, T.RegistrationFieldValue>(
      memberValues,
      func (fv) {
        var resolvedLabel = "Field " # Nat.toText(fv.fieldId);
        for (pf in perMemberFields.vals()) {
          if (pf.id == fv.fieldId) {
            resolvedLabel := pf.fieldLabel.fa # " / " # pf.fieldLabel.sv;
          };
        };
        { fieldId = fv.fieldId; fieldLabel = resolvedLabel; value = fv.value }
      }
    );
    var counts = true;
    for (pf in perMemberFields.vals()) {
      let exclude = switch (pf.excludeFromCapacityWhenChecked) { case (?b) b; case null false };
      if (exclude) {
        for (mv in memberValues.vals()) {
          if (mv.fieldId == pf.id and mv.value == "true") { counts := false };
        };
      };
    };
    let snaps : ?[T.RegistrationSessionSnapshot] = switch (sessionIds) {
      case (?ids) { ?snapshotSessions(ids, actSessions) };
      case null { null };
    };
    { values; countsTowardCapacity = counts; selectedSessions = snaps }
  };

  func effectiveMemberCount(members : [T.RegistrationMember]) : Nat {
    var n : Nat = 0;
    for (m in members.vals()) {
      if (m.countsTowardCapacity) { n += 1 };
    };
    n
  };

  // Validate per-member submission shape (sizes + required fields).
  // memberSessionIds parallels membersInput; null = no per-member sessions.
  func validateMembers(
    membersInput     : [[{ fieldId : Nat; value : Text }]],
    memberSessionIds : ?[[Nat]],
    perMemberFields  : [FormField],
    perMemberSessions : Bool,
    minMembers       : Nat,
    maxMembers       : Nat,
  ) : Bool {
    let n = membersInput.size();
    if (n < minMembers or n > maxMembers or n > maxPersonCount) { return false };
    for (m in membersInput.vals()) {
      if (m.size() > maxFieldValues) { return false };
      for (fv in m.vals()) {
        if (fv.value.size() > maxFieldValueLen) { return false };
      };
      for (pf in perMemberFields.vals()) {
        if (pf.required) {
          var ok = false;
          for (fv in m.vals()) {
            if (fv.fieldId == pf.id and fv.value.size() > 0) { ok := true };
          };
          if (not ok) { return false };
        };
      };
    };
    switch (memberSessionIds) {
      case (?ids) {
        if (not perMemberSessions) { return false };
        if (ids.size() != n) { return false };
        for (sl in ids.vals()) {
          if (sl.size() > maxSessions) { return false };
        };
      };
      case null {
        if (perMemberSessions) { return false };
      };
    };
    true
  };

  public func submitRegistration(
    activityId         : Nat,
    name               : Text,
    email              : Text,
    phone              : Text,
    message            : Text,
    personCount        : Nat,
    selectedSessionIds : [Nat],
    fieldValues        : [{ fieldId : Nat; value : Text }],
    members            : [[{ fieldId : Nat; value : Text }]],
    memberSessionIds   : ?[[Nat]],
    acceptBuffer       : Bool,
  ) : async SubmitRegistrationResult {
    // 1. Input size validation
    if (
      name.size() > maxNameLen or
      email.size() > maxEmailLen or
      phone.size() > maxPhoneLen or
      message.size() > maxMessageLen or
      fieldValues.size() > maxFieldValues or
      personCount < 1 or personCount > maxPersonCount or
      selectedSessionIds.size() > maxSessions or
      members.size() > maxPersonCount
    ) {
      return #invalidInput;
    };
    for (fv in fieldValues.vals()) {
      if (fv.value.size() > maxFieldValueLen) { return #invalidInput };
    };

    // 2. Activity check
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        if (not activity.hasRegistration) { return #registrationDisabled };

        // Per-member mode handling: derive effective person count and
        // resolved member snapshots when the bound template enables it.
        let pmConfig = resolveActivityPerMemberConfig(activity);
        var effectivePersonCount : Nat = personCount;
        var resolvedMembers : ?[T.RegistrationMember] = null;
        // Effective session list at the registration level. For per-member
        // session selection we derive it as the union of all member lists so
        // legacy admin views and queries still see a top-level summary.
        var effectiveSessionIds : [Nat] = selectedSessionIds;
        if (pmConfig.enabled) {
          if (not validateMembers(members, memberSessionIds, pmConfig.perMemberFields, pmConfig.perMemberSessionSelection, pmConfig.minMembers, pmConfig.maxMembers)) {
            return #invalidInput;
          };
          // Validate member session IDs reference real sessions on this activity
          switch (memberSessionIds) {
            case (?ids) {
              for (sl in ids.vals()) {
                for (sid in sl.vals()) {
                  var found = false;
                  for (s in activity.sessions.vals()) {
                    if (s.id == sid) { found := true };
                  };
                  if (not found) { return #invalidInput };
                };
              };
            };
            case null {};
          };
          let rms = Array.tabulate<T.RegistrationMember>(members.size(), func (i) {
            let memberSessions : ?[Nat] = switch (memberSessionIds) {
              case (?ids) { ?ids[i] };
              case null { null };
            };
            resolveMember(members[i], pmConfig.perMemberFields, memberSessions, activity.sessions)
          });
          let eff = effectiveMemberCount(rms);
          if (eff > maxPersonCount) { return #invalidInput };
          effectivePersonCount := eff;
          resolvedMembers := ?rms;
          // Derive top-level session list from the union of all member lists
          // (per-member-session mode). Maintain insertion order, deduped.
          if (pmConfig.perMemberSessionSelection) {
            let unionBuf = List.empty<Nat>();
            switch (memberSessionIds) {
              case (?ids) {
                for (sl in ids.vals()) {
                  for (sid in sl.vals()) {
                    if (not arrayContainsNat(List.toArray(unionBuf), sid)) {
                      unionBuf.add(sid);
                    };
                  };
                };
              };
              case null {};
            };
            effectiveSessionIds := List.toArray(unionBuf);
          };
        };

        // 3. Per-field allowed-values whitelist: if a field declares a
        //    non-empty `allowedValues` list, the submitted value (when
        //    present) must be in the list. Empty submissions are skipped
        //    (required-field enforcement happens client-side).
        let activityFields = resolveActivityFields(activity);
        for (f in activityFields.vals()) {
          let allowed = switch (f.allowedValues) { case (?a) a; case null [] };
          if (allowed.size() > 0) {
            var submittedValue : ?Text = null;
            for (fv in fieldValues.vals()) {
              if (fv.fieldId == f.id) { submittedValue := ?fv.value };
            };
            switch (submittedValue) {
              case (?v) {
                if (v.size() > 0 and not arrayContainsText(allowed, v)) {
                  return #valueNotAllowed(f.id);
                };
              };
              case null {};
            };
          };
        };

        let actRegs = regsForActivity(activityId);

        // 4. Field-level uniqueness: reject if any `unique` field already has
        //    the submitted value in another (non-archived) registration of
        //    this activity. Replaces the legacy per-phone / per-email rules.
        for (f in activityFields.vals()) {
          let isUnique = switch (f.unique) { case (?b) b; case null false };
          if (isUnique) {
            var submittedValue : ?Text = null;
            for (fv in fieldValues.vals()) {
              if (fv.fieldId == f.id) { submittedValue := ?fv.value };
            };
            switch (submittedValue) {
              case (?v) {
                if (v.size() > 0) {
                  label dupLoop for (reg in actRegs.vals()) {
                    for (rfv in reg.fieldValues.vals()) {
                      if (rfv.fieldId == f.id and rfv.value == v) {
                        return #duplicateValue(f.id);
                      };
                    };
                  };
                };
              };
              case null {};
            };
          };
        };

        // 5. Member-count bounds in shared mode (per-member mode is enforced by
        //    validateMembers above using the same template min/max).
        if (not pmConfig.enabled) {
          if (personCount < pmConfig.minMembers or personCount > pmConfig.maxMembers) {
            return #invalidInput;
          };
        };

        // 6. Per-session capacity check.
        //    For shared sessions the whole effectivePersonCount is checked
        //    against each selected session. For per-member sessions each
        //    session's load is the count of counting-members assigned to it.
        if (effectiveSessionIds.size() > 0) {
          let hardFailBuf = List.empty<Nat>();
          let bufferBuf = List.empty<Nat>();
          for (sid in effectiveSessionIds.vals()) {
            var sessionCap : Nat = 0;
            var sessionBuf : Nat = 0;
            var sessionFound = false;
            for (s in activity.sessions.vals()) {
              if (s.id == sid) {
                sessionCap := s.capacity;
                sessionBuf := s.bufferCapacity;
                sessionFound := true;
              };
            };
            if (sessionFound) {
              let (confirmed, buffer) = H.computeSessionCounts(actRegs, sid, sessionCap, sessionBuf, null);
              // Determine how many slots THIS submission needs for this session.
              var needed : Nat = effectivePersonCount;
              if (pmConfig.enabled and pmConfig.perMemberSessionSelection) {
                needed := 0;
                switch (memberSessionIds, resolvedMembers) {
                  case (?ids, ?rms) {
                    var i : Nat = 0;
                    while (i < ids.size()) {
                      if (i < rms.size() and rms[i].countsTowardCapacity) {
                        for (s in ids[i].vals()) {
                          if (s == sid) { needed += 1 };
                        };
                      };
                      i += 1;
                    };
                  };
                  case _ {};
                };
              };
              if (confirmed + buffer + needed > sessionCap + sessionBuf) {
                hardFailBuf.add(sid);
              } else if (confirmed + buffer + needed > sessionCap) {
                bufferBuf.add(sid);
              };
            };
          };
          if (hardFailBuf.size() > 0) {
            return #sessionsUnavailable(List.toArray(hardFailBuf));
          };
          if (bufferBuf.size() > 0 and not acceptBuffer) {
            return #sessionsRequireBuffer(List.toArray(bufferBuf));
          };
        };

        // 7. Store registration — use timestamp-based ID for uniqueness
        let tsId = Int.abs(Time.now()) / 1_000_000_000;
        let id = if (tsId > nextRegistrationId) tsId else nextRegistrationId + 1;
        nextRegistrationId := id;

        let resolvedFields = Array.map<{ fieldId : Nat; value : Text }, T.RegistrationFieldValue>(
          fieldValues,
          func (fv) {
            var resolvedLabel = "Field " # Nat.toText(fv.fieldId);
            var found = false;
            for (cf in activity.customFormFields.vals()) {
              if (not found and cf.id == fv.fieldId) {
                resolvedLabel := cf.fieldLabel.fa # " / " # cf.fieldLabel.sv;
                found := true;
              };
            };
            if (not found and activity.customFormFields.size() == 0) {
              switch (activity.formTemplateId) {
                case (?tid) {
                  switch (Map.get(formTemplates, Nat.compare, tid)) {
                    case (?template) {
                      for (tf in template.fields.vals()) {
                        if (not found and tf.id == fv.fieldId) {
                          resolvedLabel := tf.fieldLabel.fa # " / " # tf.fieldLabel.sv;
                          found := true;
                        };
                      };
                    };
                    case null {};
                  };
                };
                case null {};
              };
              switch (activity.eventTemplateId) {
                case (?tid) {
                  switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
                    case (?template) {
                      for (tf in template.fields.vals()) {
                        if (not found and tf.id == fv.fieldId) {
                          resolvedLabel := tf.fieldLabel.fa # " / " # tf.fieldLabel.sv;
                          found := true;
                        };
                      };
                    };
                    case null {};
                  };
                };
                case null {};
              };
            };
            { fieldId = fv.fieldId; fieldLabel = resolvedLabel; value = fv.value }
          }
        );

        let reg : T.Registration = {
          id;
          activityId;
          name;
          email;
          phone;
          message;
          personCount = effectivePersonCount;
          selectedSessions = snapshotSessions(effectiveSessionIds, activity.sessions);
          fieldValues = resolvedFields;
          createdAt = Time.now();
          archived = ?false;
          members = resolvedMembers;
        };
        Map.add(registrations, Nat.compare, id, reg);

        // 8. Compute statuses (reg is now in the map)
        let allRegsNow = regsForActivity(activityId);
        let statuses = H.computeSessionStatuses(allRegsNow, reg, activity.sessions, null);
        let perMemberStatuses = H.computePerMemberStatuses(allRegsNow, reg, activity.sessions, null);
        #ok(H.regToReturnWithStatusFull(reg, statuses, perMemberStatuses))
      };
      case null { #registrationDisabled };
    }
  };

  // ─── Public Registration Lookup / Modify / Cancel ─────────────────────────

  // Resolve the effective form fields for an activity (custom > template > none)
  func resolveActivityFields(activity : Activity) : [FormField] {
    if (activity.customFormFields.size() > 0) {
      return activity.customFormFields;
    };
    switch (activity.formTemplateId) {
      case (?tid) {
        switch (Map.get(formTemplates, Nat.compare, tid)) {
          case (?t) { return t.fields };
          case null {};
        };
      };
      case null {};
    };
    switch (activity.eventTemplateId) {
      case (?tid) {
        switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
          case (?t) { return t.fields };
          case null {};
        };
      };
      case null {};
    };
    []
  };

  // Find the designated lookup field; falls back to phone matching if none
  func verifyLookup(reg : T.Registration, activity : ?Activity, lookupValue : Text) : Bool {
    switch (activity) {
      case (?act) {
        let fields = resolveActivityFields(act);
        for (f in fields.vals()) {
          if (f.isLookupField) {
            // Check if any fieldValue matches
            for (fv in reg.fieldValues.vals()) {
              if (fv.fieldId == f.id) {
                return (fv.value == lookupValue);
              };
            };
            return false; // lookup field defined but not filled
          };
        };
        // No lookup field defined — fall back to phone
        reg.phone == lookupValue
      };
      case null { reg.phone == lookupValue };
    }
  };

  public query func getRegistrationById(id : Nat, lookupValue : Text) : async ?RegistrationWithStatusReturn {
    switch (Map.get(registrations, Nat.compare, id)) {
      case (?reg) {
        let actOpt = Map.get(activities, Nat.compare, reg.activityId);
        if (not verifyLookup(reg, actOpt, lookupValue)) { return null };
        switch (actOpt) {
          case (?activity) {
            let actRegs = regsForActivity(reg.activityId);
            let statuses = H.computeSessionStatuses(actRegs, reg, activity.sessions, null);
            let perMemberStatuses = H.computePerMemberStatuses(actRegs, reg, activity.sessions, null);
            ?H.regToReturnWithStatusFull(reg, statuses, perMemberStatuses)
          };
          case null {
            // Activity was deleted — return without status
            ?H.regToReturnWithStatus(reg, [])
          };
        }
      };
      case null { null };
    }
  };

  public func cancelRegistration(id : Nat, lookupValue : Text) : async Bool {
    switch (Map.get(registrations, Nat.compare, id)) {
      case (?reg) {
        let actOpt = Map.get(activities, Nat.compare, reg.activityId);
        if (not verifyLookup(reg, actOpt, lookupValue)) { return false };
        ignore Map.delete(registrations, Nat.compare, id);
        true
      };
      case null { false };
    }
  };

  public func modifyRegistration(
    id                    : Nat,
    lookupValue           : Text,
    newPersonCount        : Nat,
    newSelectedSessionIds : [Nat],
    newFieldValues        : [{ fieldId : Nat; value : Text }],
    newMembers            : [[{ fieldId : Nat; value : Text }]],
    newMemberSessionIds   : ?[[Nat]],
    acceptBuffer          : Bool,
  ) : async SubmitRegistrationResult {
    // Validate input sizes
    if (
      newPersonCount < 1 or newPersonCount > maxPersonCount or
      newSelectedSessionIds.size() > maxSessions or
      newFieldValues.size() > maxFieldValues or
      newMembers.size() > maxPersonCount
    ) {
      return #invalidInput;
    };
    for (fv in newFieldValues.vals()) {
      if (fv.value.size() > maxFieldValueLen) { return #invalidInput };
    };

    switch (Map.get(registrations, Nat.compare, id)) {
      case (?existing) {
        let actOpt = Map.get(activities, Nat.compare, existing.activityId);
        if (not verifyLookup(existing, actOpt, lookupValue)) { return #invalidInput };

        switch (actOpt) {
          case (?activity) {
            if (not activity.hasRegistration) { return #registrationDisabled };

            // Per-member mode: validate + derive effective count and members.
            let pmConfig = resolveActivityPerMemberConfig(activity);
            var effectivePersonCount : Nat = newPersonCount;
            var resolvedMembers : ?[T.RegistrationMember] = existing.members;
            var effectiveSessionIds : [Nat] = newSelectedSessionIds;
            if (pmConfig.enabled) {
              if (not validateMembers(newMembers, newMemberSessionIds, pmConfig.perMemberFields, pmConfig.perMemberSessionSelection, pmConfig.minMembers, pmConfig.maxMembers)) {
                return #invalidInput;
              };
              switch (newMemberSessionIds) {
                case (?ids) {
                  for (sl in ids.vals()) {
                    for (sid in sl.vals()) {
                      var found = false;
                      for (s in activity.sessions.vals()) {
                        if (s.id == sid) { found := true };
                      };
                      if (not found) { return #invalidInput };
                    };
                  };
                };
                case null {};
              };
              let rms = Array.tabulate<T.RegistrationMember>(newMembers.size(), func (i) {
                let memberSessions : ?[Nat] = switch (newMemberSessionIds) {
                  case (?ids) { ?ids[i] };
                  case null { null };
                };
                resolveMember(newMembers[i], pmConfig.perMemberFields, memberSessions, activity.sessions)
              });
              let eff = effectiveMemberCount(rms);
              if (eff > maxPersonCount) { return #invalidInput };
              effectivePersonCount := eff;
              resolvedMembers := ?rms;
              if (pmConfig.perMemberSessionSelection) {
                let unionBuf = List.empty<Nat>();
                switch (newMemberSessionIds) {
                  case (?ids) {
                    for (sl in ids.vals()) {
                      for (sid in sl.vals()) {
                        if (not arrayContainsNat(List.toArray(unionBuf), sid)) {
                          unionBuf.add(sid);
                        };
                      };
                    };
                  };
                  case null {};
                };
                effectiveSessionIds := List.toArray(unionBuf);
              };
            };

            let actRegs = regsForActivity(existing.activityId);

            // Per-field allowed-values whitelist (mirror of submitRegistration)
            let activityFields = resolveActivityFields(activity);
            for (f in activityFields.vals()) {
              let allowed = switch (f.allowedValues) { case (?a) a; case null [] };
              if (allowed.size() > 0) {
                var submittedValue : ?Text = null;
                for (fv in newFieldValues.vals()) {
                  if (fv.fieldId == f.id) { submittedValue := ?fv.value };
                };
                switch (submittedValue) {
                  case (?v) {
                    if (v.size() > 0 and not arrayContainsText(allowed, v)) {
                      return #valueNotAllowed(f.id);
                    };
                  };
                  case null {};
                };
              };
            };

            // Per-session capacity check excluding the current registration
            if (effectiveSessionIds.size() > 0) {
              let hardFailBuf = List.empty<Nat>();
              let bufferBuf = List.empty<Nat>();
              for (sid in effectiveSessionIds.vals()) {
                var sessionCap : Nat = 0;
                var sessionBuf : Nat = 0;
                var sessionFound = false;
                for (s in activity.sessions.vals()) {
                  if (s.id == sid) {
                    sessionCap := s.capacity;
                    sessionBuf := s.bufferCapacity;
                    sessionFound := true;
                  };
                };
                if (sessionFound) {
                  let (confirmed, buffer) = H.computeSessionCounts(actRegs, sid, sessionCap, sessionBuf, ?id);
                  var needed : Nat = effectivePersonCount;
                  if (pmConfig.enabled and pmConfig.perMemberSessionSelection) {
                    needed := 0;
                    switch (newMemberSessionIds, resolvedMembers) {
                      case (?ids, ?rms) {
                        var i : Nat = 0;
                        while (i < ids.size()) {
                          if (i < rms.size() and rms[i].countsTowardCapacity) {
                            for (s in ids[i].vals()) {
                              if (s == sid) { needed += 1 };
                            };
                          };
                          i += 1;
                        };
                      };
                      case _ {};
                    };
                  };
                  if (confirmed + buffer + needed > sessionCap + sessionBuf) {
                    hardFailBuf.add(sid);
                  } else if (confirmed + buffer + needed > sessionCap) {
                    bufferBuf.add(sid);
                  };
                };
              };
              if (hardFailBuf.size() > 0) {
                return #sessionsUnavailable(List.toArray(hardFailBuf));
              };
              if (bufferBuf.size() > 0 and not acceptBuffer) {
                return #sessionsRequireBuffer(List.toArray(bufferBuf));
              };
            };

            // Resolve field labels
            let resolvedFields = Array.map<{ fieldId : Nat; value : Text }, T.RegistrationFieldValue>(
              newFieldValues,
              func (fv) {
                var resolvedLabel = "Field " # Nat.toText(fv.fieldId);
                var found = false;
                for (cf in activity.customFormFields.vals()) {
                  if (not found and cf.id == fv.fieldId) {
                    resolvedLabel := cf.fieldLabel.fa # " / " # cf.fieldLabel.sv;
                    found := true;
                  };
                };
                { fieldId = fv.fieldId; fieldLabel = resolvedLabel; value = fv.value }
              }
            );

            // Update in place, preserving createdAt (keeps queue position)
            let updated : T.Registration = {
              id;
              activityId = existing.activityId;
              name       = existing.name;
              email      = existing.email;
              phone      = existing.phone;
              message    = existing.message;
              personCount = effectivePersonCount;
              selectedSessions = snapshotSessions(effectiveSessionIds, activity.sessions);
              fieldValues = resolvedFields;
              createdAt   = existing.createdAt;
              archived    = existing.archived;
              members     = resolvedMembers;
            };
            Map.add(registrations, Nat.compare, id, updated);

            let allRegsNow = regsForActivity(existing.activityId);
            let statuses = H.computeSessionStatuses(allRegsNow, updated, activity.sessions, null);
            let perMemberStatuses = H.computePerMemberStatuses(allRegsNow, updated, activity.sessions, null);
            #ok(H.regToReturnWithStatusFull(updated, statuses, perMemberStatuses))
          };
          case null { #registrationDisabled };
        }
      };
      case null { #invalidInput };
    }
  };

  // ─── Admin Registration Queries ───────────────────────────────────────────

  public query func getRegistrations(token : Text, activityId : Nat) : async [RegistrationReturn] {
    requireAuth(token);
    Iter.toArray(
      Iter.map<(Nat, T.Registration), RegistrationReturn>(
        Iter.filter<(Nat, T.Registration)>(
          Map.entries(registrations),
          func ((_, r)) { r.activityId == activityId }
        ),
        func ((_, r)) { H.regToReturn(r) }
      )
    )
  };

  public query func getRegistrationsWithStatus(token : Text, activityId : Nat) : async [RegistrationWithStatusReturn] {
    requireAuth(token);
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        let actRegs = Iter.toArray(
          Iter.map<(Nat, T.Registration), T.Registration>(
            Iter.filter<(Nat, T.Registration)>(
              Map.entries(registrations),
              func ((_, r)) { r.activityId == activityId }
            ),
            func ((_, r)) { r }
          )
        );
        let nonArchived = Array.filter<T.Registration>(
          actRegs,
          func (r) { switch (r.archived) { case (?b) not b; case null true } }
        );
        Array.map<T.Registration, RegistrationWithStatusReturn>(
          actRegs,
          func (r) {
            let statuses = H.computeSessionStatuses(nonArchived, r, activity.sessions, null);
            let perMemberStatuses = H.computePerMemberStatuses(nonArchived, r, activity.sessions, null);
            H.regToReturnWithStatusFull(r, statuses, perMemberStatuses)
          }
        )
      };
      case null { [] };
    }
  };

  public query func getAllRegistrations(token : Text) : async [RegistrationReturn] {
    requireAuth(token);
    Iter.toArray(
      Iter.map<(Nat, T.Registration), RegistrationReturn>(
        Map.entries(registrations),
        func ((_, r)) { H.regToReturn(r) }
      )
    )
  };

  public func setRegistrationArchived(token : Text, id : Nat, archived : Bool) : async Bool {
    requireAuth(token);
    switch (Map.get(registrations, Nat.compare, id)) {
      case (?existing) {
        let updated : T.Registration = {
          id              = existing.id;
          activityId      = existing.activityId;
          name            = existing.name;
          email           = existing.email;
          phone           = existing.phone;
          message         = existing.message;
          personCount     = existing.personCount;
          selectedSessions = existing.selectedSessions;
          fieldValues     = existing.fieldValues;
          createdAt       = existing.createdAt;
          archived        = ?archived;
          members         = existing.members;
        };
        Map.add(registrations, Nat.compare, id, updated);
        true
      };
      case null { false };
    }
  };

  // ─── Social Links CRUD ────────────────────────────────────────────────────

  public query func getSocialLinks() : async [SocialLinkReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, SocialLink), SocialLinkReturn>(
        Map.entries(socialLinks),
        func ((_, s)) { H.socialToReturn(s) }
      )
    );
    Array.sort(arr, func (a : SocialLinkReturn, b : SocialLinkReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public func createSocialLink(
    token : Text,
    platform : Text,
    url : Text,
    sortOrder : Nat,
  ) : async SocialLinkReturn {
    requireAuth(token);
    let id = nextSocialLinkId;
    nextSocialLinkId += 1;
    let link : SocialLink = { id; platform; url; sortOrder };
    Map.add(socialLinks, Nat.compare, id, link);
    H.socialToReturn(link)
  };

  public func updateSocialLink(
    token : Text,
    id : Nat,
    platform : Text,
    url : Text,
    sortOrder : Nat,
  ) : async ?SocialLinkReturn {
    requireAuth(token);
    switch (Map.get(socialLinks, Nat.compare, id)) {
      case (?_) {
        let updated : SocialLink = { id; platform; url; sortOrder };
        Map.add(socialLinks, Nat.compare, id, updated);
        ?H.socialToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteSocialLink(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(socialLinks, Nat.compare, id)) {
      case (?_) { ignore Map.delete(socialLinks, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── About Us ───────────────────────────────────────────────────────────

  public query func getAboutContent() : async AboutContentReturn {
    H.aboutToReturn(aboutContent)
  };

  public func updateAboutContent(
    token : Text,
    headerImageUrl : Text,
    body_fa : Text,
    body_sv : Text,
  ) : async AboutContentReturn {
    requireAuth(token);
    aboutContent := {
      headerImageUrl;
      body = { fa = body_fa; sv = body_sv };
    };
    H.aboutToReturn(aboutContent)
  };

  // ─── Contact Messages ─────────────────────────────────────────────────────

  public func submitContactMessage(
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : async ?ContactMessageReturn {
    if (
      name.size() > maxNameLen or
      email.size() > maxEmailLen or
      phone.size() > maxPhoneLen or
      message.size() > maxMessageLen
    ) {
      return null;
    };
    let id = nextContactMessageId;
    nextContactMessageId += 1;
    let msg : ContactMessage = {
      id;
      name;
      email;
      phone;
      message;
      createdAt = Time.now();
    };
    Map.add(contactMessages, Nat.compare, id, msg);
    ?H.contactMsgToReturn(msg)
  };

  public query func getContactMessages(token : Text) : async [ContactMessageReturn] {
    requireAuth(token);
    Iter.toArray(
      Iter.map<(Nat, ContactMessage), ContactMessageReturn>(
        Map.entries(contactMessages),
        func ((_, c)) { H.contactMsgToReturn(c) }
      )
    )
  };

  public func deleteContactMessage(token : Text, id : Nat) : async Bool {
    requireAuth(token);
    switch (Map.get(contactMessages, Nat.compare, id)) {
      case (?_) { ignore Map.delete(contactMessages, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── Asset Upload ─────────────────────────────────────────────────────────

  let maxAssetSize : Nat = 1_500_000;

  public func uploadAsset(token : Text, name : Text, contentType : Text, data : Blob) : async Text {
    requireAuth(token);
    if (data.size() > maxAssetSize) {
      Runtime.trap("Asset too large: max " # Nat.toText(maxAssetSize) # " bytes");
    };
    assetCounter += 1;
    let key = "/uploads/" # Nat.toText(assetCounter) # "-" # name;
    Map.add(assets, Text.compare, key, data);
    key
  };

  public query func getAsset(key : Text) : async ?Blob {
    Map.get(assets, Text.compare, key)
  };

  public query func listAssets() : async [Text] {
    Iter.toArray(
      Iter.map<(Text, Blob), Text>(
        Map.entries(assets),
        func ((k, _)) { k }
      )
    )
  };

  public func deleteAsset(token : Text, key : Text) : async Bool {
    requireAuth(token);
    switch (Map.get(assets, Text.compare, key)) {
      case (?_) { ignore Map.delete(assets, Text.compare, key); true };
      case null { false };
    }
  };

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
    if (seoSettings.robotsTxtExtra != "") {
      txt #= seoSettings.robotsTxtExtra # "\n";
    };
    txt #= "Sitemap: " # seoSettings.canonicalBaseUrl # "/sitemap.xml\n";
    txt
  };

  func assembleSitemapXml() : Text {
    let baseUrl = seoSettings.canonicalBaseUrl;
    let today = nowToIsoDate();
    var xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
    xml #= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
    for (lang in ["sv", "fa"].vals()) {
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

  public query func getSeoSettings() : async SeoSettings {
    seoSettings
  };

  public func updateSeoSettings(token : Text, settings : SeoSettings) : async () {
    requireAuth(token);
    seoSettings := settings;
  };

  public query func getPageSeoOverride(slug : Text) : async ?PageSeoOverride {
    Map.get(pageOverrides, Text.compare, slug)
  };

  public func setPageSeoOverride(token : Text, override : PageSeoOverride) : async () {
    requireAuth(token);
    Map.add(pageOverrides, Text.compare, override.slug, override);
  };

  public func deletePageSeoOverride(token : Text, slug : Text) : async () {
    requireAuth(token);
    ignore Map.delete(pageOverrides, Text.compare, slug);
  };

  public query func listPageSeoOverrides(token : Text) : async [PageSeoOverride] {
    requireAuth(token);
    Iter.toArray(
      Iter.map<(Text, PageSeoOverride), PageSeoOverride>(
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

  public query func http_request(req : HttpRequest) : async HttpResponse {
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
