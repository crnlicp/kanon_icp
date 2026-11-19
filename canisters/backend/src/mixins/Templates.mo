/// Form templates and event registration templates.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import List "mo:core/List";

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";
import Builders "../lib/Builders";
import RegLib "../lib/Registrations";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  activities : Map.Map<Nat, T.Activity>,
  registrations : Map.Map<Nat, T.Registration>,
  formTemplates : Map.Map<Nat, T.FormTemplate>,
  eventRegTemplates : Map.Map<Nat, T.EventRegistrationTemplate>,
) {



  // ─── Form Templates CRUD ────────────────────────────────────────────────

  public query func getFormTemplates() : async [T.FormTemplateReturn] {
    Iter.toArray(
      Iter.map<(Nat, T.FormTemplate), T.FormTemplateReturn>(
        Map.entries(formTemplates),
        func ((_, t)) { H.templateToReturn(t) }
      )
    )
  };

  public query func getFormTemplate(id : Nat) : async ?T.FormTemplateReturn {
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
    fields : [T.FormFieldReturn],
    minMembers : Nat,
    maxMembers : Nat,
  ) : async T.FormTemplateReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextFormTemplateId;
    counters.nextFormTemplateId += 1;
    let template : T.FormTemplate = {
      id;
      name = { fa = name_fa; sv = name_sv };
      description = { fa = description_fa; sv = description_sv };
      fields = Builders.buildFormFields(fields);
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
    fields : [T.FormFieldReturn],
    minMembers : Nat,
    maxMembers : Nat,
  ) : async ?T.FormTemplateReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(formTemplates, Nat.compare, id)) {
      case (?existing) {
        let updated : T.FormTemplate = {
          id;
          name = { fa = name_fa; sv = name_sv };
          description = { fa = description_fa; sv = description_sv };
          fields = Builders.buildFormFields(fields);
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
    Auth.requireAuth(auth, token);
    switch (Map.get(formTemplates, Nat.compare, id)) {
      case (?_) { ignore Map.delete(formTemplates, Nat.compare, id); true };
      case null { false };
    }
  };

  // ─── Event T.Registration Templates CRUD ───────────────────────────────────

  public query func getEventRegistrationTemplates() : async [T.EventRegistrationTemplateReturn] {
    Iter.toArray(
      Iter.map<(Nat, T.EventRegistrationTemplate), T.EventRegistrationTemplateReturn>(
        Map.entries(eventRegTemplates),
        func ((_, t)) { H.eventRegTemplateToReturn(t) }
      )
    )
  };

  public query func getEventRegistrationTemplate(id : Nat) : async ?T.EventRegistrationTemplateReturn {
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
    tmplSessions : [T.EventSessionReturn],
    fields : [T.FormFieldReturn],
    perMemberMode : Bool,
    perMemberSessionSelection : Bool,
    minMembers : Nat,
    maxMembers : Nat,
  ) : async T.EventRegistrationTemplateReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextEventRegTemplateId;
    counters.nextEventRegTemplateId += 1;
    let tmpl : T.EventRegistrationTemplate = {
      id;
      name = { fa = name_fa; sv = name_sv };
      description = { fa = description_fa; sv = description_sv };
      sessions = Builders.buildSessions(tmplSessions);
      fields = Builders.buildFormFields(fields);
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
    tmplSessions : [T.EventSessionReturn],
    fields : [T.FormFieldReturn],
    perMemberMode : Bool,
    perMemberSessionSelection : Bool,
    minMembers : Nat,
    maxMembers : Nat,
  ) : async ?T.EventRegistrationTemplateReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(eventRegTemplates, Nat.compare, id)) {
      case (?existing) {
        let updated : T.EventRegistrationTemplate = {
          id;
          name = { fa = name_fa; sv = name_sv };
          description = { fa = description_fa; sv = description_sv };
          sessions = Builders.buildSessions(tmplSessions);
          fields = Builders.buildFormFields(fields);
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
          if (bound and not RegLib.activityHasLiveRegistrations(registrations, aid)) {
            let synced : T.Activity = {
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
    Auth.requireAuth(auth, token);
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
          liveRegistrationCount = RegLib.liveRegistrationCount(registrations, aid);
        });
      };
    };
    List.toArray(buf)
  };

};
