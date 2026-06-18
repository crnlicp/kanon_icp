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
      perMember = switch (f.perMember) { case (?b) b; case null false };
      excludeFromCapacityWhenChecked = switch (f.excludeFromCapacityWhenChecked) {
        case (?b) b;
        case null false;
      };
      unique = switch (f.unique) { case (?b) b; case null false };
      allowedValues = switch (f.allowedValues) { case (?a) a; case null [] };
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
      minMembers = switch (t.minMembers) { case (?n) n; case null 1 };
      maxMembers = switch (t.maxMembers) { case (?n) n; case null 20 };
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
      perMemberMode  = switch (t.perMemberMode) { case (?b) b; case null false };
      perMemberSessionSelection = switch (t.perMemberSessionSelection) { case (?b) b; case null false };
      minMembers     = switch (t.minMembers) { case (?n) n; case null 1 };
      maxMembers     = switch (t.maxMembers) { case (?n) n; case null 20 };
    }
  };

  public func memberToReturn(m : T.RegistrationMember) : T.RegistrationMemberReturn {
    {
      countsTowardCapacity = m.countsTowardCapacity;
      values = Array.map<T.RegistrationFieldValue, T.RegistrationMemberValueReturn>(
        m.values,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      selectedSessions = [];
    }
  };

  // Variant used when per-member statuses have already been computed.
  public func memberToReturnWithStatus(
    m : T.RegistrationMember,
    statuses : [T.SessionStatusReturn],
  ) : T.RegistrationMemberReturn {
    {
      countsTowardCapacity = m.countsTowardCapacity;
      values = Array.map<T.RegistrationFieldValue, T.RegistrationMemberValueReturn>(
        m.values,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      selectedSessions = statuses;
    }
  };

  public func membersToReturn(m : ?[T.RegistrationMember]) : [T.RegistrationMemberReturn] {
    switch (m) {
      case (?arr) { Array.map<T.RegistrationMember, T.RegistrationMemberReturn>(arr, memberToReturn) };
      case null { [] };
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

  public func activityToReturn(a : T.Activity) : T.ActivityReturn {
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
      eventTemplateId = a.eventTemplateId;
      customFormFields = Array.map<T.FormField, T.FormFieldReturn>(a.customFormFields, fieldToReturn);
      sessions = Array.map<T.EventSession, T.EventSessionReturn>(a.sessions, sessionToReturn);
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
      archived = switch (r.archived) { case (?b) b; case null false };
      members = membersToReturn(r.members);
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
      message          = r.message;
      personCount      = r.personCount;
      selectedSessions = sessionStatuses;
      fieldValues      = Array.map<T.RegistrationFieldValue, { fieldId : Nat; fieldLabel : Text; value : Text }>(
        r.fieldValues,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      createdAt        = r.createdAt;
      archived         = switch (r.archived) { case (?b) b; case null false };
      members          = membersToReturn(r.members);
    }
  };

  // Variant that includes per-member session statuses. Use when the activity
  // is loaded so per-member capacity assignments can be computed.
  public func regToReturnWithStatusFull(
    r : T.Registration,
    sessionStatuses : [T.SessionStatusReturn],
    perMemberStatuses : [[T.SessionStatusReturn]],
  ) : T.RegistrationWithStatusReturn {
    let mems = switch (r.members) {
      case (?arr) {
        Array.tabulate<T.RegistrationMemberReturn>(arr.size(), func (i) {
          let st = if (i < perMemberStatuses.size()) perMemberStatuses[i] else [];
          memberToReturnWithStatus(arr[i], st)
        })
      };
      case null { [] };
    };
    {
      id               = r.id;
      activityId       = r.activityId;
      name             = r.name;
      email            = r.email;
      phone            = r.phone;
      message          = r.message;
      personCount      = r.personCount;
      selectedSessions = sessionStatuses;
      fieldValues      = Array.map<T.RegistrationFieldValue, { fieldId : Nat; fieldLabel : Text; value : Text }>(
        r.fieldValues,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
      createdAt        = r.createdAt;
      archived         = switch (r.archived) { case (?b) b; case null false };
      members          = mems;
    }
  };

  // Compute per-session statuses for a registration.
  // allRegsForActivity: all registrations for this activity (including the target).
  // excludeRegId: if set, exclude that reg from the "before" count (used for modify).
  //
  // For per-member-session registrations, each session's status is reported
  // as "buffer" if any of the registration's members for that session lands in
  // buffer; "confirmed" otherwise.
  public func computeSessionStatuses(
    allRegsForActivity : [T.Registration],
    targetReg          : T.Registration,
    sessions           : [T.EventSession],
    excludeRegId       : ?Nat,
  ) : [T.SessionStatusReturn] {
    let perMember = regUsesPerMemberSessions(targetReg);
    Array.map<T.RegistrationSessionSnapshot, T.SessionStatusReturn>(
      targetReg.selectedSessions,
      func (snap) {
        var cap : Nat = 0;
        var buf : Nat = 0;
        for (s in sessions.vals()) {
          if (s.id == snap.sessionId) {
            cap := s.capacity;
            buf := s.bufferCapacity;
          };
        };
        let running = sessionRunningBefore(allRegsForActivity, snap.sessionId, targetReg, excludeRegId);

        let status = if (perMember) {
          // Determine status for each counting member that is in this session;
          // any buffer assignment makes the aggregate status "buffer".
          var anyBuffer = false;
          var pos = running;
          switch (targetReg.members) {
            case (?ms) {
              for (m in ms.vals()) {
                if (m.countsTowardCapacity and memberInSession(targetReg, m, snap.sessionId)) {
                  if (pos >= cap) { anyBuffer := true };
                  pos += 1;
                };
              };
            };
            case null {};
          };
          if (anyBuffer) "buffer" else "confirmed"
        } else {
          // Atomic: whole personCount must fit within cap to be confirmed
          if (running + targetReg.personCount <= cap) "confirmed" else "buffer"
        };

        { sessionId = snap.sessionId; sessionName = snap.sessionName; status }
      }
    )
  };

  // Compute per-member statuses for each session that member is registered for.
  // Returned outer array matches `targetReg.members` order; inner arrays list
  // SessionStatusReturn for the member's effective session list (own list when
  // present; otherwise reg.selectedSessions).
  public func computePerMemberStatuses(
    allRegsForActivity : [T.Registration],
    targetReg          : T.Registration,
    sessions           : [T.EventSession],
    excludeRegId       : ?Nat,
  ) : [[T.SessionStatusReturn]] {
    switch (targetReg.members) {
      case null { [] };
      case (?ms) {
        // Pre-compute per-session running offset and (cap, buf), and an
        // ordered list of "counting in-session member indices" so each member
        // can be assigned the right slot.
        Array.tabulate<[T.SessionStatusReturn]>(ms.size(), func (mIdx) {
          let m = ms[mIdx];
          let sessList = switch (m.selectedSessions) {
            case (?ss) ss;
            case null targetReg.selectedSessions;
          };
          Array.map<T.RegistrationSessionSnapshot, T.SessionStatusReturn>(sessList, func (snap) {
            var cap : Nat = 0;
            for (s in sessions.vals()) {
              if (s.id == snap.sessionId) { cap := s.capacity };
            };
            let running = sessionRunningBefore(allRegsForActivity, snap.sessionId, targetReg, excludeRegId);
            // Position within target reg: count earlier counting members in this session.
            var pos = running;
            var i : Nat = 0;
            while (i < mIdx) {
              let earlier = ms[i];
              if (earlier.countsTowardCapacity and memberInSession(targetReg, earlier, snap.sessionId)) {
                pos += 1;
              };
              i += 1;
            };
            let status = if (not m.countsTowardCapacity) {
              // Members not counting toward capacity track the registration's
              // collective status instead; default to confirmed when no slot is needed.
              "confirmed"
            } else if (pos < cap) {
              "confirmed"
            } else {
              "buffer"
            };
            { sessionId = snap.sessionId; sessionName = snap.sessionName; status }
          })
        })
      };
    }
  };

  // Determine whether a registration uses per-member session selection.
  // Returns true if any of its members has its own selectedSessions list.
  public func regUsesPerMemberSessions(reg : T.Registration) : Bool {
    switch (reg.members) {
      case (?ms) {
        for (m in ms.vals()) {
          switch (m.selectedSessions) { case (?_) { return true }; case null {} };
        };
        false
      };
      case null { false };
    }
  };

  // How many slots a registration contributes to a given session, and whether
  // that contribution is atomic (whole personCount block — legacy mode) or
  // per-individual unit (per-member session selection).
  public func regSessionUnits(reg : T.Registration, sessionId : Nat) : { count : Nat; atomic : Bool } {
    if (regUsesPerMemberSessions(reg)) {
      var n : Nat = 0;
      switch (reg.members) {
        case (?ms) {
          for (m in ms.vals()) {
            if (m.countsTowardCapacity) {
              let sessList = switch (m.selectedSessions) {
                case (?ss) ss;
                case null reg.selectedSessions;
              };
              for (snap in sessList.vals()) {
                if (snap.sessionId == sessionId) { n += 1 };
              };
            };
          };
        };
        case null {};
      };
      return { count = n; atomic = false };
    };
    // Legacy / shared-sessions: whole personCount applies if reg has the session
    var has = false;
    for (snap in reg.selectedSessions.vals()) {
      if (snap.sessionId == sessionId) { has := true };
    };
    if (has) { { count = reg.personCount; atomic = true } } else { { count = 0; atomic = true } }
  };

  // Whether a particular member of a per-member-session registration is
  // signed up for the given session. For shared-sessions registrations, this
  // returns the registration-level membership.
  public func memberInSession(reg : T.Registration, member : T.RegistrationMember, sessionId : Nat) : Bool {
    let sessList = switch (member.selectedSessions) {
      case (?ss) ss;
      case null reg.selectedSessions;
    };
    for (snap in sessList.vals()) {
      if (snap.sessionId == sessionId) { return true };
    };
    false
  };

  // Compute (confirmed, buffer, atomicHardFail) for a single session, and
  // also return per-unit confirmed/buffer assignment so callers can map back
  // to individual members. running counts atomic blocks fully and per-unit
  // contributions one slot at a time.
  //
  // excludeRegId: if set, exclude that reg's contribution (used during modify
  // validation).
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
        let units = regSessionUnits(reg, sessionId);
        if (units.count > 0) {
          if (units.atomic) {
            if (running + units.count <= cap) {
              confirmed += units.count;
            } else if (running + units.count <= cap + buf) {
              buffer += units.count;
            };
            running += units.count;
          } else {
            var i : Nat = 0;
            while (i < units.count) {
              if (running < cap) { confirmed += 1 }
              else if (running < cap + buf) { buffer += 1 };
              running += 1;
              i += 1;
            };
          };
        };
      };
    };

    (confirmed, buffer)
  };

  // Compute the running offset (= total slots already taken before the
  // target reg arrives) for a given session. Used to derive per-member
  // statuses for the target without rebuilding the global counts.
  public func sessionRunningBefore(
    regsForActivity : [T.Registration],
    sessionId       : Nat,
    targetReg       : T.Registration,
    excludeRegId    : ?Nat,
  ) : Nat {
    let sorted = Array.sort<T.Registration>(
      regsForActivity,
      func (a, b) { Int.compare(a.createdAt, b.createdAt) }
    );
    var running : Nat = 0;
    label scan for (reg in sorted.vals()) {
      if (reg.id == targetReg.id) { break scan };
      let shouldSkip = switch (excludeRegId) {
        case (?eid) { reg.id == eid };
        case null   { false };
      };
      if (not shouldSkip) {
        let units = regSessionUnits(reg, sessionId);
        running += units.count;
      };
    };
    running
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
