import type {
  SiteSettingsReturn, TopicReturn, ActivityReturn, HeroSlideReturn,
  AboutContentReturn, ContactMessageReturn, SocialLinkReturn,
  RegistrationReturn, FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const ts = (daysAgo: number) => BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>با راهنمایی عکاسان حرفه‌ای، هنر عکاسی را در محیطی خلاق و الهام‌بخش یاد بگیرید. هر دوره ترکیبی از آموزش نظری و تمرین عملی است.</p><ul><li>بازخورد شخصی از مربی</li><li>دسترسی به استودیو و تجهیزات</li><li>گواهینامه پایان دوره</li></ul>`,
  body_sv: `<h2>${sv}</h2><p>Lär dig fotograferingens konst i en kreativ och inspirerande miljö med professionella fotografer som guide. Varje kurs är en kombination av teori och praktik.</p><ul><li>Personlig feedback från tränaren</li><li>Tillgång till studio och utrustning</li><li>Kursbevis vid avslutning</li></ul>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("frame-logo", 200, 200),
  title_fa: "آکادمی فریم",
  title_sv: "Frame Academy",
  subtitle_fa: "لحظه را ثبت کن — هنر عکاسی و فیلمسازی در محیطی خلاق",
  subtitle_sv: "Fånga ögonblicket — konsten att fotografera och filma i en kreativ miljö",
  landingBackgroundUrl: img("frame-landing", 1920, 1080),
  topicsBackgroundUrl: img("frame-topics", 1920, 1080),
  mockMode: true,
};

export const mockTopics: TopicReturn[] = [
  { id: 91001n, slug: "portrait", title_fa: "عکاسی پرتره", title_sv: "Porträttfotografi", description_fa: "استودیو، طبیعی و خیابانی — هنر ثبت چهره‌های انسانی", description_sv: "Studio, naturligt och gata — konsten att fånga mänskliga ansikten", icon: "User", backgroundUrl: img("portrait-bg", 1920, 1080), sortOrder: 1n, createdAt: ts(90) },
  { id: 91002n, slug: "landscape", title_fa: "منظره و طبیعت", title_sv: "Landskap & Natur", description_fa: "ترکیب‌بندی، نور طبیعی و فیلترهای مخصوص منظره", description_sv: "Komposition, naturligt ljus och specialfilter för landskap", icon: "Mountain", backgroundUrl: img("landscape-bg", 1920, 1080), sortOrder: 2n, createdAt: ts(85) },
  { id: 91003n, slug: "documentary", title_fa: "فیلم مستند", title_sv: "Dokumentärfilm", description_fa: "روایت واقعیت — پیش‌تولید، فیلمبرداری و تدوین", description_sv: "Berättande om verkligheten — förproduktion, filmning och redigering", icon: "Film", backgroundUrl: img("documentary-bg", 1920, 1080), sortOrder: 3n, createdAt: ts(80) },
  { id: 91004n, slug: "editing", title_fa: "ویرایش عکس", title_sv: "Fotoredigering", description_fa: "Lightroom، Photoshop و تکنیک‌های پیشرفته پست‌پروداکشن", description_sv: "Lightroom, Photoshop och avancerade efterbehandlingstekniker", icon: "Sliders", backgroundUrl: img("editing-bg", 1920, 1080), sortOrder: 4n, createdAt: ts(75) },
  { id: 91005n, slug: "exhibition", title_fa: "نمایشگاه و پرتفولیو", title_sv: "Utställning & Portfölj", description_fa: "ارائه، نقد و نمایش آثار به صورت حرفه‌ای", description_sv: "Presentation, kritik och professionell visning av verk", icon: "Image", backgroundUrl: img("exhibition-bg", 1920, 1080), sortOrder: 5n, createdAt: ts(70) },
];

