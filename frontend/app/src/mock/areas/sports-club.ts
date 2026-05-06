import type {
  SiteSettingsReturn, TopicReturn, ActivityReturn, HeroSlideReturn,
  AboutContentReturn, ContactMessageReturn, SocialLinkReturn,
  RegistrationReturn, FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const ts = (daysAgo: number) => BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>در این برنامه با مربیان حرفه‌ای، مهارت‌های ورزشی خود را تقویت کنید. محیطی دوستانه و حمایتگر برای همه سطوح.</p><ul><li>تمرین با تجهیزات حرفه‌ای</li><li>برنامه تمرین شخصی‌سازی‌شده</li><li>تأکید بر ایمنی و آمادگی جسمانی</li></ul>`,
  body_sv: `<h2>${sv}</h2><p>I detta program förbättrar du dina idrottsfärdigheter med professionella tränare. En vänlig och stödjande miljö för alla nivåer.</p><ul><li>Träning med professionell utrustning</li><li>Personligt anpassat träningsprogram</li><li>Fokus på säkerhet och kondition</li></ul>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("vitaforce-logo", 200, 200),
  title_fa: "باشگاه ویتافورس",
  title_sv: "VitaForce Sportklubb",
  subtitle_fa: "قوی‌تر، سریع‌تر، بهتر — به جامعه‌ای از ورزشکاران پرشور بپیوندید",
  subtitle_sv: "Starkare, snabbare, bättre — gå med i en gemenskap av passionerade idrottare",
  landingBackgroundUrl: img("vitaforce-landing", 1920, 1080),
  topicsBackgroundUrl: img("vitaforce-topics", 1920, 1080),
  mockMode: true,
};

export const mockTopics: TopicReturn[] = [
  { id: 71001n, slug: "football", title_fa: "فوتبال", title_sv: "Fotboll", description_fa: "لیگ هفتگی، تمرین جوانان و مسابقات دوستانه", description_sv: "Veckoliga, ungdomsträning och vänskapsmatcher", icon: "Circle", backgroundUrl: img("football-bg", 1920, 1080), sortOrder: 1n, createdAt: ts(90) },
  { id: 71002n, slug: "tennis", title_fa: "تنیس", title_sv: "Tennis", description_fa: "کلاس‌های مبتدی تا پیشرفته با مربیان گواهینامه‌دار", description_sv: "Kurser från nybörjare till avancerad med certifierade tränare", icon: "Circle", backgroundUrl: img("tennis-bg", 1920, 1080), sortOrder: 2n, createdAt: ts(85) },
  { id: 71003n, slug: "swimming", title_fa: "شنا", title_sv: "Simning", description_fa: "آموزش شنا برای بزرگسالان و کودکان در استخر سرپوشیده", description_sv: "Simundervisning för vuxna och barn i inomhusbassäng", icon: "Waves", backgroundUrl: img("swim-bg", 1920, 1080), sortOrder: 3n, createdAt: ts(80) },
  { id: 71004n, slug: "martial-arts", title_fa: "هنرهای رزمی", title_sv: "Kampsport", description_fa: "کاراته، جودو و دفاع شخصی برای همه سنین", description_sv: "Karate, judo och självförsvar för alla åldrar", icon: "Shield", backgroundUrl: img("martial-bg", 1920, 1080), sortOrder: 4n, createdAt: ts(75) },
  { id: 71005n, slug: "running", title_fa: "دویدن", title_sv: "Löpning", description_fa: "از ۵ کیلومتر تا ماراتن — برنامه تمرینی برای همه", description_sv: "Från 5 km till maraton — träningsprogram för alla", icon: "Wind", backgroundUrl: img("running-bg", 1920, 1080), sortOrder: 5n, createdAt: ts(70) },
];

