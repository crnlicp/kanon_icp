/// Social links CRUD.
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  socialLinks : Map.Map<Nat, T.SocialLink>,
) {



  // ─── Social Links CRUD ────────────────────────────────────────────────────

  public query func getSocialLinks() : async [T.SocialLinkReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, T.SocialLink), T.SocialLinkReturn>(
        Map.entries(socialLinks),
        func ((_, s)) { H.socialToReturn(s) }
      )
    );
    Array.sort(arr, func (a : T.SocialLinkReturn, b : T.SocialLinkReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public func createSocialLink(
    token : Text,
    platform : Text,
    url : Text,
    sortOrder : Nat,
  ) : async T.SocialLinkReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextSocialLinkId;
    counters.nextSocialLinkId += 1;
    let link : T.SocialLink = { id; platform; url; sortOrder };
    Map.add(socialLinks, Nat.compare, id, link);
    H.socialToReturn(link)
  };

  public func updateSocialLink(
    token : Text,
    id : Nat,
    platform : Text,
    url : Text,
    sortOrder : Nat,
  ) : async ?T.SocialLinkReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(socialLinks, Nat.compare, id)) {
      case (?_) {
        let updated : T.SocialLink = { id; platform; url; sortOrder };
        Map.add(socialLinks, Nat.compare, id, updated);
        ?H.socialToReturn(updated)
      };
      case null { null };
    }
  };

  public func deleteSocialLink(token : Text, id : Nat) : async Bool {
    Auth.requireAuth(auth, token);
    switch (Map.get(socialLinks, Nat.compare, id)) {
      case (?_) { ignore Map.delete(socialLinks, Nat.compare, id); true };
      case null { false };
    }
  };


};
