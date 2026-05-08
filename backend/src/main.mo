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
  type RegistrationRules = T.RegistrationRules;
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
    H.settingsToReturn(siteSettings, mockMode)
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
  ) : async SiteSettingsReturn {
    requireAuth(token);
    siteSettings := {
      logoUrl;
      title = { fa = title_fa; sv = title_sv };
      subtitle = { fa = subtitle_fa; sv = subtitle_sv };
      landingBackgroundUrl;
      topicsBackgroundUrl;
    };
    H.settingsToReturn(siteSettings, mockMode)
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
      }
    })
  };

  func buildRules(
    maxCapacity              : ?Nat,
    allowedPhones            : [Text],
    maxRegistrationsPerPhone : ?Nat,
    blockDuplicateEmail      : Bool,
  ) : ?RegistrationRules {
    if (maxCapacity == null and allowedPhones.size() == 0 and maxRegistrationsPerPhone == null and not blockDuplicateEmail) {
      null
    } else {
      ?{
        maxCapacity;
        allowedPhones;
        maxRegistrationsPerPhone;
        blockDuplicateEmail;
      }
    }
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
    customFormFields : [FormFieldReturn],
    actSessions : [EventSessionReturn],
    regMaxCapacity : ?Nat,
    regAllowedPhones : [Text],
    regMaxRegistrationsPerPhone : ?Nat,
    regBlockDuplicateEmail : Bool,
    sortOrder : Nat,
  ) : async ActivityReturn {
    requireAuth(token);
    let id = nextActivityId;
    nextActivityId += 1;
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
      customFormFields = buildFormFields(customFormFields);
      sessions = buildSessions(actSessions);
      registrationRules = buildRules(regMaxCapacity, regAllowedPhones, regMaxRegistrationsPerPhone, regBlockDuplicateEmail);
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
    customFormFields : [FormFieldReturn],
    actSessions : [EventSessionReturn],
    regMaxCapacity : ?Nat,
    regAllowedPhones : [Text],
    regMaxRegistrationsPerPhone : ?Nat,
    regBlockDuplicateEmail : Bool,
    sortOrder : Nat,
  ) : async ?ActivityReturn {
    requireAuth(token);
    switch (Map.get(activities, Nat.compare, id)) {
      case (?existing) {
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
          customFormFields = buildFormFields(customFormFields);
          sessions = buildSessions(actSessions);
          registrationRules = buildRules(regMaxCapacity, regAllowedPhones, regMaxRegistrationsPerPhone, regBlockDuplicateEmail);
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
        };
        Map.add(eventRegTemplates, Nat.compare, id, updated);
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
                ?Array.map<FormField, FormFieldReturn>(template.fields, H.fieldToReturn)
              };
              case null { null };
            }
          };
          case null { null };
        };
      };
      case null { null };
    }
  };

  // ─── Session availability helpers ─────────────────────────────────────────

  // Get all registrations for an activity as an array (for capacity computation)
  func regsForActivity(activityId : Nat) : [T.Registration] {
    Iter.toArray(
      Iter.map<(Nat, T.Registration), T.Registration>(
        Iter.filter<(Nat, T.Registration)>(
          Map.entries(registrations),
          func ((_, r)) { r.activityId == activityId }
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

  public func submitRegistration(
    activityId         : Nat,
    name               : Text,
    email              : Text,
    phone              : Text,
    message            : Text,
    personCount        : Nat,
    selectedSessionIds : [Nat],
    fieldValues        : [{ fieldId : Nat; value : Text }],
  ) : async SubmitRegistrationResult {
    // 1. Input size validation
    if (
      name.size() > maxNameLen or
      email.size() > maxEmailLen or
      phone.size() > maxPhoneLen or
      message.size() > maxMessageLen or
      fieldValues.size() > maxFieldValues or
      personCount < 1 or personCount > maxPersonCount or
      selectedSessionIds.size() > maxSessions
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

        let rules = activity.registrationRules;

        // 3. Phone whitelist
        switch (rules) {
          case (?r) {
            if (r.allowedPhones.size() > 0 and not arrayContainsText(r.allowedPhones, phone)) {
              return #phoneNotAllowed;
            };
          };
          case null {};
        };

        let actRegs = regsForActivity(activityId);

        // 4. Max registrations per phone
        switch (rules) {
          case (?r) {
            switch (r.maxRegistrationsPerPhone) {
              case (?maxPerPhone) {
                var phoneCount : Nat = 0;
                for (reg in actRegs.vals()) {
                  if (reg.phone == phone) { phoneCount += 1 };
                };
                if (phoneCount >= maxPerPhone) { return #maxRegistrationsReached };
              };
              case null {};
            };
          };
          case null {};
        };

        // 5. Duplicate email
        switch (rules) {
          case (?r) {
            if (r.blockDuplicateEmail) {
              for (reg in actRegs.vals()) {
                if (reg.email == email) { return #duplicateEmail };
              };
            };
          };
          case null {};
        };

        // 6. Overall capacity
        switch (rules) {
          case (?r) {
            switch (r.maxCapacity) {
              case (?cap) {
                if (actRegs.size() >= cap) { return #capacityFull };
              };
              case null {};
            };
          };
          case null {};
        };

        // 7. Per-session capacity check (only when sessions are selected)
        if (selectedSessionIds.size() > 0) {
          let failedSessionsBuf = List.empty<Nat>();
          for (sid in selectedSessionIds.vals()) {
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
              if (confirmed + buffer + personCount > sessionCap + sessionBuf) {
                failedSessionsBuf.add(sid);
              };
            };
          };
          if (failedSessionsBuf.size() > 0) {
            return #sessionsUnavailable(List.toArray(failedSessionsBuf));
          };
        };

        // 8. Store registration — use timestamp-based ID for uniqueness
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
          personCount;
          selectedSessions = snapshotSessions(selectedSessionIds, activity.sessions);
          fieldValues = resolvedFields;
          createdAt = Time.now();
        };
        Map.add(registrations, Nat.compare, id, reg);

        // 9. Compute statuses (reg is now in the map)
        let allRegsNow = regsForActivity(activityId);
        let statuses = H.computeSessionStatuses(allRegsNow, reg, activity.sessions, null);
        #ok(H.regToReturnWithStatus(reg, statuses))
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
            ?H.regToReturnWithStatus(reg, statuses)
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
  ) : async SubmitRegistrationResult {
    // Validate input sizes
    if (
      newPersonCount < 1 or newPersonCount > maxPersonCount or
      newSelectedSessionIds.size() > maxSessions or
      newFieldValues.size() > maxFieldValues
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

            let actRegs = regsForActivity(existing.activityId);

            // Per-session capacity check excluding the current registration
            if (newSelectedSessionIds.size() > 0) {
              let failedSessionsBuf = List.empty<Nat>();
              for (sid in newSelectedSessionIds.vals()) {
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
                  if (confirmed + buffer + newPersonCount > sessionCap + sessionBuf) {
                    failedSessionsBuf.add(sid);
                  };
                };
              };
              if (failedSessionsBuf.size() > 0) {
                return #sessionsUnavailable(List.toArray(failedSessionsBuf));
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
              personCount = newPersonCount;
              selectedSessions = snapshotSessions(newSelectedSessionIds, activity.sessions);
              fieldValues = resolvedFields;
              createdAt   = existing.createdAt;
            };
            Map.add(registrations, Nat.compare, id, updated);

            let allRegsNow = regsForActivity(existing.activityId);
            let statuses = H.computeSessionStatuses(allRegsNow, updated, activity.sessions, null);
            #ok(H.regToReturnWithStatus(updated, statuses))
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

  public query func getAllRegistrations(token : Text) : async [RegistrationReturn] {
    requireAuth(token);
    Iter.toArray(
      Iter.map<(Nat, T.Registration), RegistrationReturn>(
        Map.entries(registrations),
        func ((_, r)) { H.regToReturn(r) }
      )
    )
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

};
