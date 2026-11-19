/// Hero slides CRUD.
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
  heroSlides : Map.Map<Nat, T.HeroSlide>,
) {



  // ─── Hero Slides CRUD ─────────────────────────────────────────────────────

  public query func getSlidesByTopic(topicId : Nat) : async [T.HeroSlideReturn] {
    let arr = Iter.toArray(
      Iter.map<(Nat, T.HeroSlide), T.HeroSlideReturn>(
        Iter.filter<(Nat, T.HeroSlide)>(
          Map.entries(heroSlides),
          func ((_, s)) { s.topicId == topicId }
        ),
        func ((_, s)) { H.slideToReturn(s) }
      )
    );
    Array.sort(arr, func (a : T.HeroSlideReturn, b : T.HeroSlideReturn) : { #less; #equal; #greater } {
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
  ) : async T.HeroSlideReturn {
    Auth.requireAuth(auth, token);
    let id = counters.nextSlideId;
    counters.nextSlideId += 1;
    let slide : T.HeroSlide = {
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
  ) : async ?T.HeroSlideReturn {
    Auth.requireAuth(auth, token);
    switch (Map.get(heroSlides, Nat.compare, id)) {
      case (?_) {
        let updated : T.HeroSlide = {
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
    Auth.requireAuth(auth, token);
    switch (Map.get(heroSlides, Nat.compare, id)) {
      case (?_) { ignore Map.delete(heroSlides, Nat.compare, id); true };
      case null { false };
    }
  };

};