export const mockSlides: HeroSlideReturn[] = [
  { id: 91010n, topicId: 91001n, imageUrl: img("golden-hour-slide", 1200, 600), title_fa: "کارگاه ساعت طلایی", title_sv: "Golden Hour Workshop", subtitle_fa: "پرتره در نور طبیعت — جادوی غروب", subtitle_sv: "Porträtt i naturligt ljus — solnedgångens magi", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/fa/topics/portrait", sortOrder: 1n },
  { id: 91011n, topicId: 91005n, imageUrl: img("exhibition-slide", 1200, 600), title_fa: "نمایشگاه سالانه دانشجویان", title_sv: "Studenternas årsutställning", subtitle_fa: "بهترین آثار آکادمی در گالری شهر", subtitle_sv: "Akademins bästa verk i stadens galleri", ctaText_fa: "اطلاعات بیشتر", ctaText_sv: "Mer information", ctaLink: "/fa/topics/exhibition", sortOrder: 2n },
];

export const mockActivities: ActivityReturn[] = [
  // Portrait
  {
    id: 92001n, topicId: 91001n, slug: "studio-portrait",
    title_fa: "عکاسی پرتره در استودیو", title_sv: "Studioporträttfotografi",
    excerpt_fa: "کنترل نور، پوز و تکنیک‌های پرتره در استودیو مجهز", excerpt_sv: "Ljuskontroll, pose och porträtttekniker i välutrustad studio",
    ...body("عکاسی پرتره در استودیو", "Studioporträttfotografi"),
    formTemplateId: 97020n,
    icon: "User", imageUrl: img("studio-portrait", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 92002n, topicId: 91001n, slug: "street-portrait",
    title_fa: "پرتره خیابانی", title_sv: "Gatuporträtt",
    excerpt_fa: "عکاسی از غریبه‌ها، داستان‌گویی و احساسات واقعی در خیابان", excerpt_sv: "Fotografera obekanta, berättande och äkta känslor på gatan",
    ...body("پرتره خیابانی", "Gatuporträtt"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "نوع دوربین", label_sv: "Kameratyp", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "DSLR دیجیتال", sv: "DSLR" }, { fa: "بدون آینه (Mirrorless)", sv: "Spegellös" }, { fa: "آنالوگ / فیلم", sv: "Analog / film" }, { fa: "موبایل", sv: "Smartphone" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "لینک اینستاگرام یا پرتفولیو (اختیاری)", label_sv: "Instagram- eller portföljlänk (valfritt)", placeholder_fa: "https://instagram.com/...", placeholder_sv: "https://instagram.com/...", required: false, options: [], sortOrder: 4n },
    ],
    icon: "User", imageUrl: img("street-portrait", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 92003n, topicId: 91001n, slug: "golden-hour",
    title_fa: "کارگاه ساعت طلایی", title_sv: "Golden Hour Workshop",
    excerpt_fa: "عکاسی پرتره در نور طبیعت غروب — فقط ۸ نفر", excerpt_sv: "Porträttfotografi i naturligt solnedgångsljus — bara 8 personer",
    ...body("کارگاه ساعت طلایی", "Golden Hour Workshop"),
    icon: "Sun", imageUrl: img("golden-hour", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  // Landscape
  {
    id: 93001n, topicId: 91002n, slug: "landscape-basics",
    title_fa: "مبانی عکاسی منظره", title_sv: "Grunderna i landskapsfotografi",
    excerpt_fa: "ترکیب‌بندی، اکسپوژر و استفاده از فیلترها در طبیعت", excerpt_sv: "Komposition, exponering och filter i naturen",
    ...body("مبانی عکاسی منظره", "Grunderna i landskapsfotografi"),
    formTemplateId: 97020n,
    icon: "Mountain", imageUrl: img("landscape-basics", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(48),
  },
  {
    id: 93002n, topicId: 91002n, slug: "night-photography",
    title_fa: "عکاسی شبانه", title_sv: "Nattfotografi",
    excerpt_fa: "ستاره‌ها، لایت‌پینتینگ و شهر در شب", excerpt_sv: "Stjärnor, lightpainting och staden på natten",
    ...body("عکاسی شبانه", "Nattfotografi"),
    icon: "Moon", imageUrl: img("night-photography", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(45),
  },
  // Documentary
  {
    id: 94001n, topicId: 91003n, slug: "doc-film-intro",
    title_fa: "مقدمه‌ای بر مستندسازی", title_sv: "Introduktion till dokumentärfilm",
    excerpt_fa: "پیش‌تولید، مصاحبه و تدوین — هر شرکت‌کننده یک فیلم ۵ دقیقه‌ای می‌سازد", excerpt_sv: "Förproduktion, intervjuer och redigering — varje deltagare gör en 5-minuters kortfilm",
    ...body("مقدمه‌ای بر مستندسازی", "Introduktion till dokumentärfilm"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "نرم‌افزار تدوین", label_sv: "Redigeringsprogram", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "Adobe Premiere Pro", sv: "Adobe Premiere Pro" }, { fa: "Final Cut Pro", sv: "Final Cut Pro" }, { fa: "DaVinci Resolve", sv: "DaVinci Resolve" }, { fa: "آشنایی ندارم", sv: "Har ingen erfarenhet" }], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "آیا لپ‌تاپ شخصی دارید؟", label_sv: "Har du en personlig laptop?", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "بله — مک", sv: "Ja — Mac" }, { fa: "بله — ویندوز", sv: "Ja — Windows" }, { fa: "نه، از کامپیوتر آکادمی استفاده می‌کنم", sv: "Nej, använder akademins dator" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "ایده اولیه برای مستند (اختیاری)", label_sv: "Preliminär dokumentäridé (valfritt)", placeholder_fa: "چند جمله درباره چیزی که می‌خواهید مستند کنید", placeholder_sv: "Några meningar om vad du vill dokumentera", required: false, options: [], sortOrder: 5n },
    ],
    icon: "Film", imageUrl: img("documentary-film", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(42),
  },
  // Editing
  {
    id: 95001n, topicId: 91004n, slug: "lightroom-masterclass",
    title_fa: "مسترکلاس لایت‌روم", title_sv: "Lightroom-masterclass",
    excerpt_fa: "از خام تا شاهکار — نور، رنگ، وضوح و ساخت پریست شخصی", excerpt_sv: "Från råbild till mästerverk — ljus, färg, skärpa och egna presets",
    ...body("مسترکلاس لایت‌روم", "Lightroom-masterclass"),
    formTemplateId: 97021n,
    icon: "Sliders", imageUrl: img("lightroom", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(38),
  },
  {
    id: 95002n, topicId: 91004n, slug: "photoshop-compositing",
    title_fa: "ترکیب‌بندی در فتوشاپ", title_sv: "Photoshop-kompositionering",
    excerpt_fa: "ترکیب چند تصویر، ماسک‌گذاری و افکت‌های خلاقانه", excerpt_sv: "Kombinera bilder, maskning och kreativa effekter",
    ...body("ترکیب‌بندی در فتوشاپ", "Photoshop-kompositionering"),
    formTemplateId: 97021n,
    icon: "Layers", imageUrl: img("photoshop", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(35),
  },
  // Exhibition
  {
    id: 96001n, topicId: 91005n, slug: "portfolio-review",
    title_fa: "نقد و بررسی پرتفولیو", title_sv: "Portföljgranskning",
    excerpt_fa: "نقد گروهی ۱۰ عکس توسط عکاسان حرفه‌ای — بازخورد سازنده", excerpt_sv: "Grupportföljkritik på 10 bilder av professionella fotografer",
    ...body("نقد و بررسی پرتفولیو", "Portföljgranskning"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "لینک پرتفولیو یا گالری آنلاین", label_sv: "Länk till portfölj eller onlinegalleri", placeholder_fa: "https://...", placeholder_sv: "https://...", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "سبک عکاسی اصلی شما", label_sv: "Din primära fotograferingsstil", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "پرتره", sv: "Porträtt" }, { fa: "منظره / طبیعت", sv: "Landskap / natur" }, { fa: "خیابانی / مستند", sv: "Gata / dokumentär" }, { fa: "محصول / تبلیغاتی", sv: "Produkt / kommersiell" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "روی چه جنبه‌ای می‌خواهی بازخورد بگیری؟", label_sv: "Vilken aspekt vill du ha feedback på?", placeholder_fa: "مثلاً: ترکیب‌بندی، نورپردازی، ویرایش", placeholder_sv: "T.ex. komposition, ljussättning, redigering", required: true, options: [], sortOrder: 5n },
    ],
    icon: "Image", imageUrl: img("portfolio-review", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(30),
  },
];

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 97001n, platform: "instagram", url: "https://instagram.com/frame.academy", sortOrder: 1n },
  { id: 97002n, platform: "youtube", url: "https://youtube.com/frameacademy", sortOrder: 2n },
  { id: 97003n, platform: "website", url: "https://frameacademy.example.se", sortOrder: 3n },
];

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("frame-about", 1200, 500),
  body_fa: "<h2>درباره آکادمی فریم</h2><p>آکادمی فریم در سال ۲۰۱۵ توسط عکاس حرفه‌ای ناصر قربانی تأسیس شد. ما باور داریم که عکاسی نه فقط یک مهارت فنی، بلکه یک زبان برای بیان احساسات و داستان‌هاست. هدف ما ارائه آموزش خلاقانه و حرفه‌ای است که دانشجویان را برای کار در دنیای واقعی آماده کند.</p>",
  body_sv: "<h2>Om Frame Fotografi & Film</h2><p>Frame Academy grundades 2015 av den professionella fotografen Nasser Ghorbani. Vi tror att fotografi inte bara är en teknisk färdighet, utan ett språk för att uttrycka känslor och berättelser. Vårt mål är att erbjuda kreativ och professionell utbildning som förbereder studenter för arbete i den verkliga världen.</p>",
};

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 97020n, name_fa: "ثبت‌نام دوره عکاسی", name_sv: "Fotograferingskursregistrering",
    description_fa: "فرم استاندارد با نوع دوربین و سطح تجربه", description_sv: "Standardformulär med kameratyp och erfarenhetsnivå",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "نوع دوربین", label_sv: "Kameratyp", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "DSLR دیجیتال", sv: "DSLR" }, { fa: "بدون آینه (Mirrorless)", sv: "Spegellös" }, { fa: "آنالوگ / فیلم", sv: "Analog / film" }, { fa: "موبایل", sv: "Smartphone" }, { fa: "ندارم — از تجهیزات آکادمی استفاده می‌کنم", sv: "Har ingen — använder akademins utrustning" }], sortOrder: 4n },
      { id: 5n, fieldType: "radio", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی — تازه شروع کرده‌ام", sv: "Nybörjare — precis börjat" }, { fa: "هاببی — چند سال تجربه غیررسمی", sv: "Hobbyist — några år informell erfarenhet" }, { fa: "نیمه‌حرفه‌ای — پروژه‌های پولی داشته‌ام", sv: "Halvprofessionell — har haft betalda uppdrag" }], sortOrder: 5n },
      { id: 6n, fieldType: "text", label_fa: "لینک پرتفولیو یا اینستاگرام (اختیاری)", label_sv: "Portfölj- eller Instagramlänk (valfritt)", placeholder_fa: "https://instagram.com/...", placeholder_sv: "https://instagram.com/...", required: false, options: [], sortOrder: 6n },
    ],
    createdAt: ts(100),
  },
  {
    id: 97021n, name_fa: "ثبت‌نام ویرایش و پست‌پروداکشن", name_sv: "Registrering för redigering och efterbehandling",
    description_fa: "فرم با اطلاعات نرم‌افزار ادیت و در دسترس بودن لپ‌تاپ", description_sv: "Formulär med redigeringsprogram och tillgång till laptop",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "نرم‌افزار ادیت مورد استفاده", label_sv: "Redigeringsprogram du använder", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "Adobe Lightroom", sv: "Adobe Lightroom" }, { fa: "Adobe Photoshop", sv: "Adobe Photoshop" }, { fa: "Capture One", sv: "Capture One" }, { fa: "هیچ‌کدام — تازه شروع می‌کنم", sv: "Inget — börjar från grunden" }], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "لپ‌تاپ شخصی", label_sv: "Personlig laptop", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "بله — مک", sv: "Ja — Mac" }, { fa: "بله — ویندوز", sv: "Ja — Windows" }, { fa: "نه — از کامپیوتر آکادمی", sv: "Nej — använder akademins dator" }], sortOrder: 4n },
    ],
    createdAt: ts(95),
  },
];

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 99001n, name: "Oskar Bergström", email: "oskar@example.se", phone: "+46761234567", message: "Hej! Erbjuder ni privatlektioner i porträttfotografi? Jag vill förbättra mig snabbt inför ett uppdrag.", createdAt: ts(1) },
  { id: 99002n, name: "نیلوفر رشیدی", email: "niloufar@example.com", phone: "+46709876543", message: "سلام، آیا دوربین برای اجاره دارید؟ می‌خواهم قبل از خرید امتحان کنم.", createdAt: ts(4) },
  { id: 99003n, name: "Maja Lindqvist", email: "maja.l@example.se", phone: "+46703322114", message: "Jag är intresserad av dokumentärfilmkursen. Kan man delta utan tidigare filmningserfarenhet?", createdAt: ts(7) },
];

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 99010n, activityId: 92001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Maja Lindqvist" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "maja@example.se" },
      { fieldId: 3n, fieldLabel: "تلفن / Telefon", value: "076-1234567" },
      { fieldId: 4n, fieldLabel: "نوع دوربین / Kameratyp", value: "بدون آینه (Mirrorless)" },
      { fieldId: 5n, fieldLabel: "سطح تجربه / Erfarenhetsnivå", value: "هاببی — چند سال تجربه غیررسمی" },
      { fieldId: 6n, fieldLabel: "پرتفولیو / Portfölj", value: "https://instagram.com/maja.photos" },
    ],
    createdAt: ts(4),
  },
  {
    id: 99011n, activityId: 94001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "رضا کریمی" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "reza@example.com" },
      { fieldId: 3n, fieldLabel: "نرم‌افزار تدوین / Redigeringsprogram", value: "DaVinci Resolve" },
      { fieldId: 4n, fieldLabel: "لپ‌تاپ / Laptop", value: "بله — ویندوز / Ja — Windows" },
      { fieldId: 5n, fieldLabel: "ایده مستند / Dokumentäridé", value: "می‌خواهم درباره بازار محلی شهرمان مستند بسازم" },
    ],
    createdAt: ts(9),
  },
];
