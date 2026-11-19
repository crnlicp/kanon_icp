import Map "mo:core/Map";

import T "types";
import Auth "lib/Auth";
import AuthMixin "mixins/Auth";
import SettingsMixin "mixins/Settings";
import TopicsMixin "mixins/Topics";
import SlidesMixin "mixins/Slides";
import ActivitiesMixin "mixins/Activities";
import TemplatesMixin "mixins/Templates";
import RegistrationsMixin "mixins/Registrations";
import SocialLinksMixin "mixins/SocialLinks";
import ContactMixin "mixins/Contact";
import AssetsMixin "mixins/Assets";
import SeoMixin "mixins/Seo";

// Composition root: owns all state, exposes no methods of its own.
// Initial values come from the migration chain in migrations/.
persistent actor {

  let counters : T.Counters;
  let config : T.Config;

  let topics : Map.Map<Nat, T.Topic>;
  let heroSlides : Map.Map<Nat, T.HeroSlide>;
  let activities : Map.Map<Nat, T.Activity>;
  let registrations : Map.Map<Nat, T.Registration>;
  // When each (registration, [member], session) was joined. Kept beside
  // Registration so that record type never changes; a missing entry means
  // "joined at reg.createdAt".
  let sessionJoinedAt : Map.Map<Nat, [T.SessionJoinedRecord]>;
  let formTemplates : Map.Map<Nat, T.FormTemplate>;
  let eventRegTemplates : Map.Map<Nat, T.EventRegistrationTemplate>;
  let socialLinks : Map.Map<Nat, T.SocialLink>;
  let contactMessages : Map.Map<Nat, T.ContactMessage>;
  let assets : Map.Map<Text, Blob>;
  let pageOverrides : Map.Map<Text, T.PageSeoOverride>;

  // Sessions are transient on purpose: an upgrade logs every admin out.
  transient let auth = Auth.empty();

  include AuthMixin(auth, config);
  include SettingsMixin(auth, config);
  include TopicsMixin(auth, counters, topics, heroSlides, activities);
  include SlidesMixin(auth, counters, heroSlides);
  include ActivitiesMixin(auth, counters, activities, registrations, eventRegTemplates);
  include TemplatesMixin(auth, counters, activities, registrations, formTemplates, eventRegTemplates);
  include RegistrationsMixin(auth, counters, activities, registrations, sessionJoinedAt, formTemplates, eventRegTemplates);
  include SocialLinksMixin(auth, counters, socialLinks);
  include ContactMixin(auth, counters, contactMessages);
  include AssetsMixin(auth, counters, assets);
  include SeoMixin(auth, config, topics, activities, pageOverrides);
};