export const mockSlides: HeroSlideReturn[] = [
  { id: 71010n, topicId: 71001n, imageUrl: img("football-slide", 1200, 600), title_fa: "لیگ تابستانی ۲۰۲۶", title_sv: "Sommarliga 2026", subtitle_fa: "ثبت‌نام تیم‌ها تا پایان خرداد", subtitle_sv: "Lagregistrering till slutet av juni", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/fa/topics/football", sortOrder: 1n },
  { id: 71011n, topicId: 71005n, imageUrl: img("marathon-slide", 1200, 600), title_fa: "آمادگی برای ماراتن شهر", title_sv: "Maratonförberedelse", subtitle_fa: "۱۶ هفته برنامه حرفه‌ای", subtitle_sv: "16 veckors professionellt program", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/fa/topics/running", sortOrder: 2n },
];

export const mockActivities: ActivityReturn[] = [
  // Football
  {
    id: 72001n, topicId: 71001n, slug: "sunday-league",
    title_fa: "لیگ یکشنبه‌ها", title_sv: "Söndagsligan",
    excerpt_fa: "رقابت تیم‌های ۷ نفره هر یکشنبه صبح در زمین اصلی", excerpt_sv: "Lag om 7 spelare tävlar varje söndagsmorgon på huvudplanen",
    ...body("لیگ یکشنبه‌ها", "Söndagsligan"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "date", label_fa: "تاریخ تولد", label_sv: "Födelsedatum", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "phone", label_fa: "شماره اضطراری", label_sv: "Nödtelefon", placeholder_fa: "شماره فرد اضطراری", placeholder_sv: "Nödkontaktens telefon", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "checkbox", label_fa: "تأیید می‌کنم که از نظر پزشکی مجاز به ورزش هستم", label_sv: "Jag bekräftar att jag är medicinskt godkänd för träning", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
    ],
    icon: "Trophy", imageUrl: img("sunday-football", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 72002n, topicId: 71001n, slug: "youth-football",
    title_fa: "فوتبال جوانان", title_sv: "Ungdomsfotboll",
    excerpt_fa: "آموزش تکنیک‌های پایه برای بازیکنان ۱۰ تا ۱۶ ساله", excerpt_sv: "Grundläggande teknikträning för spelare 10–16 år",
    ...body("فوتبال جوانان", "Ungdomsfotboll"),
    formTemplateId: 77020n,
    icon: "Users", imageUrl: img("youth-football", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 72003n, topicId: 71001n, slug: "goalkeeper-training",
    title_fa: "تمرین دروازه‌بان", title_sv: "Målvaktsträning",
    excerpt_fa: "تکنیک‌های اختصاصی دروازه‌بانی با مربی متخصص", excerpt_sv: "Specialiserade målvaktstekniker med expertcoach",
    ...body("تمرین دروازه‌بان", "Målvaktsträning"),
    icon: "ShieldCheck", imageUrl: img("goalkeeper", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  // Tennis
  {
    id: 73001n, topicId: 71002n, slug: "tennis-beginner",
    title_fa: "تنیس مبتدیان", title_sv: "Tennis för nybörjare",
    excerpt_fa: "دوره ۸ هفته‌ای برای کسانی که هرگز راکت نزده‌اند", excerpt_sv: "8-veckorskurs för de som aldrig hållit i ett racket",
    ...body("تنیس مبتدیان", "Tennis för nybörjare"),
    formTemplateId: 77021n,
    icon: "Circle", imageUrl: img("tennis-beginner", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(48),
  },
  {
    id: 73002n, topicId: 71002n, slug: "tennis-advanced",
    title_fa: "تنیس پیشرفته", title_sv: "Avancerad tennis",
    excerpt_fa: "تمرین تاکتیک، سرویس قوی و بازی دوبل برای بازیکنان باتجربه", excerpt_sv: "Taktikträning, stark serve och dubbelspel för erfarna spelare",
    ...body("تنیس پیشرفته", "Avancerad tennis"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "سطح بازی", label_sv: "Spelnivå", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "متوسط — ۱ تا ۳ سال تجربه", sv: "Medel — 1–3 års erfarenhet" }, { fa: "پیشرفته — بیش از ۳ سال", sv: "Avancerad — mer än 3 år" }, { fa: "نیمه‌حرفه‌ای", sv: "Halvprofessionell" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "تماس اضطراری (نام: شماره)", label_sv: "Nödkontakt (namn: telefon)", placeholder_fa: "نام: ۰۹۱۲...", placeholder_sv: "Namn: 070-...", required: true, options: [], sortOrder: 4n },
    ],
    icon: "Circle", imageUrl: img("tennis-advanced", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(45),
  },
  // Swimming
  {
    id: 74001n, topicId: 71003n, slug: "swim-lessons-adult",
    title_fa: "شنا برای بزرگسالان", title_sv: "Simkurs för vuxna",
    excerpt_fa: "یاد گرفتن یا بهبود تکنیک شنا در گروه‌های کوچک ۶ نفره", excerpt_sv: "Lär dig simma eller förbättra tekniken i små grupper om 6",
    ...body("شنا برای بزرگسالان", "Simkurs för vuxna"),
    formTemplateId: 77021n,
    icon: "Waves", imageUrl: img("swim-adult", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(42),
  },
  {
    id: 74002n, topicId: 71003n, slug: "swim-competition-prep",
    title_fa: "آمادگی برای مسابقات", title_sv: "Tävlingsförberedelse",
    excerpt_fa: "برنامه فشرده برای شناگران رقابتی", excerpt_sv: "Intensivt program för tävlingsimmare",
    ...body("آمادگی برای مسابقات", "Tävlingsförberedelse"),
    icon: "Medal", imageUrl: img("swim-competition", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(38),
  },
  // Martial Arts
  {
    id: 75001n, topicId: 71004n, slug: "karate-kids",
    title_fa: "کاراته کودکان", title_sv: "Karate för barn",
    excerpt_fa: "انضباط، احترام و دفاع از خود برای کودکان ۶ تا ۱۲ ساله", excerpt_sv: "Disciplin, respekt och självförsvar för barn 6–12 år",
    ...body("کاراته کودکان", "Karate för barn"),
    formTemplateId: 77020n,
    icon: "Shield", imageUrl: img("karate-kids", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(35),
  },
  {
    id: 75002n, topicId: 71004n, slug: "self-defense-adults",
    title_fa: "دفاع شخصی بزرگسالان", title_sv: "Självförsvar för vuxna",
    excerpt_fa: "تکنیک‌های کاربردی دفاع شخصی برای موقعیت‌های واقعی", excerpt_sv: "Praktiska självförsvarstekniker för verkliga situationer",
    ...body("دفاع شخصی بزرگسالان", "Självförsvar för vuxna"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "سطح آمادگی جسمانی", label_sv: "Konditionsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "پایین — تازه شروع کرده‌ام", sv: "Låg — precis börjat" }, { fa: "متوسط", sv: "Medel" }, { fa: "بالا — به طور منظم ورزش می‌کنم", sv: "Hög — tränar regelbundet" }], sortOrder: 3n },
      { id: 4n, fieldType: "textarea", label_fa: "آسیب‌دیدگی‌ها یا محدودیت‌های پزشکی", label_sv: "Skador eller medicinska begränsningar", placeholder_fa: "اگر محدودیتی دارید توضیح دهید", placeholder_sv: "Beskriv eventuella begränsningar", required: false, options: [], sortOrder: 4n },
    ],
    icon: "Shield", imageUrl: img("self-defense", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(32),
  },
  // Running
  {
    id: 76001n, topicId: 71005n, slug: "5k-from-zero",
    title_fa: "از صفر تا ۵ کیلومتر", title_sv: "Från noll till 5 km",
    excerpt_fa: "۸ هفته برنامه تمرینی ساختارمند برای مبتدیان", excerpt_sv: "8 veckors strukturerat träningsprogram för nybörjare",
    ...body("از صفر تا ۵ کیلومتر", "Från noll till 5 km"),
    formTemplateId: 77021n,
    icon: "Wind", imageUrl: img("running-5k", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(28),
  },
  {
    id: 76002n, topicId: 71005n, slug: "marathon-prep",
    title_fa: "آمادگی برای ماراتن", title_sv: "Maratonförberedelse",
    excerpt_fa: "۱۶ هفته تخصصی برای اولین ماراتن شما", excerpt_sv: "16 specialiserade veckor för ditt första maraton",
    ...body("آمادگی برای ماراتن", "Maratonförberedelse"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "تجربه دویدن", label_sv: "Löparerfarenhet", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "هیچ تجربه‌ای ندارم", sv: "Ingen erfarenhet" }, { fa: "گاهی می‌دوم", sv: "Springer ibland" }, { fa: "به طور منظم ۵–۱۰ کیلومتر", sv: "Regelbundet 5–10 km" }, { fa: "نیمه ماراتن دویده‌ام", sv: "Springer halvmaraton" }], sortOrder: 4n },
      { id: 5n, fieldType: "text", label_fa: "بهترین زمان (اختیاری)", label_sv: "Personligt rekord (valfritt)", placeholder_fa: "مثلاً ۴۵ دقیقه ۱۰ کیلومتر", placeholder_sv: "T.ex. 45 min på 10 km", required: false, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "text", label_fa: "تماس اضطراری", label_sv: "Nödkontakt", placeholder_fa: "نام: شماره", placeholder_sv: "Namn: telefon", required: true, options: [], sortOrder: 6n },
      { id: 7n, fieldType: "textarea", label_fa: "شرایط پزشکی مرتبط", label_sv: "Relevanta medicinska tillstånd", placeholder_fa: "هر شرایطی که مربی باید بداند", placeholder_sv: "Tillstånd tränaren bör känna till", required: false, options: [], sortOrder: 7n },
    ],
    icon: "Wind", imageUrl: img("marathon", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(25),
  },
  {
    id: 76003n, topicId: 71005n, slug: "trail-running",
    title_fa: "دویدن در طبیعت", title_sv: "Terränglöpning",
    excerpt_fa: "کشف مسیرهای طبیعی در اطراف شهر با گروه هفتگی", excerpt_sv: "Utforska naturleder runt staden med vecklig grupp",
    ...body("دویدن در طبیعت", "Terränglöpning"),
    icon: "Wind", imageUrl: img("trail-running", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(20),
  },
];

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 77001n, platform: "instagram", url: "https://instagram.com/vitaforce", sortOrder: 1n },
  { id: 77002n, platform: "facebook", url: "https://facebook.com/vitaforce", sortOrder: 2n },
  { id: 77003n, platform: "youtube", url: "https://youtube.com/vitaforce", sortOrder: 3n },
  { id: 77004n, platform: "website", url: "https://vitaforce.example.se", sortOrder: 4n },
];

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("vitaforce-about", 1200, 500),
  body_fa: "<h2>درباره باشگاه ویتافورس</h2><p>باشگاه ویتافورس از سال ۱۹۹۸ به عنوان یک مرکز ورزشی جامع در خدمت اجتماع است. با بیش از ۱۲۰۰ عضو فعال، ما فضایی فراهم می‌کنیم که همه افراد، صرف نظر از سطح توانایی، می‌توانند به بهترین نسخه خود دست پیدا کنند.</p>",
  body_sv: "<h2>Om VitaForce Sportklubb</h2><p>VitaForce har sedan 1998 tjänat samhället som ett allsidigt sportcenter. Med över 1200 aktiva medlemmar skapar vi ett utrymme där alla, oavsett förmåga, kan nå sin bästa version.</p>",
};

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 77020n, name_fa: "ثبت‌نام ورزش جوانان", name_sv: "Ungdomsidrottsregistrering",
    description_fa: "فرم ثبت‌نام برنامه‌های ورزشی جوانان با اطلاعات والدین", description_sv: "Registreringsformulär för ungdomsprogram med föräldraruppgifter",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک / بازیکن", label_sv: "Barnets / spelarens namn", placeholder_fa: "نام کامل", placeholder_sv: "Fullständigt namn", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن", label_sv: "Ålder", placeholder_fa: "سن (سال)", placeholder_sv: "Ålder (år)", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "نام والدین / سرپرست", label_sv: "Förälderns / vårdnadshavarens namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "phone", label_fa: "شماره تماس والدین", label_sv: "Förälderns telefon", placeholder_fa: "۰۹۱۲ ...", placeholder_sv: "070-...", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "آسیب‌دیدگی‌های قبلی", label_sv: "Tidigare skador", placeholder_fa: "هر آسیب‌دیدگی مرتبطی که مربی باید بداند", placeholder_sv: "Eventuella relevanta skador tränaren bör känna till", required: false, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "checkbox", label_fa: "رضایت می‌دهم که تصاویر در رسانه‌های باشگاه استفاده شود", label_sv: "Jag godkänner att bilder används i klubbens medier", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 6n },
    ],
    createdAt: ts(100),
  },
  {
    id: 77021n, name_fa: "ثبت‌نام ورزش بزرگسالان", name_sv: "Vuxenidrottsregistrering",
    description_fa: "فرم استاندارد ثبت‌نام برنامه‌های ورزشی بزرگسالان", description_sv: "Standardregistrering för vuxnas idrottsprogram",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "شماره تماس", label_sv: "Telefonnummer", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "سطح آمادگی جسمانی", label_sv: "Konditionsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "checkbox", label_fa: "تأیید می‌کنم از نظر پزشکی مجاز به ورزش هستم", label_sv: "Jag bekräftar att jag är medicinskt godkänd för träning", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
    ],
    createdAt: ts(98),
  },
];

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 79001n, name: "Sara Andersson", email: "sara@example.se", phone: "+46701234567", message: "Hej! Finns det lediga platser i tennisklassen för nybörjare i september?", createdAt: ts(1) },
  { id: 79002n, name: "محمد کریمی", email: "mohammad@example.com", phone: "+46709876543", message: "سلام، آیا برای خانواده‌ها تخفیف گروهی دارید؟", createdAt: ts(4) },
  { id: 79003n, name: "Erik Nilsson", email: "erik.n@example.se", phone: "+46703344556", message: "Jag undrar om ni har personlig träning tillgänglig utanför gruppasserna?", createdAt: ts(8) },
];

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 79010n, activityId: 72001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Ali Mohammadi" },
      { fieldId: 2n, fieldLabel: "تاریخ تولد / Födelsedatum", value: "1990-05-15" },
      { fieldId: 3n, fieldLabel: "ایمیل / E-post", value: "ali@example.com" },
      { fieldId: 4n, fieldLabel: "شماره اضطراری / Nödtelefon", value: "070-9876543" },
      { fieldId: 5n, fieldLabel: "تأیید پزشکی / Medicinskt godkännande", value: "true" },
    ],
    createdAt: ts(2),
  },
  {
    id: 79011n, activityId: 76002n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Erik Johansson" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "erik@example.se" },
      { fieldId: 3n, fieldLabel: "تلفن / Telefon", value: "073-1234567" },
      { fieldId: 4n, fieldLabel: "تجربه دویدن / Löparerfarenhet", value: "به طور منظم ۵–۱۰ کیلومتر" },
      { fieldId: 5n, fieldLabel: "بهترین زمان / Personligt rekord", value: "52 min / 10 km" },
      { fieldId: 6n, fieldLabel: "تماس اضطراری / Nödkontakt", value: "Anna Johansson: 073-9876543" },
    ],
    createdAt: ts(5),
  },
];
