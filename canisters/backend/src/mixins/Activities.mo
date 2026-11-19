/// Activities CRUD.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";

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
  eventRegTemplates : Map.Map<Nat, T.EventRegistrationTemplate>,
) {



  // ─── Activities CRUD ──────────────────────────────────────────────────────

  public query func getActivitiesByTopic(topicId : Nat) : async [T.ActivityReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, T.Activity), T.ActivityReturn>(
        Iter.filter<(Nat, T.Activity)>(
          Map.entries(activities),
          func ((_, a)) { a.topicId == topicId }
        ),
        func ((_, a)) { H.activityToReturn(a) }
      )
    );
    Array.sort(arr, func (a : T.ActivityReturn, b : T.ActivityReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public query func getActivityBySlug(topicId : Nat, slug : Text) : async ?T.ActivityReturn {
    for ((_, a) in Map.entries(activities)) {
      if (a.topicId == topicId and a.slug == slug) {
        return ?H.activityToReturn(a);
      };
    };
    null
  };

  public query func getActivity(id : Nat) : async ?T.ActivityReturn {
    switch (Map.get(activities, Nat.compare, id)) {
      case (?a) { ?H.activityToReturn(a) };
      case null { null };
    }
  };

  public query func getAllActivities() : async [T.ActivityReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, T.Activity), T.ActivityReturn>(
        Map.entries(activities),
        func ((_, a)) { H.activityToReturn(a) }
      )
    );
    Array.sort(arr, func (a : T.ActivityReturn, b : T.ActivityReturn) : { #less; #equal; #greater } {
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
    customFormFields : [T.FormFieldReturn],
    actSessions : [T.EventSessionReturn],
    highlighted : Bool,
    sortOrder : Nat,
  ) : async T.ActivityReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextActivityId;
    counters.nextActivityId += 1;
    // Sessions: snapshot from template (or use custom) — needed for registration integrity.
    let resolvedSessions : [T.EventSession] = switch (eventTemplateId) {
      case (?tid) {
        switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
          case (?t) { t.sessions };
          case null { Builders.buildSessions(actSessions) };
        }
      };
      case null { Builders.buildSessions(actSessions) };
    };
    // Fields: when using an event template, leave customFormFields empty so
    // getActivityFormFields resolves them live from the template.
    let resolvedFields : [T.FormField] = switch (eventTemplateId) {
      case (?_) { [] };
      case null { Builders.buildFormFields(customFormFields) };
    };
    let activity : T.Activity = {
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
    customFormFields : [T.FormFieldReturn],
    actSessions : [T.EventSessionReturn],
    highlighted : Bool,
    sortOrder : Nat,
  ) : async ?T.ActivityReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(activities, Nat.compare, id)) {
      case (?existing) {
        // Sessions: if switching template, only snapshot from it when safe
        // (no existing non-archived registrations). Otherwise preserve existing
        // session snapshot to keep registrations consistent.
        let resolvedSessions : [T.EventSession] = switch (eventTemplateId) {
          case (?tid) {
            switch (Map.get(eventRegTemplates, Nat.compare, tid)) {
              case (?t) {
                if (RegLib.activityHasLiveRegistrations(registrations, id)) { existing.sessions }
                else { t.sessions }
              };
              case null { Builders.buildSessions(actSessions) };
            }
          };
          case null { Builders.buildSessions(actSessions) };
        };
        // Fields: when using an event template, leave customFormFields empty so
        // getActivityFormFields resolves them live from the template.
        let resolvedFields : [T.FormField] = switch (eventTemplateId) {
          case (?_) { [] };
          case null { Builders.buildFormFields(customFormFields) };
        };
        let updated : T.Activity = {
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
    Auth.requireAuth(auth, token);
    switch (Map.get(activities, Nat.compare, id)) {
      case (?_) { ignore Map.delete(activities, Nat.compare, id); true };
      case null { false };
    }
  };

};
