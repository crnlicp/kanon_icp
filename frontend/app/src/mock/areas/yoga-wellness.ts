import type {
  SiteSettingsReturn,
  TopicReturn,
  ActivityReturn,
  HeroSlideReturn,
  AboutContentReturn,
  ContactMessageReturn,
  SocialLinkReturn,
  RegistrationReturn,
  FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const ts = (daysAgo: number) =>
  BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

// ─── Site Settings ────────────────────────────────────────────────────────────

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("serenity-logo", 200, 200),
  title_fa: "سرنیتی",
  title_sv: "Serenity",
  subtitle_fa: "استودیوی یوگا، مدیتیشن و تندرستی",
  subtitle_sv: "Yoga, meditation och välmåendestudio",
  landingBackgroundUrl: img("serenity-landing", 1920, 1080),
  topicsBackgroundUrl: img("serenity-topics", 1920, 1080),
  mockMode: true,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const mockTopics: TopicReturn[] = [
  {
    id: 11001n, slug: "morning-practice",
    title_fa: "تمرین صبحگاهی", title_sv: "Morgonövning",
    description_fa: "کلاس‌های یوگا در هنگام سپیده‌دم برای شروعی پرانرژی",
    description_sv: "Yogaklasser i gryningen för en energifull start på dagen",
    icon: "Sun", backgroundUrl: img("morning-yoga-bg", 1920, 1080),
    sortOrder: 1n, createdAt: ts(90),
  },
  {
    id: 11002n, slug: "mindfulness",
    title_fa: "ذهن‌آگاهی", title_sv: "Mindfulness",
    description_fa: "مدیتیشن و تکنیک‌های تنفسی برای آرامش ذهن",
    description_sv: "Meditation och andningstekniker för mentalt lugn",
    icon: "Brain", backgroundUrl: img("mindfulness-bg", 1920, 1080),
    sortOrder: 2n, createdAt: ts(85),
  },
  {
    id: 11003n, slug: "nutrition",
    title_fa: "تغذیه و سلامت", title_sv: "Kost och hälsa",
    description_fa: "کارگاه‌های تغذیه سالم و آشپزی گیاهی",
    description_sv: "Workshops om hälsosam kost och vegetarisk matlagning",
    icon: "Apple", backgroundUrl: img("nutrition-bg", 1920, 1080),
    sortOrder: 3n, createdAt: ts(80),
  },
  {
    id: 11004n, slug: "retreats",
    title_fa: "اردوهای رفاهی", title_sv: "Välmåenderetreat",
    description_fa: "اردوهای آخر هفته‌ای برای بازیابی انرژی در طبیعت",
    description_sv: "Helgretreat för energiåterhämtning i naturen",
    icon: "Tent", backgroundUrl: img("retreat-bg", 1920, 1080),
    sortOrder: 4n, createdAt: ts(75),
  },
  {
    id: 11005n, slug: "healing-arts",
    title_fa: "هنرهای درمانی", title_sv: "Helande konstformer",
    description_fa: "صدادرمانی، رایحه‌درمانی و تکنیک‌های انرژی‌درمانی",
    description_sv: "Ljudterapi, aromaterapi och energiläkningstekniker",
    icon: "Heart", backgroundUrl: img("healing-bg", 1920, 1080),
    sortOrder: 5n, createdAt: ts(70),
  },
];

// ─── Activities ───────────────────────────────────────────────────────────────

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>این برنامه با هدف ارتقاء سلامت جسمی و روحی شما طراحی شده است. در فضایی آرام و حمایت‌گر، مربیان مجرب ما شما را در این سفر تحول‌آفرین همراهی می‌کنند.</p><p>ظرفیت کلاس محدود است. همین امروز ثبت‌نام کنید.</p>`,
  body_sv: `<h2>${sv}</h2><p>Detta program är utformat för att förbättra din fysiska och mentala hälsa. I en lugn och stödjande miljö guidar våra erfarna instruktörer dig på denna transformativa resa.</p><p>Klassstorleken är begränsad. Registrera dig idag.</p>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // ── Morning Practice ──
  {
    id: 12001n, topicId: 11001n, slug: "sunrise-flow",
    title_fa: "جریان طلوع آفتاب", title_sv: "Soluppgångsflöde",
    excerpt_fa: "کلاس یوگا ویناسا در سپیده‌دم برای بیداری بدن و ذهن",
    excerpt_sv: "Vinyasayogaklass vid gryningen för att väcka kropp och sinne",
    ...body("جریان طلوع آفتاب", "Soluppgångsflöde"),
    formTemplateId: 17001n,
    icon: "Sun", imageUrl: img("sunrise-yoga", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 12002n, topicId: 11001n, slug: "yin-yoga",
    title_fa: "یین یوگا", title_sv: "Yin yoga",
    excerpt_fa: "یوگای آرام با نگه داشتن طولانی پوزیشن‌ها برای انعطاف عمیق",
    excerpt_sv: "Lugn yoga med långa positionshållningar för djup flexibilitet",
    ...body("یین یوگا", "Yin yoga"),
    icon: "Moon", imageUrl: img("yin-yoga", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 12003n, topicId: 11001n, slug: "power-vinyasa",
    title_fa: "پاور ویناسا", title_sv: "Power vinyasa",
    excerpt_fa: "کلاس یوگای پرشور برای تقویت عضلات و استقامت",
    excerpt_sv: "Intensiv yogaklass för att stärka muskler och uthållighet",
    ...body("پاور ویناسا", "Power vinyasa"),
    formTemplateId: 17001n,
    icon: "Zap", imageUrl: img("power-yoga", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 12004n, topicId: 11001n, slug: "chair-yoga",
    title_fa: "یوگا با صندلی", title_sv: "Stolsyoga",
    excerpt_fa: "یوگای مناسب برای سالمندان و افراد با محدودیت حرکتی",
    excerpt_sv: "Yoga anpassad för äldre och personer med rörelsebegränsningar",
    ...body("یوگا با صندلی", "Stolsyoga"),
    icon: "Armchair", imageUrl: img("chair-yoga", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 12005n, topicId: 11001n, slug: "beginners-yoga",
    title_fa: "یوگا برای مبتدیان", title_sv: "Yoga för nybörjare",
    excerpt_fa: "مقدمه‌ای کامل بر یوگا برای کسانی که تازه شروع می‌کنند",
    excerpt_sv: "En fullständig introduktion till yoga för dem som just börjar",
    ...body("یوگا برای مبتدیان", "Yoga för nybörjare"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "آیا سابقه آسیب جسمی دارید؟", label_sv: "Har du haft fysiska skador?", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "خیر", sv: "Nej" }, { fa: "بله، توضیح می‌دهم", sv: "Ja, jag förklarar" }], sortOrder: 3n },
      { id: 4n, fieldType: "textarea", label_fa: "توضیحات پزشکی", label_sv: "Medicinsk information", placeholder_fa: "اگر آسیب یا بیماری دارید توضیح دهید", placeholder_sv: "Beskriv eventuella skador eller sjukdomar", required: false, options: [], sortOrder: 4n },
    ],
    icon: "Flower2", imageUrl: img("beginner-yoga", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(40),
  },
  // ── Mindfulness ──
  {
    id: 12006n, topicId: 11002n, slug: "guided-meditation",
    title_fa: "مدیتیشن هدایت‌شده", title_sv: "Guidad meditation",
    excerpt_fa: "جلسات مدیتیشن با راهنمایی مربی برای تمرکز و آرامش",
    excerpt_sv: "Meditationssessioner med instruktörens vägledning för koncentration",
    ...body("مدیتیشن هدایت‌شده", "Guidad meditation"),
    formTemplateId: 17001n,
    icon: "Brain", imageUrl: img("guided-meditation", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 12007n, topicId: 11002n, slug: "breathwork",
    title_fa: "تنفس درمانی", title_sv: "Andningsövningar",
    excerpt_fa: "تکنیک‌های تنفسی پرانایاما برای کنترل استرس و انرژی",
    excerpt_sv: "Pranayama-andningstekniker för stresshantering och energi",
    ...body("تنفس درمانی", "Andningsövningar"),
    icon: "Wind", imageUrl: img("breathwork", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 12008n, topicId: 11002n, slug: "mindful-walking",
    title_fa: "پیاده‌روی ذهن‌آگاهانه", title_sv: "Medveten promenad",
    excerpt_fa: "پیاده‌روی در طبیعت با تمرکز بر حضور در لحظه",
    excerpt_sv: "Promenad i naturen med fokus på närvaro i nuet",
    ...body("پیاده‌روی ذهن‌آگاهانه", "Medveten promenad"),
    icon: "Footprints", imageUrl: img("mindful-walking", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 12009n, topicId: 11002n, slug: "stress-relief",
    title_fa: "رهایی از استرس", title_sv: "Stressavlastning",
    excerpt_fa: "کارگاه عملی برای مدیریت استرس روزانه با ابزارهای ذهن‌آگاهی",
    excerpt_sv: "Praktisk workshop för att hantera vardagsstress med mindfulnessverktyg",
    ...body("رهایی از استرس", "Stressavlastning"),
    formTemplateId: 17001n,
    icon: "Smile", imageUrl: img("stress-relief", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 12010n, topicId: 11002n, slug: "sleep-meditation",
    title_fa: "مدیتیشن خواب", title_sv: "Sömnmeditation",
    excerpt_fa: "تکنیک‌هایی برای بهبود کیفیت خواب و آرامش عمیق",
    excerpt_sv: "Tekniker för att förbättra sömnkvalitet och djup avslappning",
    ...body("مدیتیشن خواب", "Sömnmeditation"),
    icon: "Moon", imageUrl: img("sleep-meditation", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(38),
  },
  // ── Nutrition ──
  {
    id: 12011n, topicId: 11003n, slug: "meal-planning",
    title_fa: "برنامه‌ریزی غذایی", title_sv: "Måltidsplanering",
    excerpt_fa: "کارگاه طراحی برنامه غذایی متعادل برای سلامت بهتر",
    excerpt_sv: "Workshop för att utforma en balanserad kostplan för bättre hälsa",
    ...body("برنامه‌ریزی غذایی", "Måltidsplanering"),
    formTemplateId: 17002n,
    icon: "ClipboardList", imageUrl: img("meal-planning", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 12012n, topicId: 11003n, slug: "smoothie-bowl-class",
    title_fa: "کلاس اسموتی بول", title_sv: "Smoothiebowl-klass",
    excerpt_fa: "یادگیری تهیه اسموتی بول‌های مغذی و رنگارنگ",
    excerpt_sv: "Lär dig göra näringsrika och färgglada smoothiebowls",
    ...body("کلاس اسموتی بول", "Smoothiebowl-klass"),
    icon: "Salad", imageUrl: img("smoothie-bowl", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 12013n, topicId: 11003n, slug: "plant-based-cooking",
    title_fa: "آشپزی گیاهی", title_sv: "Växtbaserad matlagning",
    excerpt_fa: "پخت غذاهای خوشمزه و مغذی بدون گوشت",
    excerpt_sv: "Laga läcker och näringsrik mat utan kött",
    ...body("آشپزی گیاهی", "Växtbaserad matlagning"),
    formTemplateId: 17002n,
    icon: "Leaf", imageUrl: img("plant-cooking", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 12014n, topicId: 11003n, slug: "nutrition-consultation",
    title_fa: "مشاوره تغذیه", title_sv: "Kostконсультation",
    excerpt_fa: "جلسه مشاوره خصوصی با متخصص تغذیه",
    excerpt_sv: "Privat konsultation med en kostrådgivare",
    ...body("مشاوره تغذیه", "Kostkonsultation"),
    icon: "Stethoscope", imageUrl: img("nutrition-consult", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 12015n, topicId: 11003n, slug: "fermentation-gut-health",
    title_fa: "تخمیر و سلامت روده", title_sv: "Fermentering och tarmhälsa",
    excerpt_fa: "آشنایی با غذاهای تخمیری و تأثیر آن‌ها بر سلامت گوارش",
    excerpt_sv: "Lär dig om fermenterade livsmedel och deras effekt på tarmhälsan",
    ...body("تخمیر و سلامت روده", "Fermentering och tarmhälsa"),
    icon: "Flask", imageUrl: img("fermentation", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(36),
  },
  // ── Retreats ──
  {
    id: 12016n, topicId: 11004n, slug: "weekend-wellness-retreat",
    title_fa: "اردوی رفاهی آخر هفته", title_sv: "Välmåenderetreat på helgen",
    excerpt_fa: "دو روز یوگا، مدیتیشن و آشپزی سالم در طبیعت",
    excerpt_sv: "Två dagar med yoga, meditation och hälsosam matlagning i naturen",
    ...body("اردوی رفاهی آخر هفته", "Välmåenderetreat på helgen"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام کامل", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "تجربه یوگا", label_sv: "Yogaerfarenhet", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "radio", label_fa: "ترجیح غذایی", label_sv: "Kostpreferens", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "همه‌چیزخور", sv: "Allätare" }, { fa: "گیاهی", sv: "Vegetarisk" }, { fa: "وگان", sv: "Vegansk" }], sortOrder: 5n },
    ],
    icon: "Tent", imageUrl: img("wellness-retreat", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 12017n, topicId: 11004n, slug: "forest-bathing",
    title_fa: "حمام جنگل", title_sv: "Skogsbad",
    excerpt_fa: "تجربه شینرین‌یوکو — غوطه‌وری درمانی در جنگل",
    excerpt_sv: "Upplev Shinrin-yoku — terapeutisk nedsänkning i skogen",
    ...body("حمام جنگل", "Skogsbad"),
    icon: "Trees", imageUrl: img("forest-bathing", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 12018n, topicId: 11004n, slug: "beach-yoga-retreat",
    title_fa: "اردوی یوگا در ساحل", title_sv: "Strandyogaretreat",
    excerpt_fa: "یوگا و مدیتیشن در کنار دریا با غروب آفتاب",
    excerpt_sv: "Yoga och meditation vid havet med solnedgångssyn",
    ...body("اردوی یوگا در ساحل", "Strandyogaretreat"),
    formTemplateId: 17001n,
    icon: "Waves", imageUrl: img("beach-yoga", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 12019n, topicId: 11004n, slug: "silent-retreat",
    title_fa: "اردوی سکوت", title_sv: "Tystnadretreat",
    excerpt_fa: "یک روز سکوت کامل، مراقبه و درون‌نگری",
    excerpt_sv: "En dag av fullständig tystnad, meditation och introspection",
    ...body("اردوی سکوت", "Tystnadretreat"),
    icon: "VolumeX", imageUrl: img("silent-retreat", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 12020n, topicId: 11004n, slug: "new-moon-ceremony",
    title_fa: "مراسم ماه نو", title_sv: "Nymåneceremoni",
    excerpt_fa: "گردهمایی ماهانه با تأمل، آرزو و تمرین مشترک",
    excerpt_sv: "Månadssamling med reflektion, intention och gemensam övning",
    ...body("مراسم ماه نو", "Nymåneceremoni"),
    icon: "Moon", imageUrl: img("new-moon", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(34),
  },
  // ── Healing Arts ──
  {
    id: 12021n, topicId: 11005n, slug: "sound-bath",
    title_fa: "حمام صدا", title_sv: "Ljudbad",
    excerpt_fa: "تجربه درمانی با کاسه‌های کریستالی و تیبتی",
    excerpt_sv: "Terapeutisk upplevelse med kristall- och tibetanska skålar",
    ...body("حمام صدا", "Ljudbad"),
    formTemplateId: 17001n,
    icon: "Music", imageUrl: img("sound-bath", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 12022n, topicId: 11005n, slug: "reiki-intro",
    title_fa: "مقدمه‌ای بر ریکی", title_sv: "Introduktion till reiki",
    excerpt_fa: "آشنایی با هنر انرژی‌درمانی ریکی جهت دستیابی به سلامت",
    excerpt_sv: "Bekanta dig med reikienergiläkningens konst för välmående",
    ...body("مقدمه‌ای بر ریکی", "Introduktion till reiki"),
    icon: "Sparkles", imageUrl: img("reiki", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 12023n, topicId: 11005n, slug: "aromatherapy-workshop",
    title_fa: "کارگاه رایحه‌درمانی", title_sv: "Aromaterapiworkshop",
    excerpt_fa: "ساختن ترکیب‌های شخصی روغن‌های اساسی برای آرامش",
    excerpt_sv: "Skapa personliga blandningar av eteriska oljor för avslappning",
    ...body("کارگاه رایحه‌درمانی", "Aromaterapiworkshop"),
    formTemplateId: 17002n,
    icon: "Droplets", imageUrl: img("aromatherapy", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 12024n, topicId: 11005n, slug: "crystal-healing",
    title_fa: "درمان با کریستال", title_sv: "Kristallterapi",
    excerpt_fa: "کشف خواص انرژی‌بخش سنگ‌ها و کریستال‌های درمانی",
    excerpt_sv: "Utforska de energigivande egenskaperna hos läkande stenar och kristaller",
    ...body("درمان با کریستال", "Kristallterapi"),
    icon: "Diamond", imageUrl: img("crystal-healing", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 12025n, topicId: 11005n, slug: "restorative-stretching",
    title_fa: "کشش بازیابی", title_sv: "Återhämtande stretching",
    excerpt_fa: "کلاس کشش عمیق برای رهایی از تنش عضلانی و استرس",
    excerpt_sv: "Djupstretchingklass för att frigöra muskelspänningar och stress",
    ...body("کشش بازیابی", "Återhämtande stretching"),
    icon: "Activity", imageUrl: img("restorative", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(32),
  },
];

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export const mockSlides: HeroSlideReturn[] = [
  { id: 13001n, topicId: 11001n, imageUrl: img("slide-morning-1", 1920, 800), title_fa: "با طلوع آفتاب شروع کنید", title_sv: "Börja med soluppgången", subtitle_fa: "کلاس‌های یوگا هر روز صبح", subtitle_sv: "Yogaklasser varje morgon", ctaText_fa: "مشاهده برنامه", ctaText_sv: "Se schema", ctaLink: "/topics/morning-practice", sortOrder: 1n },
  { id: 13002n, topicId: 11001n, imageUrl: img("slide-morning-2", 1920, 800), title_fa: "پاور ویناسا — قدرت درونی", title_sv: "Power vinyasa — inre styrka", subtitle_fa: "برای کسانی که بیشتر می‌خواهند", subtitle_sv: "För dem som vill ha mer", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/morning-practice/power-vinyasa", sortOrder: 2n },
  { id: 13003n, topicId: 11002n, imageUrl: img("slide-mind-1", 1920, 800), title_fa: "آرامش در هر لحظه", title_sv: "Lugn i varje ögonblick", subtitle_fa: "تکنیک‌های مدیتیشن برای زندگی مدرن", subtitle_sv: "Meditationstekniker för det moderna livet", ctaText_fa: "بیاموزید", ctaText_sv: "Lär dig", ctaLink: "/topics/mindfulness", sortOrder: 1n },
  { id: 13004n, topicId: 11002n, imageUrl: img("slide-mind-2", 1920, 800), title_fa: "مدیتیشن هدایت‌شده", title_sv: "Guidad meditation", subtitle_fa: "جلسه اول رایگان", subtitle_sv: "Första sessionen gratis", ctaText_fa: "رزرو کنید", ctaText_sv: "Boka nu", ctaLink: "/topics/mindfulness/guided-meditation", sortOrder: 2n },
  { id: 13005n, topicId: 11003n, imageUrl: img("slide-nutrition-1", 1920, 800), title_fa: "غذا به‌عنوان دارو", title_sv: "Mat som medicin", subtitle_fa: "تغذیه سالم برای بدن و روح", subtitle_sv: "Hälsosam kost för kropp och själ", ctaText_fa: "کشف کنید", ctaText_sv: "Upptäck", ctaLink: "/topics/nutrition", sortOrder: 1n },
  { id: 13006n, topicId: 11003n, imageUrl: img("slide-nutrition-2", 1920, 800), title_fa: "آشپزی گیاهی", title_sv: "Växtbaserad matlagning", subtitle_fa: "سالم، خوشمزه، پایدار", subtitle_sv: "Hälsosamt, gott, hållbart", ctaText_fa: "ثبت‌نام در کارگاه", ctaText_sv: "Anmäl dig till workshop", ctaLink: "/topics/nutrition/plant-based-cooking", sortOrder: 2n },
  { id: 13007n, topicId: 11004n, imageUrl: img("slide-retreat-1", 1920, 800), title_fa: "فرار از شلوغی شهر", title_sv: "Flykt från stadsbuller", subtitle_fa: "اردوهای ریست‌ست در طبیعت", subtitle_sv: "Återhämtningsretreat i naturen", ctaText_fa: "رزرو محل", ctaText_sv: "Boka plats", ctaLink: "/topics/retreats", sortOrder: 1n },
  { id: 13008n, topicId: 11004n, imageUrl: img("slide-retreat-2", 1920, 800), title_fa: "اردوی آخر هفته ۲۰۲۶", title_sv: "Helgretreat 2026", subtitle_fa: "ظرفیت محدود — همین امروز رزرو کنید", subtitle_sv: "Begränsad kapacitet — boka idag", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/retreats/weekend-wellness-retreat", sortOrder: 2n },
  { id: 13009n, topicId: 11005n, imageUrl: img("slide-healing-1", 1920, 800), title_fa: "درمان از طریق صدا", title_sv: "Läkning genom ljud", subtitle_fa: "حمام صدا با کاسه‌های کریستالی", subtitle_sv: "Ljudbad med kristallskålar", ctaText_fa: "تجربه کنید", ctaText_sv: "Upplev det", ctaLink: "/topics/healing-arts", sortOrder: 1n },
  { id: 13010n, topicId: 11005n, imageUrl: img("slide-healing-2", 1920, 800), title_fa: "کارگاه رایحه‌درمانی", title_sv: "Aromaterapiworkshop", subtitle_fa: "روغن‌های اساسی برای آرامش عمیق", subtitle_sv: "Eteriska oljor för djup avslappning", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/topics/healing-arts/aromatherapy-workshop", sortOrder: 2n },
];

// ─── About ────────────────────────────────────────────────────────────────────

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("serenity-about", 1920, 600),
  body_fa: `<h2>درباره سرنیتی</h2><p>استودیوی سرنیتی یک مرکز جامع یوگا و تندرستی است که با هدف کمک به افراد برای دستیابی به تعادل جسمی، ذهنی و روحی تأسیس شده است.</p><h3>فلسفه ما</h3><p>ما معتقدیم که سلامتی فراتر از بدن فیزیکی است. در استودیوی سرنیتی، یوگا، مدیتیشن، تغذیه سالم و هنرهای درمانی را در یک محیط فراگیر و دلسوزانه یکپارچه می‌کنیم.</p><h3>مربیان ما</h3><p>تیم ما از مربیان گواهینامه‌دار و متخصصان باتجربه تشکیل شده است که هر کدام مسیر شخصی عمیقی در زمینه سلامت و تندرستی طی کرده‌اند.</p>`,
  body_sv: `<h2>Om Serenity</h2><p>Serenity Studio är ett heltäckande yoga- och välmåendecenter grundat för att hjälpa individer uppnå fysisk, mental och andlig balans.</p><h3>Vår filosofi</h3><p>Vi tror att hälsa sträcker sig bortom den fysiska kroppen. På Serenity Studio integrerar vi yoga, meditation, hälsosam kost och helande konstformer i en inkluderande och omtänksam miljö.</p><h3>Våra instruktörer</h3><p>Vårt team består av certifierade instruktörer och erfarna specialister som var och en har gått en djup personlig resa inom hälsa och välmående.</p>`,
};

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 14001n, name: "Emma Lindberg", email: "emma.l@example.com", phone: "+46701112233", message: "Hej! Jag är nybörjare inom yoga och undrar vilken klass som passar mig bäst.", createdAt: ts(3) },
  { id: 14002n, name: "Sofia Karlsson", email: "sofia.k@example.com", phone: "+46709988776", message: "Finns det möjlighet till privatlektioner i meditation?", createdAt: ts(7) },
  { id: 14003n, name: "Mia Berg", email: "mia.berg@example.com", phone: "+46703344556", message: "Jag har ryggproblem, är stolsyogan lämplig för mig?", createdAt: ts(12) },
  { id: 14004n, name: "Lars Persson", email: "lars.p@example.com", phone: "+46706655443", message: "Vad kostar ett månadsmedlemskap?", createdAt: ts(18) },
  { id: 14005n, name: "Anna Eriksson", email: "anna.e@example.com", phone: "+46708877665", message: "Kan jag boka ett provpass innan jag bestämmer mig?", createdAt: ts(22) },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 15001n, platform: "instagram", url: "https://instagram.com/serenity_wellness", sortOrder: 1n },
  { id: 15002n, platform: "facebook", url: "https://facebook.com/serenitywellness", sortOrder: 2n },
  { id: 15003n, platform: "youtube", url: "https://youtube.com/@serenitywellness", sortOrder: 3n },
  { id: 15004n, platform: "website", url: "https://serenitywellness.se", sortOrder: 4n },
  { id: 15005n, platform: "email", url: "mailto:hello@serenitywellness.se", sortOrder: 5n },
];

// ─── Registrations ────────────────────────────────────────────────────────────

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 16001n, activityId: 12001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Julia Svensson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "julia.s@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Ser fram emot soluppgångsflödet!" },
    ],
    createdAt: ts(2),
  },
  {
    id: 16002n, activityId: 12006n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Karin Nilsson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "karin.n@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Mediterar sedan 2 år, vill fördjupa min praktik." },
    ],
    createdAt: ts(4),
  },
  {
    id: 16003n, activityId: 12016n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Maria Gustafsson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "maria.g@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46701234567" },
      { fieldId: 4n, fieldLabel: "Yogaerfarenhet / تجربه یوگا", value: "Medel" },
      { fieldId: 5n, fieldLabel: "Kostpreferens / ترجیح غذایی", value: "Vegetarisk" },
    ],
    createdAt: ts(6),
  },
  {
    id: 16004n, activityId: 12021n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Hanna Andersson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "hanna.a@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Jag är väldigt nyfiken på ljudbad, aldrig provat!" },
    ],
    createdAt: ts(9),
  },
  { id: 16005n, activityId: 12011n, name: "Peter Olsson", email: "peter.o@example.com", phone: "+46705544332", message: "Vill lära mig mer om måltidsplanering för atleter.", fieldValues: [], createdAt: ts(11) },
];

// ─── Form Templates ───────────────────────────────────────────────────────────

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 17001n, name_fa: "ثبت‌نام کلاس", name_sv: "Klassregistrering",
    description_fa: "فرم پایه برای ثبت‌نام در کلاس‌ها", description_sv: "Grundformulär för registrering i klasser",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "Ditt fullständiga namn", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "Din e-postadress", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "textarea", label_fa: "پیام", label_sv: "Meddelande", placeholder_fa: "", placeholder_sv: "Något du vill att instruktören vet?", required: false, options: [], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 17002n, name_fa: "ثبت‌نام کارگاه", name_sv: "Workshopregistrering",
    description_fa: "فرم برای کارگاه‌های عملی", description_sv: "Formulär för praktiska workshops",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "", placeholder_sv: "Välj din nivå", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "اطلاعات بیشتر", label_sv: "Övrig information", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 17003n, name_fa: "ثبت‌نام اردو", name_sv: "Retreatregistrering",
    description_fa: "فرم کامل برای اردوهای چند روزه", description_sv: "Fullständigt formulär för flerdagarsretreat",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام کامل", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "تجربه یوگا", label_sv: "Yogaerfarenhet", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "radio", label_fa: "ترجیح غذایی", label_sv: "Kostpreferens", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "همه‌چیزخور", sv: "Allätare" }, { fa: "گیاهی", sv: "Vegetarisk" }, { fa: "وگان", sv: "Vegansk" }], sortOrder: 5n },
      { id: 6n, fieldType: "checkbox", label_fa: "شرایط را می‌پذیرم", label_sv: "Jag accepterar villkoren", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 6n },
    ],
    createdAt: ts(90),
  },
];
