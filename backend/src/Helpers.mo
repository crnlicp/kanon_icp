/// Pure conversion helpers: domain types → flat Candid return types.
import T "./Types";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  public func fieldTypeToText(ft : T.FormFieldType) : Text {
    switch (ft) {
      case (#text) { "text" };
      case (#textarea) { "textarea" };
      case (#email) { "email" };
      case (#phone) { "phone" };
      case (#number) { "number" };
      case (#select) { "select" };
      case (#radio) { "radio" };
      case (#checkbox) { "checkbox" };
      case (#date) { "date" };
    }
  };

  public func textToFieldType(t : Text) : T.FormFieldType {
    switch (t) {
      case ("textarea") { #textarea };
      case ("email") { #email };
      case ("phone") { #phone };
      case ("number") { #number };
      case ("select") { #select };
      case ("radio") { #radio };
      case ("checkbox") { #checkbox };
      case ("date") { #date };
      case (_) { #text };
    }
  };

  public func fieldToReturn(f : T.FormField) : T.FormFieldReturn {
    {
      id = f.id;
      fieldType = fieldTypeToText(f.fieldType);
      label_fa = f.fieldLabel.fa;
      label_sv = f.fieldLabel.sv;
      placeholder_fa = f.placeholder.fa;
      placeholder_sv = f.placeholder.sv;
      required = f.required;
      options = Array.map<T.LocalizedText, { fa : Text; sv : Text }>(
        f.options,
        func (o) { { fa = o.fa; sv = o.sv } }
      );
      sortOrder = f.sortOrder;
      isLookupField = f.isLookupField;
      minValue = f.minValue;
      maxValue = f.maxValue;
    }
  };

  public func templateToReturn(t : T.FormTemplate) : T.FormTemplateReturn {
    {
      id = t.id;
      name_fa = t.name.fa;
      name_sv = t.name.sv;
      description_fa = t.description.fa;
      description_sv = t.description.sv;
      fields = Array.map<T.FormField, T.FormFieldReturn>(t.fields, fieldToReturn);
      createdAt = t.createdAt;
    }
  };

  public func eventRegTemplateToReturn(t : T.EventRegistrationTemplate) : T.EventRegistrationTemplateReturn {
    {
      id             = t.id;
      name_fa        = t.name.fa;
      name_sv        = t.name.sv;
      description_fa = t.description.fa;
      description_sv = t.description.sv;
      sessions       = Array.map<T.EventSession, T.EventSessionReturn>(t.sessions, sessionToReturn);
      fields         = Array.map<T.FormField, T.FormFieldReturn>(t.fields, fieldToReturn);
      createdAt      = t.createdAt;
    }
  };

  public func topicToReturn(t : T.Topic) : T.TopicReturn {
    {
      id = t.id;
      slug = t.slug;
      title_fa = t.title.fa;
      title_sv = t.title.sv;
      description_fa = t.description.fa;
      description_sv = t.description.sv;
      icon = t.icon;
      backgroundUrl = t.backgroundUrl;
      sortOrder = t.sortOrder;
      createdAt = t.createdAt;
    }
  };

  public func slideToReturn(s : T.HeroSlide) : T.HeroSlideReturn {
    {
      id = s.id;
      topicId = s.topicId;
      imageUrl = s.imageUrl;
      title_fa = s.title.fa;
      title_sv = s.title.sv;
      subtitle_fa = s.subtitle.fa;
      subtitle_sv = s.subtitle.sv;
      ctaText_fa = s.ctaText.fa;
      ctaText_sv = s.ctaText.sv;
      ctaLink = s.ctaLink;
      sortOrder = s.sortOrder;
    }
  };

  public func sessionToReturn(s : T.EventSession) : T.EventSessionReturn {
    {
      id             = s.id;
      name_fa        = s.name.fa;
      name_sv        = s.name.sv;
      date           = s.date;
      capacity       = s.capacity;
      bufferCapacity = s.bufferCapacity;
      sortOrder      = s.sortOrder;
    }
  };

  func rulesDefaults() : (capacity : ?Nat, phones : [Text], maxPerPhone : ?Nat, blockEmail : Bool) {
    (null, [], null, false)
  };

  public func activityToReturn(a : T.Activity) : T.ActivityReturn {
    let (regMaxCapacity, regAllowedPhones, regMaxRegistrationsPerPhone, regBlockDuplicateEmail) =
      switch (a.registrationRules) {
        case (?r) { (r.maxCapacity, r.allowedPhones, r.maxRegistrationsPerPhone, r.blockDuplicateEmail) };
        case null  { rulesDefaults() };
      };
    let highlighted = switch (a.highlighted) {
      case (?b) { b };
      case null  { false };
    };
    {
      id = a.id;
      topicId = a.topicId;
      slug = a.slug;
      title_fa = a.title.fa;
      title_sv = a.title.sv;
      excerpt_fa = a.excerpt.fa;
      excerpt_sv = a.excerpt.sv;
      body_fa = a.body.fa;
      body_sv = a.body.sv;
      icon = a.icon;
      imageUrl = a.imageUrl;
      hasRegistration = a.hasRegistration;
      registrationMode = a.registrationMode;
      formTemplateId = a.formTemplateId;
      customFormFields = Array.map<T.FormField, T.FormFieldReturn>(a.customFormFields, fieldToReturn);
      sessions = Array.map<T.EventSession, T.EventSessionReturn>(a.sessions, sessionToReturn);
      regMaxCapacity;
      regAllowedPhones;
      regMaxRegistrationsPerPhone;
      regBlockDuplicateEmail;
      highlighted;
      sortOrder = a.sortOrder;
      createdAt = a.createdAt;
    }
  };

  // Admin registration list (no status computation — raw snapshot data)
  public func regToReturn(r : T.Registration) : T.RegistrationReturn {
    {
      id = r.id;
      activityId = r.activityId;
      name = r.name;
      email = r.email;
      phone = r.phone;
      message = r.message;
      personCount = r.personCount;
      selectedSessions = Array.map<T.RegistrationSessionSnapshot, { sessionId : Nat; sessionName : Text }>(
        r.selectedSessions,
        func (ss) { { sessionId = ss.sessionId; sessionName = ss.sessionName } }
      );
      fieldValues = Array.map<T.RegistrationFieldValue, T.RegistrationFieldValueReturn>(
        r.fieldValues,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      createdAt = r.createdAt;
    }
  };

  // Registration with dynamically computed per-session statuses
  public func regToReturnWithStatus(
    r : T.Registration,
    sessionStatuses : [T.SessionStatusReturn],
  ) : T.RegistrationWithStatusReturn {
    {
      id               = r.id;
      activityId       = r.activityId;
      name             = r.name;
      email            = r.email;
      phone            = r.phone;
      personCount      = r.personCount;
      selectedSessions = sessionStatuses;
      fieldValues      = Array.map<T.RegistrationFieldValue, { fieldId : Nat; fieldLabel : Text; value : Text }>(
        r.fieldValues,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      createdAt        = r.createdAt;
    }
  };

  // Compute per-session statuses for a registration.
  // allRegsForActivity: all registrations for this activity (including the target).
  // excludeRegId: if set, exclude that reg from the "before" count (used for modify).
  public func computeSessionStatuses(
    allRegsForActivity : [T.Registration],
    targetReg          : T.Registration,
    sessions           : [T.EventSession],
    excludeRegId       : ?Nat,
  ) : [T.SessionStatusReturn] {
    // Sort registrations by createdAt ascending (first-come-first-served)
    let sorted = Array.sort<T.Registration>(
      allRegsForActivity,
      func (a, b) { Int.compare(a.createdAt, b.createdAt) }
    );

    Array.map<T.RegistrationSessionSnapshot, T.SessionStatusReturn>(
      targetReg.selectedSessions,
      func (snap) {
        // Find capacity info for this session
        var cap : Nat = 0;
        var buf : Nat = 0;
        for (s in sessions.vals()) {
          if (s.id == snap.sessionId) {
            cap := s.capacity;
            buf := s.bufferCapacity;
          };
        };

        // Count people registered for this session BEFORE the target (by arrival time)
        var before : Nat = 0;
        for (reg in sorted.vals()) {
          // Skip the excluded reg (used in modify to not count the old version)
          let shouldSkip = switch (excludeRegId) {
            case (?eid) { reg.id == eid };
            case null   { false };
          };
          // Only count regs that arrived before the target and include this session
          if (not shouldSkip and reg.id != targetReg.id and reg.createdAt <= targetReg.createdAt) {
            for (ss in reg.selectedSessions.vals()) {
              if (ss.sessionId == snap.sessionId) {
                before += reg.personCount;
              };
            };
          };
        };

        let status = if (before + targetReg.personCount <= cap) {
          "confirmed"
        } else {
          "buffer"
        };

        { sessionId = snap.sessionId; sessionName = snap.sessionName; status }
      }
    )
  };

  // Compute (confirmedCount, bufferCount) for a session from a list of registrations.
  // excludeRegId: if set, exclude that reg's contribution (used during modify validation).
  public func computeSessionCounts(
    regsForActivity : [T.Registration],
    sessionId       : Nat,
    cap             : Nat,
    buf             : Nat,
    excludeRegId    : ?Nat,
  ) : (Nat, Nat) {
    let sorted = Array.sort<T.Registration>(
      regsForActivity,
      func (a, b) { Int.compare(a.createdAt, b.createdAt) }
    );

    var running : Nat = 0;
    var confirmed : Nat = 0;
    var buffer : Nat = 0;

    for (reg in sorted.vals()) {
      let shouldSkip = switch (excludeRegId) {
        case (?eid) { reg.id == eid };
        case null   { false };
      };
      if (not shouldSkip) {
        var hasSession = false;
        for (ss in reg.selectedSessions.vals()) {
          if (ss.sessionId == sessionId) { hasSession := true };
        };
        if (hasSession) {
          if (running + reg.personCount <= cap) {
            confirmed += reg.personCount;
          } else if (running + reg.personCount <= cap + buf) {
            buffer += reg.personCount;
          };
          running += reg.personCount;
        };
      };
    };

    (confirmed, buffer)
  };

  public func socialToReturn(s : T.SocialLink) : T.SocialLinkReturn {
    {
      id = s.id;
      platform = s.platform;
      url = s.url;
      sortOrder = s.sortOrder;
    }
  };

  public func settingsToReturn(s : T.SiteSettings, mock : Bool, contactIntro : T.LocalizedText) : T.SiteSettingsReturn {
    {
      logoUrl = s.logoUrl;
      title_fa = s.title.fa;
      title_sv = s.title.sv;
      subtitle_fa = s.subtitle.fa;
      subtitle_sv = s.subtitle.sv;
      landingBackgroundUrl = s.landingBackgroundUrl;
      topicsBackgroundUrl = s.topicsBackgroundUrl;
      contactIntro_fa = contactIntro.fa;
      contactIntro_sv = contactIntro.sv;
      mockMode = mock;
    }
  };

  public func aboutToReturn(a : T.AboutContent) : T.AboutContentReturn {
    {
      headerImageUrl = a.headerImageUrl;
      body_fa = a.body.fa;
      body_sv = a.body.sv;
    }
  };

  public func contactMsgToReturn(c : T.ContactMessage) : T.ContactMessageReturn {
    {
      id = c.id;
      name = c.name;
      email = c.email;
      phone = c.phone;
      message = c.message;
      createdAt = c.createdAt;
    }
  };

}
