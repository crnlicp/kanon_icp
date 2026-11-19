/// Registration forms, session capacity, submit/lookup/modify/cancel and admin queries.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";
import Limits "../lib/Limits";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  activities : Map.Map<Nat, T.Activity>,
  registrations : Map.Map<Nat, T.Registration>,
  sessionJoinedAt : Map.Map<Nat, [T.SessionJoinedRecord]>,
  formTemplates : Map.Map<Nat, T.FormTemplate>,
  eventRegTemplates : Map.Map<Nat, T.EventRegistrationTemplate>,
) {



  // ─── T.Activity Form Fields Resolution ──────────────────────────────────

  public query func getActivityFormFields(activityId : Nat) : async ?[T.FormFieldReturn] {
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        if (not activity.hasRegistration) {
          return null;
        };
        if (activity.customFormFields.size() > 0) {
          return ?Array.map<T.FormField, T.FormFieldReturn>(activity.customFormFields, H.fieldToReturn);
        };
        switch (activity.formTemplateId) {
          case (?tid) {
            switch (Map.get(formTemplates, Nat.compare, tid)) {
              case (?template) {
                return ?Array.map<T.FormField, T.FormFieldReturn>(template.fields, H.fieldToReturn)
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
                return ?Array.map<T.FormField, T.FormFieldReturn>(template.fields, H.fieldToReturn)
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
          sharedFields    = Array.map<T.FormField, T.FormFieldReturn>(pm.sharedFields, H.fieldToReturn);
          perMemberFields = Array.map<T.FormField, T.FormFieldReturn>(pm.perMemberFields, H.fieldToReturn);
          sessions        = Array.map<T.EventSession, T.EventSessionReturn>(activity.sessions, H.sessionToReturn);
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

  // Lookup callback passed to capacity helpers. Returns the explicit
  // joinedAt for (regId, sessionId, memberIndex?) from the side-map, or
  // null when no override is recorded (helpers then fall back to
  // reg.createdAt for that slot, preserving legacy behavior for
  // pre-existing registrations).
  func joinedAtLookup(regId : Nat, sessionId : Nat, memberIndex : ?Nat) : ?Int {
    switch (Map.get(sessionJoinedAt, Nat.compare, regId)) {
      case (?recs) {
        for (r in recs.values()) {
          if (r.sessionId == sessionId) {
            let memberMatch = switch (r.memberIndex, memberIndex) {
              case (null, null) { true };
              case (?a, ?b) { a == b };
              case _ { false };
            };
            if (memberMatch) { return ?r.joinedAt };
          };
        };
        null
      };
      case null { null };
    }
  };

  // Compute T.SessionAvailabilityReturn for each session of an activity
  func computeAvailability(activity : T.Activity) : [T.SessionAvailabilityReturn] {
    let actRegs = regsForActivity(activity.id);
    Array.map<T.EventSession, T.SessionAvailabilityReturn>(activity.sessions, func (s) {
      let (confirmed, buffer) = H.computeSessionCounts(actRegs, s.id, s.capacity, s.bufferCapacity, null, joinedAtLookup);
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

  public query func getSessionAvailability(activityId : Nat) : async [T.SessionAvailabilityReturn] {
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) { computeAvailability(activity) };
      case null { [] };
    }
  };

  public query func getSessionStats(token : Text, activityId : Nat) : async [T.SessionStatsReturn] {
    Auth.requireAuth(auth, token);
    switch (Map.get(activities, Nat.compare, activityId)) {
      case (?activity) {
        let actRegs = regsForActivity(activityId);
        Array.map<T.EventSession, T.SessionStatsReturn>(activity.sessions, func (s) {
          let (confirmed, buffer) = H.computeSessionCounts(actRegs, s.id, s.capacity, s.bufferCapacity, null, joinedAtLookup);
          // Count distinct registration records for this session
          var regCount : Nat = 0;
          for (reg in actRegs.values()) {
            for (ss in reg.selectedSessions.values()) {
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


  // Check if a text value is in an array (case-sensitive)
  func arrayContainsText(arr : [Text], val : Text) : Bool {
    for (t in arr.values()) {
      if (t == val) { return true };
    };
    false
  };

  // Check if a Nat is in an array
  func arrayContainsNat(arr : [Nat], val : Nat) : Bool {
    for (n in arr.values()) {
      if (n == val) { return true };
    };
    false
  };

  // Snapshot session names from activity.sessions for the given IDs.
  func snapshotSessions(
    sessionIds : [Nat],
    actSessions : [T.EventSession],
  ) : [T.RegistrationSessionSnapshot] {
    Array.map<Nat, T.RegistrationSessionSnapshot>(sessionIds, func (sid) {
      var name = "Session " # Nat.toText(sid);
      for (s in actSessions.values()) {
        if (s.id == sid) { name := s.name.fa # " / " # s.name.sv };
      };
      { sessionId = sid; sessionName = name }
    })
  };

  // ─── Per-member mode helpers ──────────────────────────────────────────────

  // Resolve whether an activity uses per-member mode + the field split. Only
  // event-template-bound activities can enable per-member mode; activity-level
  // event-custom mode keeps the legacy single-counter behavior.
  func resolveActivityPerMemberConfig(activity : T.Activity) : {
    enabled         : Bool;
    perMemberSessionSelection : Bool;
    minMembers      : Nat;
    maxMembers      : Nat;
    sharedFields    : [T.FormField];
    perMemberFields : [T.FormField];
  } {
    let allFields = resolveActivityFields(activity);
    var enabled = false;
    var perMemberSessions = false;
    var minM : Nat = 1;
    var maxM : Nat = Limits.maxPersonCount;
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
                else if (n > Limits.maxPersonCount) Limits.maxPersonCount
                else n
              };
              case null { Limits.maxPersonCount };
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
                    else if (n > Limits.maxPersonCount) Limits.maxPersonCount
                    else n
                  };
                  case null { Limits.maxPersonCount };
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

    let perBuf = List.empty<T.FormField>();
    let sharedBuf = List.empty<T.FormField>();
    for (f in allFields.values()) {
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
    perMemberFields : [T.FormField],
    sessionIds      : ?[Nat],
    actSessions     : [T.EventSession],
  ) : T.RegistrationMember {
    let values = Array.map<{ fieldId : Nat; value : Text }, T.RegistrationFieldValue>(
      memberValues,
      func (fv) {
        var resolvedLabel = "Field " # Nat.toText(fv.fieldId);
        for (pf in perMemberFields.values()) {
          if (pf.id == fv.fieldId) {
            resolvedLabel := pf.fieldLabel.fa # " / " # pf.fieldLabel.sv;
          };
        };
        { fieldId = fv.fieldId; fieldLabel = resolvedLabel; value = fv.value }
      }
    );
    var counts = true;
    for (pf in perMemberFields.values()) {
      let exclude = switch (pf.excludeFromCapacityWhenChecked) { case (?b) b; case null false };
      if (exclude) {
        for (mv in memberValues.values()) {
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
    for (m in members.values()) {
      if (m.countsTowardCapacity) { n += 1 };
    };
    n
  };

  // Validate per-member submission shape (sizes + required fields).
  // memberSessionIds parallels membersInput; null = no per-member sessions.
  func validateMembers(
    membersInput     : [[{ fieldId : Nat; value : Text }]],
    memberSessionIds : ?[[Nat]],
    perMemberFields  : [T.FormField],
    perMemberSessions : Bool,
    minMembers       : Nat,
    maxMembers       : Nat,
  ) : Bool {
    let n = membersInput.size();
    if (n < minMembers or n > maxMembers or n > Limits.maxPersonCount) { return false };
    for (m in membersInput.values()) {
      if (m.size() > Limits.maxFieldValues) { return false };
      for (fv in m.values()) {
        if (fv.value.size() > Limits.maxFieldValueLen) { return false };
      };
      for (pf in perMemberFields.values()) {
        if (pf.required) {
          var ok = false;
          for (fv in m.values()) {
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
        for (sl in ids.values()) {
          if (sl.size() > Limits.maxSessions) { return false };
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
  ) : async T.SubmitRegistrationResult {
    // 1. Input size validation
    if (
      name.size() > Limits.maxNameLen or
      email.size() > Limits.maxEmailLen or
      phone.size() > Limits.maxPhoneLen or
      message.size() > Limits.maxMessageLen or
      fieldValues.size() > Limits.maxFieldValues or
      personCount < 1 or personCount > Limits.maxPersonCount or
      selectedSessionIds.size() > Limits.maxSessions or
      members.size() > Limits.maxPersonCount
    ) {
      return #invalidInput;
    };
    for (fv in fieldValues.values()) {
      if (fv.value.size() > Limits.maxFieldValueLen) { return #invalidInput };
    };

    // 2. T.Activity check
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
              for (sl in ids.values()) {
                for (sid in sl.values()) {
                  var found = false;
                  for (s in activity.sessions.values()) {
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
          if (eff > Limits.maxPersonCount) { return #invalidInput };
          effectivePersonCount := eff;
          resolvedMembers := ?rms;
          // Derive top-level session list from the union of all member lists
          // (per-member-session mode). Maintain insertion order, deduped.
          if (pmConfig.perMemberSessionSelection) {
            let unionBuf = List.empty<Nat>();
            switch (memberSessionIds) {
              case (?ids) {
                for (sl in ids.values()) {
                  for (sid in sl.values()) {
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
        for (f in activityFields.values()) {
          let allowed = switch (f.allowedValues) { case (?a) a; case null [] };
          if (allowed.size() > 0) {
            var submittedValue : ?Text = null;
            for (fv in fieldValues.values()) {
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
        for (f in activityFields.values()) {
          let isUnique = switch (f.unique) { case (?b) b; case null false };
          if (isUnique) {
            var submittedValue : ?Text = null;
            for (fv in fieldValues.values()) {
              if (fv.fieldId == f.id) { submittedValue := ?fv.value };
            };
            switch (submittedValue) {
              case (?v) {
                if (v.size() > 0) {
                  label dupLoop for (reg in actRegs.values()) {
                    for (rfv in reg.fieldValues.values()) {
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
          for (sid in effectiveSessionIds.values()) {
            var sessionCap : Nat = 0;
            var sessionBuf : Nat = 0;
            var sessionFound = false;
            for (s in activity.sessions.values()) {
              if (s.id == sid) {
                sessionCap := s.capacity;
                sessionBuf := s.bufferCapacity;
                sessionFound := true;
              };
            };
            if (sessionFound) {
              let (confirmed, buffer) = H.computeSessionCounts(actRegs, sid, sessionCap, sessionBuf, null, joinedAtLookup);
              // Determine how many slots THIS submission needs for this session.
              var needed : Nat = effectivePersonCount;
              if (pmConfig.enabled and pmConfig.perMemberSessionSelection) {
                needed := 0;
                switch (memberSessionIds, resolvedMembers) {
                  case (?ids, ?rms) {
                    var i : Nat = 0;
                    while (i < ids.size()) {
                      if (i < rms.size() and rms[i].countsTowardCapacity) {
                        for (s in ids[i].values()) {
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
        let id = if (tsId > counters.nextRegistrationId) tsId else counters.nextRegistrationId + 1;
        counters.nextRegistrationId := id;

        let resolvedFields = Array.map<{ fieldId : Nat; value : Text }, T.RegistrationFieldValue>(
          fieldValues,
          func (fv) {
            var resolvedLabel = "Field " # Nat.toText(fv.fieldId);
            var found = false;
            for (cf in activity.customFormFields.values()) {
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
                      for (tf in template.fields.values()) {
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
                      for (tf in template.fields.values()) {
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
        let statuses = H.computeSessionStatuses(allRegsNow, reg, activity.sessions, null, joinedAtLookup);
        let perMemberStatuses = H.computePerMemberStatuses(allRegsNow, reg, activity.sessions, null, joinedAtLookup);
        #ok(H.regToReturnWithStatusFull(reg, statuses, perMemberStatuses))
      };
      case null { #registrationDisabled };
    }
  };

  // ─── Public T.Registration Lookup / Modify / Cancel ─────────────────────────

  // Resolve the effective form fields for an activity (custom > template > none)
  func resolveActivityFields(activity : T.Activity) : [T.FormField] {
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
  func verifyLookup(reg : T.Registration, activity : ?T.Activity, lookupValue : Text) : Bool {
    switch (activity) {
      case (?act) {
        let fields = resolveActivityFields(act);
        for (f in fields.values()) {
          if (f.isLookupField) {
            // Check if any fieldValue matches
            for (fv in reg.fieldValues.values()) {
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

  public query func getRegistrationById(id : Nat, lookupValue : Text) : async ?T.RegistrationWithStatusReturn {
    switch (Map.get(registrations, Nat.compare, id)) {
      case (?reg) {
        let actOpt = Map.get(activities, Nat.compare, reg.activityId);
        if (not verifyLookup(reg, actOpt, lookupValue)) { return null };
        switch (actOpt) {
          case (?activity) {
            let actRegs = regsForActivity(reg.activityId);
            let statuses = H.computeSessionStatuses(actRegs, reg, activity.sessions, null, joinedAtLookup);
            let perMemberStatuses = H.computePerMemberStatuses(actRegs, reg, activity.sessions, null, joinedAtLookup);
            ?H.regToReturnWithStatusFull(reg, statuses, perMemberStatuses)
          };
          case null {
            // T.Activity was deleted — return without status
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
        ignore Map.delete(sessionJoinedAt, Nat.compare, id);
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
  ) : async T.SubmitRegistrationResult {
    // Validate input sizes
    if (
      newPersonCount < 1 or newPersonCount > Limits.maxPersonCount or
      newSelectedSessionIds.size() > Limits.maxSessions or
      newFieldValues.size() > Limits.maxFieldValues or
      newMembers.size() > Limits.maxPersonCount
    ) {
      return #invalidInput;
    };
    for (fv in newFieldValues.values()) {
      if (fv.value.size() > Limits.maxFieldValueLen) { return #invalidInput };
    };

    switch (Map.get(registrations, Nat.compare, id)) {
      case (?existing) {
        let actOpt = Map.get(activities, Nat.compare, existing.activityId);
        if (not verifyLookup(existing, actOpt, lookupValue)) { return #invalidInput };

        switch (actOpt) {
          case (?activity) {
            if (not activity.hasRegistration) { return #registrationDisabled };

            // Timestamp used for any session that is being added to the
            // registration during this edit. Kept sessions retain their
            // previously stored joinedAt so their queue position is
            // preserved.
            let modifyNow : Int = Time.now();

            // Snapshot of previously stored joinedAt records for this
            // registration (side-map lookup). Used below to decide which
            // sessions are "kept" (preserve joinedAt) vs "newly added"
            // (stamped with modifyNow).
            let prevJoinedRecords : [T.SessionJoinedRecord] =
              switch (Map.get(sessionJoinedAt, Nat.compare, existing.id)) {
                case (?recs) recs;
                case null []
              };
            let prevTopJoinedAt = func (sid : Nat) : ?Int {
              for (r in prevJoinedRecords.values()) {
                if (r.memberIndex == null and r.sessionId == sid) {
                  return ?r.joinedAt;
                };
              };
              // No prior record — if the session was already on the
              // registration (legacy submission before the side-map
              // existed), keep its position by treating it as joined at
              // the original createdAt.
              for (snap in existing.selectedSessions.values()) {
                if (snap.sessionId == sid) { return ?existing.createdAt };
              };
              null
            };
            let prevMemberJoinedAt = func (mIdx : Nat, sid : Nat) : ?Int {
              for (r in prevJoinedRecords.values()) {
                switch (r.memberIndex) {
                  case (?i) {
                    if (i == mIdx and r.sessionId == sid) {
                      return ?r.joinedAt;
                    };
                  };
                  case null {};
                };
              };
              // Legacy fallback: if existing.members[mIdx] already had this
              // session, retain its original queue position.
              switch (existing.members) {
                case (?ms) {
                  if (mIdx < ms.size()) {
                    let sessList = switch (ms[mIdx].selectedSessions) {
                      case (?ss) ss;
                      case null existing.selectedSessions;
                    };
                    for (snap in sessList.values()) {
                      if (snap.sessionId == sid) { return ?existing.createdAt };
                    };
                  };
                };
                case null {};
              };
              null
            };

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
                  for (sl in ids.values()) {
                    for (sid in sl.values()) {
                      var found = false;
                      for (s in activity.sessions.values()) {
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
              if (eff > Limits.maxPersonCount) { return #invalidInput };
              effectivePersonCount := eff;
              resolvedMembers := ?rms;
              if (pmConfig.perMemberSessionSelection) {
                let unionBuf = List.empty<Nat>();
                switch (newMemberSessionIds) {
                  case (?ids) {
                    for (sl in ids.values()) {
                      for (sid in sl.values()) {
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
            for (f in activityFields.values()) {
              let allowed = switch (f.allowedValues) { case (?a) a; case null [] };
              if (allowed.size() > 0) {
                var submittedValue : ?Text = null;
                for (fv in newFieldValues.values()) {
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
              for (sid in effectiveSessionIds.values()) {
                var sessionCap : Nat = 0;
                var sessionBuf : Nat = 0;
                var sessionFound = false;
                for (s in activity.sessions.values()) {
                  if (s.id == sid) {
                    sessionCap := s.capacity;
                    sessionBuf := s.bufferCapacity;
                    sessionFound := true;
                  };
                };
                if (sessionFound) {
                  let (confirmed, buffer) = H.computeSessionCounts(actRegs, sid, sessionCap, sessionBuf, ?id, joinedAtLookup);
                  var needed : Nat = effectivePersonCount;
                  if (pmConfig.enabled and pmConfig.perMemberSessionSelection) {
                    needed := 0;
                    switch (newMemberSessionIds, resolvedMembers) {
                      case (?ids, ?rms) {
                        var i : Nat = 0;
                        while (i < ids.size()) {
                          if (i < rms.size() and rms[i].countsTowardCapacity) {
                            for (s in ids[i].values()) {
                              if (s == sid) { needed += 1 };
                            };
                          };
                          i += 1;
                        };
                      };
                      case _ {};
                    };
                  };
                  // Slots this registration already occupies in this session.
                  // Kept slots retain their original queue position; only the
                  // delta (newly added slots) is treated as arriving "now" and
                  // must obey the current capacity / buffer limits.
                  let previousNeeded : Nat = H.regSessionUnits(existing, sid).count;
                  let addedSlots : Nat = if (needed > previousNeeded) {
                    needed - previousNeeded : Nat
                  } else { 0 };
                  if (confirmed + buffer + needed > sessionCap + sessionBuf) {
                    // No room even in the waiting list for the new total.
                    hardFailBuf.add(sid);
                  } else if (addedSlots > 0 and confirmed + buffer + addedSlots > sessionCap) {
                    // Newly added slots would land beyond the regular
                    // capacity — require explicit buffer acceptance. Kept
                    // slots are not re-prompted because they retain their
                    // original position.
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
                for (cf in activity.customFormFields.values()) {
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

            // Rebuild the side-map of join times for this registration so
            // sessions / members added during this edit land at the end of
            // the per-session waitlist while everything else keeps its
            // original queue position.
            let newJoinedRecords = List.empty<T.SessionJoinedRecord>();
            for (sid in effectiveSessionIds.values()) {
              let ja : Int = switch (prevTopJoinedAt(sid)) {
                case (?t) t;
                case null modifyNow;
              };
              newJoinedRecords.add({ sessionId = sid; memberIndex = null; joinedAt = ja });
            };
            switch (resolvedMembers) {
              case (?ms) {
                var mIdx : Nat = 0;
                while (mIdx < ms.size()) {
                  switch (ms[mIdx].selectedSessions) {
                    case (?snaps) {
                      for (snap in snaps.values()) {
                        let ja : Int = switch (prevMemberJoinedAt(mIdx, snap.sessionId)) {
                          case (?t) t;
                          case null modifyNow;
                        };
                        newJoinedRecords.add({
                          sessionId   = snap.sessionId;
                          memberIndex = ?mIdx;
                          joinedAt    = ja;
                        });
                      };
                    };
                    case null {};
                  };
                  mIdx += 1;
                };
              };
              case null {};
            };
            Map.add(sessionJoinedAt, Nat.compare, id, List.toArray(newJoinedRecords));

            let allRegsNow = regsForActivity(existing.activityId);
            let statuses = H.computeSessionStatuses(allRegsNow, updated, activity.sessions, null, joinedAtLookup);
            let perMemberStatuses = H.computePerMemberStatuses(allRegsNow, updated, activity.sessions, null, joinedAtLookup);
            #ok(H.regToReturnWithStatusFull(updated, statuses, perMemberStatuses))
          };
          case null { #registrationDisabled };
        }
      };
      case null { #invalidInput };
    }
  };

  // ─── Admin T.Registration Queries ───────────────────────────────────────────

  public query func getRegistrations(token : Text, activityId : Nat) : async [T.RegistrationReturn] {
    Auth.requireAuth(auth, token);
    Iter.toArray(
      Iter.map<(Nat, T.Registration), T.RegistrationReturn>(
        Iter.filter<(Nat, T.Registration)>(
          Map.entries(registrations),
          func ((_, r)) { r.activityId == activityId }
        ),
        func ((_, r)) { H.regToReturn(r) }
      )
    )
  };

  public query func getRegistrationsWithStatus(token : Text, activityId : Nat) : async [T.RegistrationWithStatusReturn] {
    Auth.requireAuth(auth, token);
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
        Array.map<T.Registration, T.RegistrationWithStatusReturn>(
          actRegs,
          func (r) {
            let statuses = H.computeSessionStatuses(nonArchived, r, activity.sessions, null, joinedAtLookup);
            let perMemberStatuses = H.computePerMemberStatuses(nonArchived, r, activity.sessions, null, joinedAtLookup);
            H.regToReturnWithStatusFull(r, statuses, perMemberStatuses)
          }
        )
      };
      case null { [] };
    }
  };

  public query func getAllRegistrations(token : Text) : async [T.RegistrationReturn] {
    Auth.requireAuth(auth, token);
    Iter.toArray(
      Iter.map<(Nat, T.Registration), T.RegistrationReturn>(
        Map.entries(registrations),
        func ((_, r)) { H.regToReturn(r) }
      )
    )
  };

  public func setRegistrationArchived(token : Text, id : Nat, archived : Bool) : async Bool {
    Auth.requireAuth(auth, token);
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


};
