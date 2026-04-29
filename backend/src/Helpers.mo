/// Pure conversion helpers: domain types → flat Candid return types.
import T "./Types";

module {

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

  public func activityToReturn(a : T.Activity) : T.ActivityReturn {
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
      sortOrder = a.sortOrder;
      createdAt = a.createdAt;
    }
  };

  public func regToReturn(r : T.Registration) : T.RegistrationReturn {
    {
      id = r.id;
      activityId = r.activityId;
      name = r.name;
      email = r.email;
      phone = r.phone;
      message = r.message;
      createdAt = r.createdAt;
    }
  };

  public func socialToReturn(s : T.SocialLink) : T.SocialLinkReturn {
    {
      id = s.id;
      platform = s.platform;
      url = s.url;
      sortOrder = s.sortOrder;
    }
  };

  public func settingsToReturn(s : T.SiteSettings) : T.SiteSettingsReturn {
    {
      logoUrl = s.logoUrl;
      title_fa = s.title.fa;
      title_sv = s.title.sv;
      subtitle_fa = s.subtitle.fa;
      subtitle_sv = s.subtitle.sv;
      landingBackgroundUrl = s.landingBackgroundUrl;
      topicsBackgroundUrl = s.topicsBackgroundUrl;
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
