/// Registration queries shared by the activities and templates mixins.
import Map "mo:core/Map";

import T "../types";

module {

  // True if the activity has any non-archived registrations.
  // Used to decide whether it is safe to re-sync template sessions onto it.
  public func activityHasLiveRegistrations(registrations : Map.Map<Nat, T.Registration>, activityId : Nat) : Bool {
    for ((_, r) in Map.entries(registrations)) {
      if (r.activityId == activityId) {
        let isArchived = switch (r.archived) { case (?b) b; case null false };
        if (not isArchived) { return true };
      };
    };
    false
  };

  // Count non-archived registrations for an activity.
  public func liveRegistrationCount(registrations : Map.Map<Nat, T.Registration>, activityId : Nat) : Nat {
    var n : Nat = 0;
    for ((_, r) in Map.entries(registrations)) {
      if (r.activityId == activityId) {
        let isArchived = switch (r.archived) { case (?b) b; case null false };
        if (not isArchived) { n += 1 };
      };
    };
    n
  };

};
