/// Pure conversion helpers: domain types → flat Candid return types.
import T "./Types";
import Array "mo:core/Array";

module {

  public func fieldTypeToText(ft : T.FormFieldType) : Text {
    switch (ft) {
      case (#text) { "text" };
      case (#textarea) { "textarea" };
      case (#email) { "email" };
      case (#phone) { "phone" };
      case (#number) { "number" };
      case (#select) { "select" };
      case (#radio) { "radio" };
      case (#checkbox) { "checkbox" };
      case (#date) { "date" };
    }
  };

  public func textToFieldType(t : Text) : T.FormFieldType {
    switch (t) {
      case ("textarea") { #textarea };
      case ("email") { #email };
      case ("phone") { #phone };
      case ("number") { #number };
      case ("select") { #select };
      case ("radio") { #radio };
      case ("checkbox") { #checkbox };
      case ("date") { #date };
      case (_) { #text };
    }
  };

  public func fieldToReturn(f : T.FormField) : T.FormFieldReturn {
    {
      id = f.id;
      fieldType = fieldTypeToText(f.fieldType);
      label_fa = f.fieldLabel.fa;
      label_sv = f.fieldLabel.sv;
      placeholder_fa = f.placeholder.fa;
      placeholder_sv = f.placeholder.sv;
      required = f.required;
      options = Array.map<T.LocalizedText, { fa : Text; sv : Text }>(
        f.options,
        func (o) { { fa = o.fa; sv = o.sv } }
      );
      sortOrder = f.sortOrder;
    }
  };

  public func templateToReturn(t : T.FormTemplate) : T.FormTemplateReturn {
    {
      id = t.id;
      name_fa = t.name.fa;
      name_sv = t.name.sv;
      description_fa = t.description.fa;
      description_sv = t.description.sv;
      fields = Array.map<T.FormField, T.FormFieldReturn>(t.fields, fieldToReturn);
      createdAt = t.createdAt;
    }
  };

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
      formTemplateId = a.formTemplateId;
      customFormFields = Array.map<T.FormField, T.FormFieldReturn>(a.customFormFields, fieldToReturn);
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
      fieldValues = Array.map<T.RegistrationFieldValue, T.RegistrationFieldValueReturn>(
        r.fieldValues,
        func (fv) { { fieldId = fv.fieldId; fieldLabel = fv.fieldLabel; value = fv.value } }
      );
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

  public func settingsToReturn(s : T.SiteSettings, mock : Bool) : T.SiteSettingsReturn {
    {
      logoUrl = s.logoUrl;
      title_fa = s.title.fa;
      title_sv = s.title.sv;
      subtitle_fa = s.subtitle.fa;
      subtitle_sv = s.subtitle.sv;
      landingBackgroundUrl = s.landingBackgroundUrl;
      topicsBackgroundUrl = s.topicsBackgroundUrl;
      mockMode = mock;
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
