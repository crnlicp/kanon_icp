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
  logoUrl: img("wildpath-logo", 200, 200),
  title_fa: "وایلدپث",
  title_sv: "WildPath",
  subtitle_fa: "باشگاه ماجراجویی در طبیعت",
  subtitle_sv: "Äventyrsklubb i naturen",
  landingBackgroundUrl: img("wildpath-landing", 1920, 1080),
  topicsBackgroundUrl: img("wildpath-topics", 1920, 1080),
  mockMode: true,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const mockTopics: TopicReturn[] = [
  {
    id: 41001n, slug: "hiking",
    title_fa: "کوهنوردی و پیاده‌روی", title_sv: "Vandring och trekking",
    description_fa: "پیاده‌روی در جنگل‌ها، کوه‌ها و مسیرهای طبیعی سوئد",
    description_sv: "Vandring i svenska skogar, berg och naturleder",
    icon: "Mountain", backgroundUrl: img("hiking-bg", 1920, 1080),
    sortOrder: 1n, createdAt: ts(90),
  },
  {
    id: 41002n, slug: "climbing",
    title_fa: "صخره‌نوردی", title_sv: "Klättring",
    description_fa: "بولدرینگ، تاپ‌روپ و لید کلایمبینگ در سالن و طبیعت",
    description_sv: "Bouldering, toprope och ledklättring inomhus och utomhus",
    icon: "Anchor", backgroundUrl: img("climbing-bg", 1920, 1080),
    sortOrder: 2n, createdAt: ts(85),
  },
  {
    id: 41003n, slug: "cycling",
    title_fa: "دوچرخه‌سواری", title_sv: "Cykling",
    description_fa: "گروه‌های دوچرخه‌سواری جاده، کوه و گراول",
    description_sv: "Grupper för väg-, mountain- och gravelcykling",
    icon: "Bike", backgroundUrl: img("cycling-bg", 1920, 1080),
    sortOrder: 3n, createdAt: ts(80),
  },
  {
    id: 41004n, slug: "water-sports",
    title_fa: "ورزش‌های آبی", title_sv: "Vattensporter",
    description_fa: "کایاک، پدل‌بورد، قایقرانی و شنای آب باز",
    description_sv: "Kajak, paddleboard, kanot och öppet vatten simning",
    icon: "Waves", backgroundUrl: img("water-sports-bg", 1920, 1080),
    sortOrder: 4n, createdAt: ts(75),
  },
  {
    id: 41005n, slug: "wildlife",
    title_fa: "طبیعت و حیات وحش", title_sv: "Natur och vilda djur",
    description_fa: "پرنده‌نگری، شناسایی گیاهان، ستاره‌شناسی و اکولوژی",
    description_sv: "Fågelskådning, växtidentifiering, stjärnskådning och ekologi",
    icon: "Leaf", backgroundUrl: img("wildlife-bg", 1920, 1080),
    sortOrder: 5n, createdAt: ts(70),
  },
];

