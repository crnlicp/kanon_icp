import type {
  SiteSettingsReturn, TopicReturn, ActivityReturn, HeroSlideReturn,
  AboutContentReturn, ContactMessageReturn, SocialLinkReturn,
  RegistrationReturn, FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const ts = (daysAgo: number) => BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>در محیطی ایمن، خلاق و سرگرم‌کننده، کودکان استعدادهای خود را کشف می‌کنند. مربیان ما متخصص در کار با کودکان هستند و هر جلسه را به تجربه‌ای فراموش‌نشدنی تبدیل می‌کنند.</p><ul><li>گروه‌های کوچک برای توجه بیشتر</li><li>محیط کاملاً ایمن و نظارت‌شده</li><li>فعالیت‌های هماهنگ با سن و توانایی</li></ul>`,
  body_sv: `<h2>${sv}</h2><p>I en säker, kreativ och rolig miljö upptäcker barn sina talanger. Våra tränare är specialiserade på att arbeta med barn och förvandlar varje pass till en oförglömlig upplevelse.</p><ul><li>Små grupper för mer uppmärksamhet</li><li>Helt säker och övervakad miljö</li><li>Aktiviteter anpassade efter ålder och förmåga</li></ul>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("wonderland-logo", 200, 200),
  title_fa: "وندرلند",
  title_sv: "Wonderland",
  subtitle_fa: "جایی که کودکان رشد می‌کنند — برنامه‌های خلاقانه برای ۳ تا ۱۴ ساله",
  subtitle_sv: "Där barn blomstrar — kreativa program för 3–14 år",
  landingBackgroundUrl: img("wonderland-landing", 1920, 1080),
  topicsBackgroundUrl: img("wonderland-topics", 1920, 1080),
  mockMode: true,
};

export const mockTopics: TopicReturn[] = [
  { id: 81001n, slug: "creative-arts", title_fa: "هنرهای خلاقانه", title_sv: "Skapande konst", description_fa: "نقاشی، سفالگری، هنر دیجیتال و دست‌سازه برای کودکان", description_sv: "Målning, keramik, digital konst och hantverk för barn", icon: "Palette", backgroundUrl: img("kids-arts-bg", 1920, 1080), sortOrder: 1n, createdAt: ts(90) },
  { id: 81002n, slug: "science-discovery", title_fa: "علم و کشف", title_sv: "Vetenskap & Upptäckt", description_fa: "آزمایش‌های شیمی، رباتیک و کدنویسی برای ذهن‌های کنجکاو", description_sv: "Kemiexperiment, robotteknik och kodning för nyfikna sinnen", icon: "FlaskConical", backgroundUrl: img("kids-science-bg", 1920, 1080), sortOrder: 2n, createdAt: ts(85) },
  { id: 81003n, slug: "music-kids", title_fa: "موسیقی", title_sv: "Musik", description_fa: "اوکلله، آواز گروهی و آشنایی با ریتم برای کودکان", description_sv: "Ukulele, kör och rytmintroduktion för barn", icon: "Music", backgroundUrl: img("kids-music-bg", 1920, 1080), sortOrder: 3n, createdAt: ts(80) },
  { id: 81004n, slug: "drama-theater", title_fa: "نمایش و تئاتر", title_sv: "Drama & Teater", description_fa: "تئاتر بداهه، نقش‌آفرینی و ساخت اعتماد به نفس", description_sv: "Improvisationsteater, rollspel och självförtroendebyggande", icon: "Theater", backgroundUrl: img("kids-drama-bg", 1920, 1080), sortOrder: 4n, createdAt: ts(75) },
  { id: 81005n, slug: "outdoor-adventures", title_fa: "ماجراجویی در طبیعت", title_sv: "Naturäventyr", description_fa: "پیاده‌روی، کشف طبیعت و مهارت‌های بقا برای نوجوانان", description_sv: "Vandring, naturutforskning och överlevnadskunskaper för ungdomar", icon: "TreePine", backgroundUrl: img("kids-outdoor-bg", 1920, 1080), sortOrder: 5n, createdAt: ts(70) },
];

