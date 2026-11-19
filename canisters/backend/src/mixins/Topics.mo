/// Topics CRUD (deleting a topic removes its slides and activities).
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";

import T "../types";
import H "../lib/Helpers";
import Auth "../lib/Auth";

mixin (
  auth : Auth.State,
  counters : T.Counters,
  topics : Map.Map<Nat, T.Topic>,
  heroSlides : Map.Map<Nat, T.HeroSlide>,
  activities : Map.Map<Nat, T.Activity>,
) {



  // ─── Topics CRUD ──────────────────────────────────────────────────────────

  public query func getTopics() : async [T.TopicReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, T.Topic), T.TopicReturn>(
        Map.entries(topics),
        func ((_, t)) { H.topicToReturn(t) }
      )
    );
    Array.sort(arr, func (a : T.TopicReturn, b : T.TopicReturn) : { #less; #equal; #greater } {
      Nat.compare(a.sortOrder, b.sortOrder)
    })
  };

  public query func getTopic(id : Nat) : async ?T.TopicReturn {
    switch (Map.get(topics, Nat.compare, id)) {
      case (?t) { ?H.topicToReturn(t) };
      case null { null };
    }
  };

  public query func getTopicBySlug(slug : Text) : async ?T.TopicReturn {
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
  ) : async T.TopicReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextTopicId;
    counters.nextTopicId += 1;
    let topic : T.Topic = {
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
  ) : async ?T.TopicReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(topics, Nat.compare, id)) {
      case (?existing) {
        let updated : T.Topic = {
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
    Auth.requireAuth(auth, token);
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

};