// ─── Activities ───────────────────────────────────────────────────────────────

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>این برنامه برای کسانی طراحی شده که عاشق طبیعت و ماجراجویی هستند. راهنمایان مجرب ما امنیت، لذت و یادگیری را در کنار هم برای شما فراهم می‌کنند.</p><p>تجهیزات لازم را فراهم کنید و با انرژی بیایید!</p>`,
  body_sv: `<h2>${sv}</h2><p>Detta program är utformat för dem som älskar naturen och äventyret. Våra erfarna guider säkerställer säkerhet, glädje och lärande på samma gång.</p><p>Ta med nödvändig utrustning och kom med energi!</p>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // ── Hiking ──
  {
    id: 42001n, topicId: 41001n, slug: "local-trail-hike",
    title_fa: "پیاده‌روی در مسیرهای محلی", title_sv: "Vandring på lokala leder",
    excerpt_fa: "پیاده‌روی ۱۰ کیلومتری در مسیرهای نزدیک شهر برای مبتدیان",
    excerpt_sv: "10 km vandring på leder nära staden för nybörjare",
    ...body("پیاده‌روی در مسیرهای محلی", "Vandring på lokala leder"),
    formTemplateId: 47001n,
    icon: "Footprints", imageUrl: img("local-trail", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 42002n, topicId: 41001n, slug: "mountain-summit",
    title_fa: "صعود به قله", title_sv: "Topptur",
    excerpt_fa: "صعود یک‌روزه به قله‌های اطراف با راهنمای مجرب",
    excerpt_sv: "Endagstur till toppar i omgivningen med erfaren guide",
    ...body("صعود به قله", "Topptur"),
    formTemplateId: 47002n,
    icon: "Mountain", imageUrl: img("mountain-summit", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 42003n, topicId: 41001n, slug: "night-hike",
    title_fa: "پیاده‌روی شبانه", title_sv: "Nattpromenad",
    excerpt_fa: "تجربه جنگل در شب با چراغ‌پیشانی و ستاره‌های بی‌شمار",
    excerpt_sv: "Upplev skogen på natten med pannlampa och otaliga stjärnor",
    ...body("پیاده‌روی شبانه", "Nattpromenad"),
    icon: "Moon", imageUrl: img("night-hike", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 42004n, topicId: 41001n, slug: "trail-maintenance",
    title_fa: "روز نگهداری مسیر", title_sv: "Ledunderhållsdag",
    excerpt_fa: "داوطلبانه در نگهداری و بهسازی مسیرهای کوهنوردی شرکت کنید",
    excerpt_sv: "Delta frivilligt i underhåll och förbättring av vandringsleder",
    ...body("روز نگهداری مسیر", "Ledunderhållsdag"),
    icon: "Hammer", imageUrl: img("trail-maintenance", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 42005n, topicId: 41001n, slug: "nordic-walking",
    title_fa: "نوردیک واکینگ", title_sv: "Nordisk gång",
    excerpt_fa: "پیاده‌روی نوردیک با دو عصا — تمرینی کامل برای همه سنین",
    excerpt_sv: "Nordisk gång med stavar — fullständig träning för alla åldrar",
    ...body("نوردیک واکینگ", "Nordisk gång"),
    formTemplateId: 47001n,
    icon: "PersonStanding", imageUrl: img("nordic-walking", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(40),
  },
  // ── Climbing ──
  {
    id: 42006n, topicId: 41002n, slug: "bouldering-intro",
    title_fa: "مقدمه‌ای بر بولدرینگ", title_sv: "Introduktion till bouldering",
    excerpt_fa: "صخره‌نوردی بدون طناب بر روی سنگ‌های کم‌ارتفاع با زیرانداز ایمنی",
    excerpt_sv: "Klättring utan rep på låga stenar med säkerhetsmatta",
    ...body("مقدمه‌ای بر بولدرینگ", "Introduktion till bouldering"),
    formTemplateId: 47002n,
    icon: "Anchor", imageUrl: img("bouldering", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 42007n, topicId: 41002n, slug: "top-rope-basics",
    title_fa: "مبانی تاپ‌روپ", title_sv: "Toprope-grunder",
    excerpt_fa: "آموزش نکات ایمنی، هارنس‌بندی و تکنیک‌های اولیه صخره‌نوردی",
    excerpt_sv: "Säkerhetskunskap, selesättning och grundläggande klättringsteknik",
    ...body("مبانی تاپ‌روپ", "Toprope-grunder"),
    formTemplateId: 47002n,
    icon: "Shield", imageUrl: img("top-rope", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 42008n, topicId: 41002n, slug: "lead-climbing-course",
    title_fa: "دوره لید کلایمبینگ", title_sv: "Ledklättringskurs",
    excerpt_fa: "صخره‌نوردی پیشرفته با مدیریت طناب و چِکر برای خود",
    excerpt_sv: "Avancerad klättring med rephantering och säkring av sig själv",
    ...body("دوره لید کلایمبینگ", "Ledklättringskurs"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن اضطراری", label_sv: "Nödtelefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "تجربه صخره‌نوردی", label_sv: "Klättringserfarenhet", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "تاپ‌روپ - مبتدی", sv: "Toprope - nybörjare" }, { fa: "تاپ‌روپ - باتجربه", sv: "Toprope - erfaren" }, { fa: "لید قبلاً داشتم", sv: "Har ledat tidigare" }], sortOrder: 4n },
      { id: 5n, fieldType: "checkbox", label_fa: "مسئولیت‌پذیری برای خطرات احتمالی را می‌پذیرم", label_sv: "Jag accepterar ansvaret för eventuella risker", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
    ],
    icon: "ArrowUp", imageUrl: img("lead-climbing", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 42009n, topicId: 41002n, slug: "outdoor-crag-day",
    title_fa: "روز صخره‌نوردی در طبیعت", title_sv: "Klätterdag utomhus",
    excerpt_fa: "صخره‌نوردی روی سنگ‌های طبیعی در مکان‌های شناخته‌شده سوئد",
    excerpt_sv: "Klättring på naturliga klippor på kända platser i Sverige",
    ...body("روز صخره‌نوردی در طبیعت", "Klätterdag utomhus"),
    formTemplateId: 47002n,
    icon: "Mountain", imageUrl: img("crag-day", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 42010n, topicId: 41002n, slug: "strength-flexibility",
    title_fa: "قدرت و انعطاف برای صخره‌نورد", title_sv: "Styrka och flexibilitet för klättrare",
    excerpt_fa: "تمرین‌های خاص صخره‌نوردی برای تقویت انگشتان، بازوها و انعطاف",
    excerpt_sv: "Klätterspecifik träning för att stärka fingrar, armar och flexibilitet",
    ...body("قدرت و انعطاف برای صخره‌نورد", "Styrka och flexibilitet för klättrare"),
    icon: "Dumbbell", imageUrl: img("climbing-strength", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(38),
  },
  // ── Cycling ──
  {
    id: 42011n, topicId: 41003n, slug: "road-cycling-group",
    title_fa: "گروه دوچرخه‌سواری جاده", title_sv: "Vägcykelgrupp",
    excerpt_fa: "تورهای هفتگی ۵۰ تا ۱۰۰ کیلومتری برای دوچرخه‌سواران جاده",
    excerpt_sv: "Veckovisa turer på 50–100 km för vägcyklister",
    ...body("گروه دوچرخه‌سواری جاده", "Vägcykelgrupp"),
    formTemplateId: 47001n,
    icon: "Bike", imageUrl: img("road-cycling", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 42012n, topicId: 41003n, slug: "mountain-biking",
    title_fa: "دوچرخه‌سواری کوهستان مبتدی", title_sv: "Nybörjarmountainbike",
    excerpt_fa: "تکنیک‌های اولیه MTB: ترمزگیری، توازن روی موانع و مسیریابی",
    excerpt_sv: "Grundläggande MTB-tekniker: bromsning, balans på hinder och terrängorientering",
    ...body("دوچرخه‌سواری کوهستان مبتدی", "Nybörjarmountainbike"),
    icon: "Mountain", imageUrl: img("mountain-bike", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 42013n, topicId: 41003n, slug: "bike-maintenance",
    title_fa: "کارگاه تعمیر دوچرخه", title_sv: "Cykelreparationsworkshop",
    excerpt_fa: "تعمیر تیوب، تنظیم دنده و نگهداری اساسی دوچرخه",
    excerpt_sv: "Slanglagning, växeljustering och grundläggande cykelunderhåll",
    ...body("کارگاه تعمیر دوچرخه", "Cykelreparationsworkshop"),
    icon: "Wrench", imageUrl: img("bike-repair", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 42014n, topicId: 41003n, slug: "city-cycling-tour",
    title_fa: "تور دوچرخه‌سواری در شهر", title_sv: "Stadscykeltur",
    excerpt_fa: "گشت در شهر با دوچرخه، کشف مکان‌های پنهان و زیبایی‌های شهری",
    excerpt_sv: "Utflykt genom staden med cykel, hitta dolda platser och stadsestetik",
    ...body("تور دوچرخه‌سواری در شهر", "Stadscykeltur"),
    icon: "MapPin", imageUrl: img("city-cycling", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 42015n, topicId: 41003n, slug: "gravel-ride",
    title_fa: "گراول راید", title_sv: "Gravelritt",
    excerpt_fa: "دوچرخه‌سواری بر روی جاده‌های خاکی و مسیرهای جنگلی",
    excerpt_sv: "Cykling på grusvägar och skogsstigar",
    ...body("گراول راید", "Gravelritt"),
    formTemplateId: 47001n,
    icon: "Trees", imageUrl: img("gravel-ride", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(36),
  },
  // ── Water Sports ──
  {
    id: 42016n, topicId: 41004n, slug: "kayaking-intro",
    title_fa: "مقدمه‌ای بر کایاک", title_sv: "Introduktion till kajak",
    excerpt_fa: "اصول پارو زدن، ایمنی در آب و تکنیک‌های مانور کایاک",
    excerpt_sv: "Grunderna för paddling, säkerhet på vattnet och manövreringstekniker",
    ...body("مقدمه‌ای بر کایاک", "Introduktion till kajak"),
    formTemplateId: 47002n,
    icon: "Waves", imageUrl: img("kayaking", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 42017n, topicId: 41004n, slug: "sup-paddleboard",
    title_fa: "ایستاده روی تخته پادل", title_sv: "Stand-up paddleboard",
    excerpt_fa: "SUP — تعادل، تکنیک پارو و گشت در دریاچه‌های آرام",
    excerpt_sv: "SUP — balans, paddlingteknik och utflykt på stilla sjöar",
    ...body("ایستاده روی تخته پادل", "Stand-up paddleboard"),
    icon: "Surfboard", imageUrl: img("paddleboard", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 42018n, topicId: 41004n, slug: "open-water-swimming",
    title_fa: "شنای آب باز", title_sv: "Öppenvattensimning",
    excerpt_fa: "شنا در دریاچه و دریا با توجه به ایمنی و تکنیک‌های تنفس",
    excerpt_sv: "Simning i sjö och hav med fokus på säkerhet och andningstekniker",
    ...body("شنای آب باز", "Öppenvattensimning"),
    icon: "Waves", imageUrl: img("open-swimming", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 42019n, topicId: 41004n, slug: "canoe-trip",
    title_fa: "سفر با قایق کنو", title_sv: "Kanotresa",
    excerpt_fa: "کنوسواری یک‌روزه در رودخانه با پیک‌نیک در کنار آب",
    excerpt_sv: "Endagskanottur på floden med picknick vid vattnet",
    ...body("سفر با قایق کنو", "Kanotresa"),
    formTemplateId: 47001n,
    icon: "Anchor", imageUrl: img("canoe-trip", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 42020n, topicId: 41004n, slug: "sailing-basics",
    title_fa: "مبانی قایقرانی بادبانی", title_sv: "Seglingsgrunder",
    excerpt_fa: "قوانین دریا، بادسنج‌خوانی و مانور قایق بادبانی کوچک",
    excerpt_sv: "Sjöregler, vindmätning och manövrering av liten segelbåt",
    ...body("مبانی قایقرانی بادبانی", "Seglingsgrunder"),
    formTemplateId: 47002n,
    icon: "Navigation", imageUrl: img("sailing", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(34),
  },
  // ── Wildlife ──
  {
    id: 42021n, topicId: 41005n, slug: "bird-watching",
    title_fa: "پرنده‌نگری", title_sv: "Fågelskådning",
    excerpt_fa: "شناسایی پرندگان بومی سوئد با دوربین و راهنمای مجرب",
    excerpt_sv: "Identifiera svenska häckfåglar med kikare och erfaren guide",
    ...body("پرنده‌نگری", "Fågelskådning"),
    formTemplateId: 47001n,
    icon: "Bird", imageUrl: img("bird-watching", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 42022n, topicId: 41005n, slug: "plant-identification",
    title_fa: "شناسایی گیاهان", title_sv: "Växtidentifiering",
    excerpt_fa: "یادگیری شناسایی گیاهان خوراکی، داروئی و سمی در طبیعت سوئد",
    excerpt_sv: "Lär dig identifiera ätliga, medicinska och giftiga växter i svensk natur",
    ...body("شناسایی گیاهان", "Växtidentifiering"),
    icon: "Leaf", imageUrl: img("plant-id", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 42023n, topicId: 41005n, slug: "stargazing",
    title_fa: "ستاره‌شناسی شبانه", title_sv: "Stjärnskådning",
    excerpt_fa: "رصد ستارگان، شناسایی صورت‌های فلکی و بحث درباره کیهان",
    excerpt_sv: "Stjärnobservation, identifiering av stjärnbilder och kosmologidiskussion",
    ...body("ستاره‌شناسی شبانه", "Stjärnskådning"),
    icon: "Star", imageUrl: img("stargazing", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 42024n, topicId: 41005n, slug: "wildlife-photography",
    title_fa: "عکاسی از حیات وحش", title_sv: "Naturfotografi",
    excerpt_fa: "تکنیک‌های عکاسی در طبیعت، صبر و رویکرد با حیوانات",
    excerpt_sv: "Fotografitekniker i naturen, tålamod och tillvägagångssätt med djur",
    ...body("عکاسی از حیات وحش", "Naturfotografi"),
    formTemplateId: 47001n,
    icon: "Camera", imageUrl: img("wildlife-photo", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 42025n, topicId: 41005n, slug: "foraging-basics",
    title_fa: "مبانی جمع‌آوری غذا از طبیعت", title_sv: "Grundläggande mat-insamling",
    excerpt_fa: "شناسایی و جمع‌آوری ایمن قارچ‌ها، بری‌ها و گیاهان خوراکی",
    excerpt_sv: "Säker identifiering och insamling av svampar, bär och ätliga växter",
    ...body("مبانی جمع‌آوری غذا از طبیعت", "Grundläggande mat-insamling"),
    icon: "Sprout", imageUrl: img("foraging", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(32),
  },
];

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export const mockSlides: HeroSlideReturn[] = [
  { id: 43001n, topicId: 41001n, imageUrl: img("slide-hike-1", 1920, 800), title_fa: "طبیعت صبر می‌کند", title_sv: "Naturen väntar", subtitle_fa: "پیاده‌روی در جنگل‌های سوئد", subtitle_sv: "Vandring i svenska skogar", ctaText_fa: "مشاهده مسیرها", ctaText_sv: "Se leder", ctaLink: "/topics/hiking", sortOrder: 1n },
  { id: 43002n, topicId: 41001n, imageUrl: img("slide-hike-2", 1920, 800), title_fa: "صعود به قله", title_sv: "Mot toppen", subtitle_fa: "تور راهنما‌دار به قله‌های سوئد", subtitle_sv: "Guidade turer till svenska toppar", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/hiking/mountain-summit", sortOrder: 2n },
  { id: 43003n, topicId: 41002n, imageUrl: img("slide-climb-1", 1920, 800), title_fa: "بالا برو", title_sv: "Klättra uppåt", subtitle_fa: "صخره‌نوردی برای همه سطوح", subtitle_sv: "Klättring för alla nivåer", ctaText_fa: "شروع کنید", ctaText_sv: "Kom igång", ctaLink: "/topics/climbing", sortOrder: 1n },
  { id: 43004n, topicId: 41002n, imageUrl: img("slide-climb-2", 1920, 800), title_fa: "بولدرینگ — بدون طناب، بدون ترس", title_sv: "Bouldering — utan rep, utan rädsla", subtitle_fa: "اولین قدم در دنیای صخره‌نوردی", subtitle_sv: "Första steget in i klättringens värld", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/climbing/bouldering-intro", sortOrder: 2n },
  { id: 43005n, topicId: 41003n, imageUrl: img("slide-cycle-1", 1920, 800), title_fa: "زین بزنید و برانید", title_sv: "Sätt dig i sadeln och cykla", subtitle_fa: "گروه‌های دوچرخه‌سواری هفتگی", subtitle_sv: "Veckovisa cykelgrupper", ctaText_fa: "بپیوندید", ctaText_sv: "Gå med", ctaLink: "/topics/cycling", sortOrder: 1n },
  { id: 43006n, topicId: 41003n, imageUrl: img("slide-cycle-2", 1920, 800), title_fa: "گراول راید — آزادی واقعی", title_sv: "Gravelritt — verklig frihet", subtitle_fa: "جاده‌های خاکی و جنگل‌های بی‌پایان", subtitle_sv: "Grusvägar och oändliga skogar", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/cycling/gravel-ride", sortOrder: 2n },
  { id: 43007n, topicId: 41004n, imageUrl: img("slide-water-1", 1920, 800), title_fa: "آب می‌خواند", title_sv: "Vattnet kallar", subtitle_fa: "کایاک، پدل‌بورد و شنا", subtitle_sv: "Kajak, paddleboard och simning", ctaText_fa: "کشف کنید", ctaText_sv: "Utforska", ctaLink: "/topics/water-sports", sortOrder: 1n },
  { id: 43008n, topicId: 41004n, imageUrl: img("slide-water-2", 1920, 800), title_fa: "کایاک در غروب آفتاب", title_sv: "Kajak i solnedgången", subtitle_fa: "تجربه‌ای که فراموش نمی‌شود", subtitle_sv: "En upplevelse du aldrig glömmer", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/water-sports/kayaking-intro", sortOrder: 2n },
  { id: 43009n, topicId: 41005n, imageUrl: img("slide-wild-1", 1920, 800), title_fa: "طبیعت داستان می‌گوید", title_sv: "Naturen berättar en historia", subtitle_fa: "پرنده‌نگری، گیاه‌شناسی و ستاره‌شناسی", subtitle_sv: "Fågelskådning, botanik och stjärnskådning", ctaText_fa: "بیاموزید", ctaText_sv: "Lär dig", ctaLink: "/topics/wildlife", sortOrder: 1n },
  { id: 43010n, topicId: 41005n, imageUrl: img("slide-wild-2", 1920, 800), title_fa: "دنیای قارچ‌ها و بری‌ها", title_sv: "Svampar och bärens värld", subtitle_fa: "جمع‌آوری ایمن از طبیعت سوئد", subtitle_sv: "Säker insamling från svensk natur", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/topics/wildlife/foraging-basics", sortOrder: 2n },
];

// ─── About ────────────────────────────────────────────────────────────────────

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("wildpath-about", 1920, 600),
  body_fa: `<h2>درباره WildPath</h2><p>WildPath یک باشگاه ماجراجویی است که با عشق به طبیعت و ماجراجویی تأسیس شده. ما محیطی فراگیر برای کسانی فراهم می‌کنیم که می‌خواهند از اتاق‌های بسته بیرون بیایند و دنیای وسیع طبیعت را کشف کنند.</p><h3>ارزش‌های ما</h3><p>ایمنی اول، احترام به طبیعت دوم، لذت سوم. ما باور داریم که تجربه طبیعت می‌تواند زندگی را تحول‌آفرین کند.</p><h3>پایداری</h3><p>WildPath متعهد به اصول زیست‌محیطی است. «اثری نگذار» ما راهنمای همه فعالیت‌هاست و بخشی از درآمد ما صرف حفاظت از طبیعت می‌شود.</p>`,
  body_sv: `<h2>Om WildPath</h2><p>WildPath är en äventyrsklubb grundad med kärlek till naturen och äventyret. Vi erbjuder en inkluderande miljö för dem som vill lämna de stängda rummen och utforska naturens vidsträckta värld.</p><h3>Våra värderingar</h3><p>Säkerhet först, respekt för naturen andra, glädje tredje. Vi tror att naturupplevelser kan vara livsförändrande.</p><h3>Hållbarhet</h3><p>WildPath är engagerat i miljöprinciper. "Lämna inget spår" vägleder all vår verksamhet och en del av vår intäkt går till naturvård.</p>`,
};

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 44001n, name: "Felix Sundström", email: "felix.s@example.com", phone: "+46701234567", message: "Hej! Vilken konditionsnivå krävs för toppturen?", createdAt: ts(3) },
  { id: 44002n, name: "Astrid Bergman", email: "astrid.b@example.com", phone: "+46709988776", message: "Kan man hyra kajak utrustning från er?", createdAt: ts(7) },
  { id: 44003n, name: "Gustav Holm", email: "gustav.h@example.com", phone: "+46703344556", message: "Jag är rullstolsburen, finns det anpassade turer?", createdAt: ts(12) },
  { id: 44004n, name: "Selma Lindqvist", email: "selma.l@example.com", phone: "+46706655443", message: "Hur många deltagare är max per grupp?", createdAt: ts(18) },
  { id: 44005n, name: "Axel Fransson", email: "axel.f@example.com", phone: "+46708877665", message: "Erbjuder ni corporate events i naturen?", createdAt: ts(24) },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 45001n, platform: "instagram", url: "https://instagram.com/wildpath_adventures", sortOrder: 1n },
  { id: 45002n, platform: "facebook", url: "https://facebook.com/wildpathadventures", sortOrder: 2n },
  { id: 45003n, platform: "youtube", url: "https://youtube.com/@wildpath", sortOrder: 3n },
  { id: 45004n, platform: "website", url: "https://wildpath.se", sortOrder: 4n },
  { id: 45005n, platform: "email", url: "mailto:adventure@wildpath.se", sortOrder: 5n },
];

// ─── Registrations ────────────────────────────────────────────────────────────

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 46001n, activityId: 42001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Johanna Eriksson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "johanna.e@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Första vandringen någonsin, lite nervös men peppad!" },
    ],
    createdAt: ts(2),
  },
  {
    id: 46002n, activityId: 42002n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Marcus Eklund" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "marcus.e@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46701112233" },
      { fieldId: 4n, fieldLabel: "Erfarenhetsnivå / سطح تجربه", value: "Medel" },
      { fieldId: 5n, fieldLabel: "Information / توضیحات", value: "Har vandrat 5 km turer, vill kliva upp en nivå." },
    ],
    createdAt: ts(5),
  },
  {
    id: 46003n, activityId: 42006n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Sara Nilsson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "sara.n@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46703334455" },
      { fieldId: 4n, fieldLabel: "Erfarenhetsnivå / سطح تجربه", value: "Nybörjare" },
      { fieldId: 5n, fieldLabel: "Information / توضیحات", value: "Sett det på film och alltid drömt om att klättra." },
    ],
    createdAt: ts(7),
  },
  {
    id: 46004n, activityId: 42016n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Erik Lindblom" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "erik.lb@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46705544332" },
      { fieldId: 4n, fieldLabel: "Erfarenhetsnivå / سطح تجربه", value: "Nybörjare" },
      { fieldId: 5n, fieldLabel: "Information / توضیحات", value: "Kan simma men har aldrig kajakat." },
    ],
    createdAt: ts(9),
  },
  { id: 46005n, activityId: 42021n, name: "Petra Magnusson", email: "petra.m@example.com", phone: "+46706543210", message: "Jag har ett par kikare sedan länge, nu vill jag lära mig använda dem ordentligt.", fieldValues: [], createdAt: ts(13) },
];

// ─── Form Templates ───────────────────────────────────────────────────────────

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 47001n, name_fa: "ثبت‌نام فعالیت", name_sv: "Aktivitetsregistrering",
    description_fa: "فرم پایه برای فعالیت‌های باشگاه", description_sv: "Grundformulär för klubbaktiviteter",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "textarea", label_fa: "پیام", label_sv: "Meddelande", placeholder_fa: "", placeholder_sv: "Något vi bör veta?", required: false, options: [], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 47002n, name_fa: "ثبت‌نام ماجراجویی", name_sv: "Äventyrsregistrering",
    description_fa: "فرم برای فعالیت‌های پیشرفته‌تر با اطلاعات ایمنی", description_sv: "Formulär för mer avancerade aktiviteter med säkerhetsinformation",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن اضطراری", label_sv: "Nödtelefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح آمادگی جسمانی", label_sv: "Konditionsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "آیا محدودیت پزشکی دارید؟", label_sv: "Har du medicinska begränsningar?", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 47003n, name_fa: "ثبت‌نام تور", name_sv: "Turregistrering",
    description_fa: "فرم کامل برای تورهای گروهی", description_sv: "Fullständigt formulär för gruppturer",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "number", label_fa: "سن", label_sv: "Ålder", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "select", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 5n },
      { id: 6n, fieldType: "checkbox", label_fa: "شرایط و ریسک را می‌پذیرم", label_sv: "Jag accepterar villkor och risker", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 6n },
    ],
    createdAt: ts(90),
  },
];
