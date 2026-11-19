/// Contact form messages.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";
import Limits "../lib/Limits";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  contactMessages : Map.Map<Nat, T.ContactMessage>,
) {



  // ─── Contact Messages ─────────────────────────────────────────────────────

  public func submitContactMessage(
    name : Text,
    email : Text,
    phone : Text,
    message : Text,
  ) : async ?T.ContactMessageReturn {
    if (
      name.size() > Limits.maxNameLen or
      email.size() > Limits.maxEmailLen or
      phone.size() > Limits.maxPhoneLen or
      message.size() > Limits.maxMessageLen
    ) {
      return null;
    };
    let id = counters.nextContactMessageId;
    counters.nextContactMessageId += 1;
    let msg : T.ContactMessage = {
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

  public query func getContactMessages(token : Text) : async [T.ContactMessageReturn] {
    Auth.requireAuth(auth, token);
    Iter.toArray(
      Iter.map<(Nat, T.ContactMessage), T.ContactMessageReturn>(
        Map.entries(contactMessages),
        func ((_, c)) { H.contactMsgToReturn(c) }
      )
    )
  };

  public func deleteContactMessage(token : Text, id : Nat) : async Bool {
    Auth.requireAuth(auth, token);
    switch (Map.get(contactMessages, Nat.compare, id)) {
      case (?_) { ignore Map.delete(contactMessages, Nat.compare, id); true };
      case null { false };
    }
  };


};