export const mockSlides: HeroSlideReturn[] = [
  { id: 81010n, topicId: 81001n, imageUrl: img("art-camp-slide", 1200, 600), title_fa: "اردوی هنری تابستان ۲۰۲۶", title_sv: "Konstsommarläger 2026", subtitle_fa: "یک هفته پر از خلاقیت و کشف", subtitle_sv: "En vecka full av kreativitet och upptäckt", ctaText_fa: "ثبت‌نام", ctaText_sv: "Anmäl dig", ctaLink: "/fa/topics/creative-arts", sortOrder: 1n },
  { id: 81011n, topicId: 81002n, imageUrl: img("science-fair-slide", 1200, 600), title_fa: "نمایشگاه علوم کودکان", title_sv: "Barnens vetenskapsmässa", subtitle_fa: "آزمایش‌های هیجان‌انگیز برای ذهن‌های کنجکاو", subtitle_sv: "Spännande experiment för nyfikna sinnen", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/fa/topics/science-discovery", sortOrder: 2n },
];

export const mockActivities: ActivityReturn[] = [
  // Creative Arts
  {
    id: 82001n, topicId: 81001n, slug: "painting-workshop",
    title_fa: "کارگاه نقاشی آکریلیک", title_sv: "Workshop i akrylfärger",
    excerpt_fa: "کودکان ۵ تا ۱۰ ساله با رنگ‌های آکریلیک نقاشی می‌کشند", excerpt_sv: "Barn 5–10 år målar med akrylfärger",
    ...body("کارگاه نقاشی آکریلیک", "Workshop i akrylfärger"),
    formTemplateId: 87020n,
    icon: "Palette", imageUrl: img("painting-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 82002n, topicId: 81001n, slug: "pottery-kids",
    title_fa: "سفالگری کودکان", title_sv: "Keramik för barn",
    excerpt_fa: "چرخ سفالگری، قالب‌سازی و لعاب‌کاری برای ۷ تا ۱۴ ساله", excerpt_sv: "Keramikhjul, formning och glasering för 7–14 år",
    ...body("سفالگری کودکان", "Keramik för barn"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک", label_sv: "Barnets namn", placeholder_fa: "نام کامل کودک", placeholder_sv: "Barnets fullständiga namn", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن کودک", label_sv: "Barnets ålder", placeholder_fa: "سن (سال)", placeholder_sv: "Ålder (år)", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "نام والدین", label_sv: "Förälderns namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "phone", label_fa: "تماس والدین", label_sv: "Förälderns telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "text", label_fa: "آلرژی به مواد", label_sv: "Allergi mot material", placeholder_fa: "مثلاً لاتکس، رنگ‌های خاص", placeholder_sv: "T.ex. latex, specifika färger", required: false, options: [], sortOrder: 5n },
    ],
    icon: "Layers", imageUrl: img("pottery-kids", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 82003n, topicId: 81001n, slug: "digital-art",
    title_fa: "هنر دیجیتال", title_sv: "Digital konst",
    excerpt_fa: "طراحی و نقاشی دیجیتال با تبلت برای کودکان ۹ تا ۱۴ ساله", excerpt_sv: "Digital design och målning med surfplatta för barn 9–14 år",
    ...body("هنر دیجیتال", "Digital konst"),
    icon: "Monitor", imageUrl: img("digital-art-kids", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  // Science
  {
    id: 83001n, topicId: 81002n, slug: "robotics-junior",
    title_fa: "رباتیک مقدماتی", title_sv: "Robotteknik junior",
    excerpt_fa: "ساخت ربات با لِگو Mindstorms برای کودکان ۸ تا ۱۲ ساله", excerpt_sv: "Bygg robotar med Lego Mindstorms för barn 8–12 år",
    ...body("رباتیک مقدماتی", "Robotteknik junior"),
    formTemplateId: 87021n,
    icon: "Cpu", imageUrl: img("robotics-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(48),
  },
  {
    id: 83002n, topicId: 81002n, slug: "chemistry-experiments",
    title_fa: "آزمایش‌های شیمی", title_sv: "Kemiexperiment",
    excerpt_fa: "آتشفشان سرکه، رنگ‌های جادویی و آزمایش‌های هیجان‌انگیز", excerpt_sv: "Ättiksvulkan, magiska färger och spännande experiment",
    ...body("آزمایش‌های شیمی", "Kemiexperiment"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک", label_sv: "Barnets namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "select", label_fa: "پایه تحصیلی", label_sv: "Skolklass", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "کلاس اول و دوم", sv: "Klass 1–2" }, { fa: "کلاس سوم و چهارم", sv: "Klass 3–4" }, { fa: "کلاس پنجم و ششم", sv: "Klass 5–6" }], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "نام والدین", label_sv: "Förälderns namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "email", label_fa: "ایمیل والدین", label_sv: "Förälderns e-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "text", label_fa: "آلرژی شیمیایی", label_sv: "Kemisk allergi", placeholder_fa: "مثلاً لاتکس، برخی رنگ‌ها", placeholder_sv: "T.ex. latex, vissa färger", required: false, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "checkbox", label_fa: "فرزندم قوانین ایمنی آزمایشگاه را رعایت می‌کند", label_sv: "Mitt barn följer laboratoriesäkerhetsreglerna", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 6n },
    ],
    icon: "FlaskConical", imageUrl: img("chemistry-kids", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(45),
  },
  // Music
  {
    id: 84001n, topicId: 81003n, slug: "ukulele-kids",
    title_fa: "اوکلله برای کودکان", title_sv: "Ukulele för barn",
    excerpt_fa: "دوره ۱۰ هفته‌ای اوکلله با کنسرت پایانی — ابزار در اختیار", excerpt_sv: "10-veckorskurs i ukulele med avslutningskonsert — instrument ingår",
    ...body("اوکلله برای کودکان", "Ukulele för barn"),
    formTemplateId: 87020n,
    icon: "Music", imageUrl: img("ukulele-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(42),
  },
  {
    id: 84002n, topicId: 81003n, slug: "kids-choir",
    title_fa: "گروه کر کودکان", title_sv: "Barnkör",
    excerpt_fa: "آواز گروهی، تنفس صحیح و هماهنگی برای ۷ تا ۱۲ ساله", excerpt_sv: "Kör, korrekt andning och harmoni för 7–12 år",
    ...body("گروه کر کودکان", "Barnkör"),
    icon: "Mic", imageUrl: img("kids-choir", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(38),
  },
  // Drama
  {
    id: 85001n, topicId: 81004n, slug: "improv-theater",
    title_fa: "تئاتر بداهه", title_sv: "Improvisationsteater",
    excerpt_fa: "اعتماد به نفس، خلاقیت و مهارت‌های اجتماعی از طریق نمایش", excerpt_sv: "Självförtroende, kreativitet och sociala färdigheter genom teater",
    ...body("تئاتر بداهه", "Improvisationsteater"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام نوجوان", label_sv: "Ungdomens namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن", label_sv: "Ålder", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "تجربه قبلی نمایش", label_sv: "Tidigare teatererfarenhet", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "هیچ تجربه‌ای ندارم", sv: "Ingen erfarenhet" }, { fa: "کمی تجربه دارم", sv: "Lite erfarenhet" }, { fa: "در گروه نمایشی بوده‌ام", sv: "Har medverkat i teatergrupp" }], sortOrder: 3n },
      { id: 4n, fieldType: "phone", label_fa: "تماس والدین", label_sv: "Förälderns telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
    ],
    icon: "Star", imageUrl: img("improv-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(35),
  },
  // Outdoor
  {
    id: 86001n, topicId: 81005n, slug: "nature-explorers",
    title_fa: "کاشف‌های طبیعت", title_sv: "Naturutforskare",
    excerpt_fa: "ماهانه — پیاده‌روی و شناسایی گیاهان برای ۵ تا ۱۲ ساله", excerpt_sv: "Månadsvis — vandring och växtidentifiering för 5–12 år",
    ...body("کاشف‌های طبیعت", "Naturutforskare"),
    formTemplateId: 87020n,
    icon: "TreePine", imageUrl: img("nature-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(30),
  },
  {
    id: 86002n, topicId: 81005n, slug: "survival-skills-teens",
    title_fa: "مهارت‌های بقا در طبیعت", title_sv: "Överlevnadskunskaper",
    excerpt_fa: "دوره ۲ روزه — چادر، آتش و جهت‌یابی برای ۱۱ تا ۱۶ ساله", excerpt_sv: "2-dagarskurs — tält, eld och orientering för 11–16 år",
    ...body("مهارت‌های بقا در طبیعت", "Överlevnadskunskaper"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام نوجوان", label_sv: "Ungdomens namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن", label_sv: "Ålder", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "تجربه در طبیعت", label_sv: "Utomhuserfarenhet", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "بدون تجربه قبلی", sv: "Ingen tidigare erfarenhet" }, { fa: "چند سفر کمپینگ", sv: "Några campingresor" }, { fa: "تجربه پیاده‌روی و کمپینگ زیاد", sv: "Stor erfarenhet av vandring och camping" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "نام والدین / سرپرست", label_sv: "Förälderns / vårdnadshavarens namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "phone", label_fa: "تماس والدین", label_sv: "Förälderns telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "textarea", label_fa: "شرایط پزشکی یا محدودیت‌های فعالیت", label_sv: "Medicinska tillstånd eller aktivitetsbegränsningar", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 6n },
      { id: 7n, fieldType: "checkbox", label_fa: "خطرات فعالیت‌های خارج از درب را می‌پذیرم و تمام دستورالعمل‌ها را رعایت می‌کنم", label_sv: "Jag accepterar riskerna med utomhusaktiviteter och följer alla instruktioner", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 7n },
    ],
    icon: "TreePine", imageUrl: img("survival-kids", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(25),
  },
];

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 87001n, platform: "instagram", url: "https://instagram.com/wonderland.kids", sortOrder: 1n },
  { id: 87002n, platform: "facebook", url: "https://facebook.com/wonderlandkids", sortOrder: 2n },
  { id: 87003n, platform: "website", url: "https://wonderland.example.se", sortOrder: 3n },
];

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("wonderland-about", 1200, 500),
  body_fa: "<h2>درباره مرکز کودکان وندرلند</h2><p>وندرلند از سال ۲۰۱۰ به عنوان یک مرکز فعالیت‌های کودکان در خدمت خانواده‌های منطقه است. ما باور داریم هر کودک استعدادهای منحصربه‌فردی دارد که باید کشف و پرورش یابد. تیم ما متشکل از مربیان متخصص و دلسوز است که هر روز تلاش می‌کنند محیطی امن و الهام‌بخش برای کودکان ایجاد کنند.</p>",
  body_sv: "<h2>Om Wonderland Barnaktiviteter</h2><p>Wonderland har sedan 2010 tjänat familjerna i området som ett barnaktivitetscenter. Vi tror att varje barn har unika talanger som bör upptäckas och vårdas. Vårt team av specialiserade och omtänksamma tränare arbetar varje dag för att skapa en säker och inspirerande miljö för barn.</p>",
};

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 87020n, name_fa: "ثبت‌نام فعالیت کودکان", name_sv: "Barnaktivitetsregistrering",
    description_fa: "فرم استاندارد با اطلاعات کودک، والدین و تماس اضطراری", description_sv: "Standardformulär med barnuppgifter, föräldrar och nödkontakt",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک", label_sv: "Barnets namn", placeholder_fa: "نام کامل کودک", placeholder_sv: "Barnets fullständiga namn", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن کودک", label_sv: "Barnets ålder", placeholder_fa: "سن (سال)", placeholder_sv: "Ålder (år)", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "جنسیت", label_sv: "Kön", placeholder_fa: "", placeholder_sv: "", required: false, options: [{ fa: "پسر", sv: "Pojke" }, { fa: "دختر", sv: "Flicka" }, { fa: "ترجیح نمی‌دهم بگویم", sv: "Föredrar att inte ange" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "نام والدین / سرپرست", label_sv: "Förälderns / vårdnadshavarens namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "phone", label_fa: "شماره تماس والدین", label_sv: "Förälderns telefonnummer", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "email", label_fa: "ایمیل والدین", label_sv: "Förälderns e-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 6n },
      { id: 7n, fieldType: "phone", label_fa: "شماره اضطراری (غیر از شماره بالا)", label_sv: "Nödtelefon (annan än ovan)", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 7n },
      { id: 8n, fieldType: "textarea", label_fa: "نیازهای پزشکی یا آلرژی", label_sv: "Medicinska behov eller allergier", placeholder_fa: "هر آلرژی، دارو یا نیاز پزشکی که باید بدانیم", placeholder_sv: "Allergier, mediciner eller medicinska behov vi bör känna till", required: false, options: [], sortOrder: 8n },
      { id: 9n, fieldType: "checkbox", label_fa: "رضایت می‌دهم عکس‌های کودکم در رسانه‌های مرکز استفاده شود", label_sv: "Jag godkänner att mitt barns foton används i centrets medier", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 9n },
    ],
    createdAt: ts(100),
  },
  {
    id: 87021n, name_fa: "ثبت‌نام علوم / رباتیک", name_sv: "STEM / Robotteknik-registrering",
    description_fa: "فرم با اطلاعات پایه تحصیلی و رضایت ایمنی آزمایشگاه", description_sv: "Formulär med skolklass och laboratoriesäkerhetsmedgivande",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک", label_sv: "Barnets namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن", label_sv: "Ålder", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "پایه تحصیلی", label_sv: "Skolklass", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "کلاس اول و دوم", sv: "Klass 1–2" }, { fa: "کلاس سوم و چهارم", sv: "Klass 3–4" }, { fa: "کلاس پنجم و ششم", sv: "Klass 5–6" }, { fa: "راهنمایی / کلاس ۷–۹", sv: "Klass 7–9" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "نام والدین", label_sv: "Förälderns namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "email", label_fa: "ایمیل والدین", label_sv: "Förälderns e-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "checkbox", label_fa: "فرزندم قوانین ایمنی آزمایشگاه / کارگاه را رعایت می‌کند", label_sv: "Mitt barn följer säkerhetsreglerna i laboratoriet/verkstaden", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 6n },
    ],
    createdAt: ts(95),
  },
];

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 89001n, name: "فاطمه موسوی", email: "fateme@example.com", phone: "+46701122334", message: "سلام، آیا برنامه‌ای برای کودکان ۳ ساله هم دارید؟", createdAt: ts(2) },
  { id: 89002n, name: "Lena Ström", email: "lena.s@example.se", phone: "+46709988776", message: "Hej! Erbjuder ni kvällsklasser i kreativ konst för barn?", createdAt: ts(5) },
  { id: 89003n, name: "Reza Ahmadi", email: "reza.a@example.com", phone: "+46703322114", message: "آیا امکان پرداخت ماهانه به جای پرداخت کامل دوره وجود دارد؟", createdAt: ts(9) },
];

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 89010n, activityId: 82001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام کودک / Barnets namn", value: "Sara Hosseini" },
      { fieldId: 2n, fieldLabel: "سن کودک / Barnets ålder", value: "8" },
      { fieldId: 3n, fieldLabel: "جنسیت / Kön", value: "دختر / Flicka" },
      { fieldId: 4n, fieldLabel: "نام والدین / Förälderns namn", value: "Maryam Hosseini" },
      { fieldId: 5n, fieldLabel: "تماس والدین / Förälderns telefon", value: "070-1112233" },
      { fieldId: 6n, fieldLabel: "ایمیل والدین / Förälderns e-post", value: "maryam@example.com" },
      { fieldId: 7n, fieldLabel: "شماره اضطراری / Nödtelefon", value: "070-9998877" },
    ],
    createdAt: ts(3),
  },
  {
    id: 89011n, activityId: 83001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام کودک / Barnets namn", value: "Liam Eriksson" },
      { fieldId: 2n, fieldLabel: "سن / Ålder", value: "10" },
      { fieldId: 3n, fieldLabel: "پایه تحصیلی / Skolklass", value: "کلاس سوم و چهارم / Klass 3–4" },
      { fieldId: 4n, fieldLabel: "نام والدین / Förälderns namn", value: "Johan Eriksson" },
      { fieldId: 5n, fieldLabel: "ایمیل والدین / Förälderns e-post", value: "johan@example.se" },
      { fieldId: 6n, fieldLabel: "رضایت ایمنی / Säkerhetsmedgivande", value: "true" },
    ],
    createdAt: ts(7),
  },
];
