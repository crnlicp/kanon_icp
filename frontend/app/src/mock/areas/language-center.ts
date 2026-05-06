import type {
  SiteSettingsReturn, TopicReturn, ActivityReturn, HeroSlideReturn,
  AboutContentReturn, ContactMessageReturn, SocialLinkReturn,
  RegistrationReturn, FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const ts = (daysAgo: number) => BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("lingua-logo", 200, 200),
  title_fa: "لینگوا",
  title_sv: "Lingua",
  subtitle_fa: "مرکز یادگیری زبان‌های جهان",
  subtitle_sv: "Centrum för världens språk",
  landingBackgroundUrl: img("lingua-landing", 1920, 1080),
  topicsBackgroundUrl: img("lingua-topics", 1920, 1080),
  mockMode: true,
};

export const mockTopics: TopicReturn[] = [
  { id: 61001n, slug: "swedish", title_fa: "سوئدی", title_sv: "Svenska", description_fa: "سوئدی برای مهاجران، از صفر تا روانی در زندگی روزانه", description_sv: "Svenska för invandrare, från noll till flytande i vardagslivet", icon: "MessageCircle", backgroundUrl: img("swedish-lang-bg", 1920, 1080), sortOrder: 1n, createdAt: ts(90) },
  { id: 61002n, slug: "english", title_fa: "انگلیسی", title_sv: "Engelska", description_fa: "انگلیسی تجاری، آکادمیک و مکالمه برای تمام سطوح", description_sv: "Affärs-, akademisk och konversationsengelska för alla nivåer", icon: "Globe", backgroundUrl: img("english-bg", 1920, 1080), sortOrder: 2n, createdAt: ts(85) },
  { id: 61003n, slug: "spanish", title_fa: "اسپانیایی", title_sv: "Spanska", description_fa: "اسپانیایی کاستیلی و لاتین‌آمریکایی برای مسافران و علاقه‌مندان", description_sv: "Kastiliansk och latinamerikansk spanska för resenärer och entusiaster", icon: "MapPin", backgroundUrl: img("spanish-bg", 1920, 1080), sortOrder: 3n, createdAt: ts(80) },
  { id: 61004n, slug: "mandarin", title_fa: "ماندارین چینی", title_sv: "Mandarin kinesiska", description_fa: "HSK از سطح ۱ تا ۶، کاراکترها و مکالمه", description_sv: "HSK nivå 1–6, karaktärer och konversation", icon: "Languages", backgroundUrl: img("mandarin-bg", 1920, 1080), sortOrder: 4n, createdAt: ts(75) },
  { id: 61005n, slug: "sign-language", title_fa: "زبان اشاره", title_sv: "Teckenspråk", description_fa: "زبان اشاره سوئدی (TSS) برای ارتباط با جامعه ناشنوایان", description_sv: "Svenskt teckenspråk (TSS) för kommunikation med dövasamhället", icon: "Hand", backgroundUrl: img("sign-lang-bg", 1920, 1080), sortOrder: 5n, createdAt: ts(70) },
];

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>یادگیری زبان سفری است که با هر قدم، دری تازه می‌گشاید. در لینگوا، رویکرد ما ترکیبی از گرامر، مکالمه زنده و غوطه‌وری فرهنگی است.</p><ul><li>کلاس‌های کوچک (حداکثر ۸ نفر)</li><li>دسترسی به پلتفرم آنلاین برای تمرین</li><li>گواهینامه شرکت در پایان دوره</li></ul>`,
  body_sv: `<h2>${sv}</h2><p>Att lära sig ett språk är en resa där varje steg öppnar en ny dörr. På Lingua kombinerar vi grammatik, levande konversation och kulturell fördjupning.</p><ul><li>Små klasser (max 8 personer)</li><li>Tillgång till onlineplattform för träning</li><li>Deltagar certifikat i slutet av kursen</li></ul>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

// Reusable CEFR level form fields
const cefrFields = (lang: "sv" | "en" | "es" | "zh" | "tss"): FormTemplateReturn["fields"] => {
  const langLabel = { sv: "سوئدی / Svenska", en: "انگلیسی / Engelska", es: "اسپانیایی / Spanska", zh: "ماندارین / Mandarin", tss: "زبان اشاره / Teckenspråk" }[lang];
  return [
    { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
    { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
    { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
    { id: 4n, fieldType: "select", label_fa: `سطح فعلی ${langLabel}`, label_sv: `Nuvarande nivå i ${langLabel}`, placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj nivå", required: true, options: [{ fa: "A0 — کاملاً مبتدی", sv: "A0 — Absolut nybörjare" }, { fa: "A1 — مبتدی", sv: "A1 — Nybörjare" }, { fa: "A2 — پایه", sv: "A2 — Grundläggande" }, { fa: "B1 — متوسط", sv: "B1 — Medel" }, { fa: "B2 — بالاتر از متوسط", sv: "B2 — Övre medel" }, { fa: "C1 — پیشرفته", sv: "C1 — Avancerad" }], sortOrder: 4n },
    { id: 5n, fieldType: "radio", label_fa: "هدف اصلی یادگیری", label_sv: "Huvudsakligt inlärningsmål", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "زندگی روزانه", sv: "Vardagslivet" }, { fa: "کار و تجارت", sv: "Arbete och affärer" }, { fa: "آکادمیک و دانشگاه", sv: "Akademiskt och universitetet" }, { fa: "مسافرت", sv: "Resor" }], sortOrder: 5n },
    { id: 6n, fieldType: "select", label_fa: "زبان مادری شما", label_sv: "Ditt modersmål", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "فارسی", sv: "Persiska" }, { fa: "سوئدی", sv: "Svenska" }, { fa: "انگلیسی", sv: "Engelska" }, { fa: "عربی", sv: "Arabiska" }, { fa: "سایر", sv: "Annat" }], sortOrder: 6n },
  ];
};

export const mockActivities: ActivityReturn[] = [
  // Swedish
  {
    id: 62001n, topicId: 61001n, slug: "sfi-plus",
    title_fa: "SFI پلاس — سوئدی برای مهاجران", title_sv: "SFI Plus — Svenska för invandrare",
    excerpt_fa: "دوره فشرده سوئدی برای مهاجران با تمرکز بر کاربردهای روزانه",
    excerpt_sv: "Intensiv svenska för invandrare med fokus på daglig användning",
    ...body("SFI پلاس", "SFI Plus"),
    customFormFields: cefrFields("sv"),
    icon: "MessageCircle", imageUrl: img("sfi-course", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 62002n, topicId: 61001n, slug: "swedish-conversation",
    title_fa: "مکالمه سوئدی", title_sv: "Svensk konversation",
    excerpt_fa: "تمرین مکالمه زنده با گروه‌های کوچک بومی‌زبان",
    excerpt_sv: "Levande konversationsövning i små grupper med modersmålstalare",
    ...body("مکالمه سوئدی", "Svensk konversation"),
    formTemplateId: 67001n,
    icon: "Users", imageUrl: img("swedish-conv", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 62003n, topicId: 61001n, slug: "swedish-grammar",
    title_fa: "گرامر سوئدی", title_sv: "Svensk grammatik",
    excerpt_fa: "فعل‌ها، حروف اضافه، حالت‌های اسم و جملات پیچیده",
    excerpt_sv: "Verb, prepositioner, nominalfall och komplexa meningar",
    ...body("گرامر سوئدی", "Svensk grammatik"),
    icon: "BookOpen", imageUrl: img("swedish-grammar", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 62004n, topicId: 61001n, slug: "swedish-culture-language",
    title_fa: "زبان و فرهنگ سوئدی", title_sv: "Svensk språk och kultur",
    excerpt_fa: "اصطلاحات، فرهنگ عامه، طنز و آداب اجتماعی سوئد",
    excerpt_sv: "Idiom, folkkultur, humor och sociala normer i Sverige",
    ...body("زبان و فرهنگ سوئدی", "Svensk språk och kultur"),
    formTemplateId: 67001n,
    icon: "Heart", imageUrl: img("swedish-culture", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 62005n, topicId: 61001n, slug: "swedish-for-work",
    title_fa: "سوئدی محیط کار", title_sv: "Svenska för arbetsplatsen",
    excerpt_fa: "ایمیل‌نویسی، جلسات و زبان حرفه‌ای در محیط کار سوئدی",
    excerpt_sv: "E-postskrivning, möten och professionellt språk på svenska arbetsplatser",
    ...body("سوئدی محیط کار", "Svenska för arbetsplatsen"),
    icon: "Briefcase", imageUrl: img("swedish-work", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(40),
  },
  // English
  {
    id: 62006n, topicId: 61002n, slug: "business-english",
    title_fa: "انگلیسی تجاری", title_sv: "Affärsengelska",
    excerpt_fa: "ارائه، مذاکره، ایمیل رسمی و انگلیسی جلسات",
    excerpt_sv: "Presentationer, förhandlingar, formella mejl och mötesengelska",
    ...body("انگلیسی تجاری", "Affärsengelska"),
    customFormFields: cefrFields("en"),
    icon: "Briefcase", imageUrl: img("business-english", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 62007n, topicId: 61002n, slug: "ielts-preparation",
    title_fa: "آماده‌سازی آیلتس", title_sv: "IELTS-förberedelse",
    excerpt_fa: "استراتژی‌های مهارت‌های چهارگانه IELTS برای نمره ۷+",
    excerpt_sv: "Strategier för IELTS fyra färdigheter för betyg 7+",
    ...body("آماده‌سازی آیلتس", "IELTS-förberedelse"),
    formTemplateId: 67002n,
    icon: "GraduationCap", imageUrl: img("ielts-prep", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 62008n, topicId: 61002n, slug: "english-conversation-club",
    title_fa: "باشگاه مکالمه انگلیسی", title_sv: "Engelskt konversationsklubb",
    excerpt_fa: "بحث‌های آزاد هفتگی در موضوعات مختلف برای تمرین روانی",
    excerpt_sv: "Veckovisa fria diskussioner om olika ämnen för flytande träning",
    ...body("باشگاه مکالمه انگلیسی", "Engelskt konversationsklubb"),
    icon: "MessageCircle", imageUrl: img("english-club", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 62009n, topicId: 61002n, slug: "academic-writing",
    title_fa: "نوشتن آکادمیک", title_sv: "Akademiskt skrivande",
    excerpt_fa: "ساختار مقاله، استناددهی، پاراگراف‌نویسی و نقد متن",
    excerpt_sv: "Uppsatsstruktur, citering, styckesskrivning och textkritik",
    ...body("نوشتن آکادمیک", "Akademiskt skrivande"),
    formTemplateId: 67002n,
    icon: "PenLine", imageUrl: img("academic-writing", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 62010n, topicId: 61002n, slug: "kids-english",
    title_fa: "انگلیسی کودکان", title_sv: "Engelska för barn",
    excerpt_fa: "انگلیسی سرگرم‌کننده برای کودکان ۵ تا ۱۲ سال با بازی و آهنگ",
    excerpt_sv: "Rolig engelska för barn 5–12 år med lekar och sånger",
    ...body("انگلیسی کودکان", "Engelska för barn"),
    formTemplateId: 67003n,
    icon: "Star", imageUrl: img("kids-english", 800, 600), hasRegistration: true, sortOrder: 5n, createdAt: ts(38),
  },
  // Spanish
  {
    id: 62011n, topicId: 61003n, slug: "spanish-beginners",
    title_fa: "اسپانیایی مبتدیان", title_sv: "Spanska för nybörjare",
    excerpt_fa: "اولین قدم‌های اسپانیایی — تلفظ، اعداد، رنگ‌ها و معرفی",
    excerpt_sv: "Första stegen i spanska — uttal, siffror, färger och presentation",
    ...body("اسپانیایی مبتدیان", "Spanska för nybörjare"),
    customFormFields: cefrFields("es"),
    icon: "MapPin", imageUrl: img("spanish-begin", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 62012n, topicId: 61003n, slug: "spanish-culture",
    title_fa: "فرهنگ اسپانیایی‌زبانان", title_sv: "Spansktalande kulturer",
    excerpt_fa: "فرهنگ اسپانیا، مکزیک، آرژانتین و کلمبیا از طریق زبان",
    excerpt_sv: "Kulturer i Spanien, Mexico, Argentina och Colombia genom språket",
    ...body("فرهنگ اسپانیایی‌زبانان", "Spansktalande kulturer"),
    icon: "Globe", imageUrl: img("spanish-culture", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 62013n, topicId: 61003n, slug: "dele-preparation",
    title_fa: "آماده‌سازی DELE", title_sv: "DELE-förberedelse",
    excerpt_fa: "آزمون رسمی اسپانیایی DELE از سطح A1 تا C2",
    excerpt_sv: "Det officiella spanska DELE-provet från A1 till C2",
    ...body("آماده‌سازی DELE", "DELE-förberedelse"),
    formTemplateId: 67002n,
    icon: "GraduationCap", imageUrl: img("dele-prep", 800, 600), hasRegistration: true, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 62014n, topicId: 61003n, slug: "spanish-conversation",
    title_fa: "مکالمه اسپانیایی", title_sv: "Spansk konversation",
    excerpt_fa: "گفتگوی زنده با دیالوگ‌های واقعی از زندگی روزمره",
    excerpt_sv: "Levande konversation med verkliga dialoger från vardagslivet",
    ...body("مکالمه اسپانیایی", "Spansk konversation"),
    formTemplateId: 67001n,
    icon: "MessageCircle", imageUrl: img("spanish-conv", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 62015n, topicId: 61003n, slug: "spanish-film-club",
    title_fa: "باشگاه سینمای اسپانیایی", title_sv: "Spanskspråkig filmklubb",
    excerpt_fa: "تماشای فیلم‌های اسپانیایی با بحث و تحلیل زبانی",
    excerpt_sv: "Titta på spanskspråkiga filmer med språklig diskussion och analys",
    ...body("باشگاه سینمای اسپانیایی", "Spanskspråkig filmklubb"),
    icon: "Film", imageUrl: img("spanish-film", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(36),
  },
  // Mandarin
  {
    id: 62016n, topicId: 61004n, slug: "mandarin-hsk1",
    title_fa: "ماندارین HSK1", title_sv: "Mandarin HSK1",
    excerpt_fa: "۱۵۰ کاراکتر پایه، تلفظ پین‌یین و مکالمه ابتدایی",
    excerpt_sv: "150 grundkaraktärer, Pinyin-uttal och grundläggande konversation",
    ...body("ماندارین HSK1", "Mandarin HSK1"),
    customFormFields: cefrFields("zh"),
    icon: "Languages", imageUrl: img("mandarin-hsk1", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 62017n, topicId: 61004n, slug: "chinese-characters",
    title_fa: "کاراکترهای چینی", title_sv: "Kinesiska tecken",
    excerpt_fa: "نوشتن و خواندن کاراکترها با روش داستان‌پردازی تصویری",
    excerpt_sv: "Skriva och läsa karaktärer med visuell historiemetod",
    ...body("کاراکترهای چینی", "Kinesiska tecken"),
    icon: "PenTool", imageUrl: img("chinese-chars", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 62018n, topicId: 61004n, slug: "mandarin-business",
    title_fa: "ماندارین تجاری", title_sv: "Affärsmandarin",
    excerpt_fa: "زبان جلسات، مذاکره و ایمیل‌نویسی به زبان چینی",
    excerpt_sv: "Mötespråk, förhandlingar och e-postskrivning på kinesiska",
    ...body("ماندارین تجاری", "Affärsmandarin"),
    formTemplateId: 67002n,
    icon: "Briefcase", imageUrl: img("mandarin-biz", 800, 600), hasRegistration: true, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 62019n, topicId: 61004n, slug: "mandarin-culture",
    title_fa: "فرهنگ و تمدن چین", title_sv: "Kinesisk kultur och civilisation",
    excerpt_fa: "فلسفه، آداب، غذا و تاریخ چین از منظر زبان‌شناسی",
    excerpt_sv: "Filosofi, etikett, mat och Kinas historia ur ett lingvistiskt perspektiv",
    ...body("فرهنگ و تمدن چین", "Kinesisk kultur och civilisation"),
    icon: "Globe", imageUrl: img("chinese-culture", 800, 600), hasRegistration: false, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 62020n, topicId: 61004n, slug: "mandarin-conversation",
    title_fa: "مکالمه ماندارین", title_sv: "Mandarinkonversation",
    excerpt_fa: "صحبت کردن در موضوعات روزمره با تمرکز بر تُن‌ها",
    excerpt_sv: "Tala om vardagliga ämnen med fokus på toner",
    ...body("مکالمه ماندارین", "Mandarinkonversation"),
    formTemplateId: 67001n,
    icon: "MessageCircle", imageUrl: img("mandarin-conv", 800, 600), hasRegistration: true, sortOrder: 5n, createdAt: ts(34),
  },
  // Sign Language
  {
    id: 62021n, topicId: 61005n, slug: "intro-to-tss",
    title_fa: "مقدمه‌ای بر TSS", title_sv: "Introduktion till TSS",
    excerpt_fa: "اول‌کلمات، الفبای انگشتی و مکالمه ابتدایی زبان اشاره سوئدی",
    excerpt_sv: "Första-ord, fingersalfabetet och grundläggande TSS-konversation",
    ...body("مقدمه‌ای بر TSS", "Introduktion till TSS"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "دلیل یادگیری زبان اشاره", label_sv: "Anledning till att lära sig teckenspråk", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "برای ارتباط با فرد ناشنوا در خانواده", sv: "Kommunicera med döv familjemedlem" }, { fa: "برای کار در حوزه ناشنوایان", sv: "Arbeta inom dövaområdet" }, { fa: "علاقه شخصی", sv: "Personligt intresse" }, { fa: "دوره دانشگاهی", sv: "Universitetskurs" }], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "آیا کسی در اطرافتان ناشنواست؟", label_sv: "Har du en döv person i din omgivning?", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: false, options: [{ fa: "بله، در خانواده", sv: "Ja, i familjen" }, { fa: "بله، دوست یا همکار", sv: "Ja, vän eller kollega" }, { fa: "خیر", sv: "Nej" }], sortOrder: 4n },
    ],
    icon: "Hand", imageUrl: img("sign-intro", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 62022n, topicId: 61005n, slug: "sign-language-intermediate",
    title_fa: "زبان اشاره متوسط", title_sv: "Mellannivå teckenspråk",
    excerpt_fa: "گرامر فضایی، دستی‌کلمات‌سازی و روایتگری دستی",
    excerpt_sv: "Rumslig grammatik, klassifikator och manuellt berättande",
    ...body("زبان اشاره متوسط", "Mellannivå teckenspråk"),
    formTemplateId: 67001n,
    icon: "Layers", imageUrl: img("sign-intermediate", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 62023n, topicId: 61005n, slug: "deaf-culture",
    title_fa: "فرهنگ ناشنوایان", title_sv: "Dövkulturen",
    excerpt_fa: "تاریخ، هنر، جشن‌ها و ارزش‌های جامعه ناشنوایان سوئد",
    excerpt_sv: "Historia, konst, fester och värderingar i det svenska dövasamhället",
    ...body("فرهنگ ناشنوایان", "Dövkulturen"),
    icon: "Heart", imageUrl: img("deaf-culture", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 62024n, topicId: 61005n, slug: "sign-language-for-parents",
    title_fa: "زبان اشاره برای والدین", title_sv: "Teckenspråk för föräldrar",
    excerpt_fa: "برای والدین کودکان ناشنوا — ارتباط، بازی و پشتیبانی از طریق اشاره",
    excerpt_sv: "För föräldrar till döva barn — kommunikation, lek och stöd via tecken",
    ...body("زبان اشاره برای والدین", "Teckenspråk för föräldrar"),
    formTemplateId: 67003n,
    icon: "Users", imageUrl: img("sign-parents", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 62025n, topicId: 61005n, slug: "interpreting-basics",
    title_fa: "مبانی ترجمه همزمان اشاره", title_sv: "Grundläggande tolkning",
    excerpt_fa: "مهارت‌های اولیه ترجمه بین زبان اشاره و گفتار",
    excerpt_sv: "Grundläggande färdigheter i tolkning mellan teckenspråk och tal",
    ...body("مبانی ترجمه همزمان اشاره", "Grundläggande tolkning"),
    icon: "Repeat", imageUrl: img("sign-interpret", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(32),
  },
];

export const mockSlides: HeroSlideReturn[] = [
  { id: 63001n, topicId: 61001n, imageUrl: img("slide-sv-1", 1920, 800), title_fa: "سوئدی را با اطمینان صحبت کنید", title_sv: "Tala svenska med självförtroende", subtitle_fa: "از صفر تا روان در زندگی روزانه", subtitle_sv: "Från noll till flytande i vardagslivet", ctaText_fa: "شروع کنید", ctaText_sv: "Börja", ctaLink: "/topics/swedish", sortOrder: 1n },
  { id: 63002n, topicId: 61001n, imageUrl: img("slide-sv-2", 1920, 800), title_fa: "SFI پلاس — نتیجه تضمینی", title_sv: "SFI Plus — garanterat resultat", subtitle_fa: "کلاس‌های کوچک با مربیان مجرب", subtitle_sv: "Små klasser med erfarna lärare", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/swedish/sfi-plus", sortOrder: 2n },
  { id: 63003n, topicId: 61002n, imageUrl: img("slide-en-1", 1920, 800), title_fa: "انگلیسی کاری و تجاری", title_sv: "Affärs- och yrkesengelska", subtitle_fa: "ارتقای شغلی با زبان", subtitle_sv: "Karriärutveckling med språket", ctaText_fa: "کشف کنید", ctaText_sv: "Utforska", ctaLink: "/topics/english", sortOrder: 1n },
  { id: 63004n, topicId: 61002n, imageUrl: img("slide-en-2", 1920, 800), title_fa: "آیلتس ۷+ هدف ما", title_sv: "IELTS 7+ vårt mål", subtitle_fa: "استراتژی + تمرین = موفقیت", subtitle_sv: "Strategi + övning = framgång", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/english/ielts-preparation", sortOrder: 2n },
  { id: 63005n, topicId: 61003n, imageUrl: img("slide-es-1", 1920, 800), title_fa: "اسپانیایی — زبان شادی", title_sv: "Spanska — glädjens språk", subtitle_fa: "از مادرید تا بوئنوس‌آیرس", subtitle_sv: "Från Madrid till Buenos Aires", ctaText_fa: "شروع کنید", ctaText_sv: "Börja", ctaLink: "/topics/spanish", sortOrder: 1n },
  { id: 63006n, topicId: 61003n, imageUrl: img("slide-es-2", 1920, 800), title_fa: "مکالمه اسپانیایی زنده", title_sv: "Levande spansk konversation", subtitle_fa: "با افراد بومی صحبت کنید", subtitle_sv: "Prata med modersmålstalare", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/spanish/spanish-conversation", sortOrder: 2n },
  { id: 63007n, topicId: 61004n, imageUrl: img("slide-zh-1", 1920, 800), title_fa: "ماندارین — زبان آینده", title_sv: "Mandarin — framtidens språk", subtitle_fa: "از کاراکترها تا مکالمه", subtitle_sv: "Från tecken till konversation", ctaText_fa: "یاد بگیرید", ctaText_sv: "Lär dig", ctaLink: "/topics/mandarin", sortOrder: 1n },
  { id: 63008n, topicId: 61004n, imageUrl: img("slide-zh-2", 1920, 800), title_fa: "ماندارین تجاری", title_sv: "Affärsmandarin", subtitle_fa: "زبان بازارهای آسیای شرقی", subtitle_sv: "Östasiatiska marknadernas språk", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/mandarin/mandarin-business", sortOrder: 2n },
  { id: 63009n, topicId: 61005n, imageUrl: img("slide-tss-1", 1920, 800), title_fa: "زبان دست‌ها را بیاموزید", title_sv: "Lär dig händernas språk", subtitle_fa: "زبان اشاره سوئدی برای همه", subtitle_sv: "Svenskt teckenspråk för alla", ctaText_fa: "شروع کنید", ctaText_sv: "Börja", ctaLink: "/topics/sign-language", sortOrder: 1n },
  { id: 63010n, topicId: 61005n, imageUrl: img("slide-tss-2", 1920, 800), title_fa: "ارتباط بدون مرز", title_sv: "Kommunikation utan gränser", subtitle_fa: "برای والدین، دوستان و حرفه‌ای‌ها", subtitle_sv: "För föräldrar, vänner och professionella", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/topics/sign-language/intro-to-tss", sortOrder: 2n },
];

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("lingua-about", 1920, 600),
  body_fa: `<h2>درباره لینگوا</h2><p>لینگوا یک مرکز زبان است که با اعتقاد به اینکه هر زبانی پنجره‌ای به دنیای جدید است، تأسیس شده.</p><h3>روش ما</h3><p>ما از رویکرد ارتباطی (Communicative Approach) استفاده می‌کنیم — تمرکز اصلی بر استفاده واقعی از زبان، نه حفظ قانون‌های خشک.</p><h3>مربیان ما</h3><p>تمام مربیان لینگوا زبان‌شناسان آموزش‌دیده و بومی‌زبان هستند.</p>`,
  body_sv: `<h2>Om Lingua</h2><p>Lingua är ett språkcenter grundat i övertygelsen att varje språk är ett fönster mot en ny värld.</p><h3>Vår metod</h3><p>Vi använder kommunikativ approach — huvudfokus på verklig användning av språket, inte mekanisk regelinlärning.</p><h3>Våra lärare</h3><p>Alla Lingua-lärare är utbildade lingvister och modersmålstalare.</p>`,
};

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 64001n, name: "Farida Nouri", email: "farida.n@example.com", phone: "+46701234567", message: "آیا می‌توانم قبل از ثبت‌نام یک جلسه آزمایشی داشته باشم؟", createdAt: ts(3) },
  { id: 64002n, name: "Henrik Olsson", email: "henrik.o@example.com", phone: "+46709988776", message: "Erbjuder ni onlinekurser i spanska?", createdAt: ts(7) },
  { id: 64003n, name: "Amina Yilmaz", email: "amina.y@example.com", phone: "+46703344556", message: "Hur lång tid tar det att nå B2 i svenska?", createdAt: ts(13) },
  { id: 64004n, name: "Gustav Sjöberg", email: "gustav.s@example.com", phone: "+46706655443", message: "Har ni kvällskurser i mandarin?", createdAt: ts(19) },
  { id: 64005n, name: "Leila Ahmadi", email: "leila.a@example.com", phone: "+46708877665", message: "فرزندم ناشنواست، آیا کلاس اشاره برای او دارید؟", createdAt: ts(25) },
];

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 65001n, platform: "instagram", url: "https://instagram.com/lingua_languages", sortOrder: 1n },
  { id: 65002n, platform: "facebook", url: "https://facebook.com/lingualanguages", sortOrder: 2n },
  { id: 65003n, platform: "youtube", url: "https://youtube.com/@lingua_languages", sortOrder: 3n },
  { id: 65004n, platform: "website", url: "https://lingua.se", sortOrder: 4n },
  { id: 65005n, platform: "email", url: "mailto:learn@lingua.se", sortOrder: 5n },
];

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 66001n, activityId: 62001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Parisa Tehrani" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "parisa.t@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46701112233" },
      { fieldId: 4n, fieldLabel: "Nivå / سطح", value: "A1 — Nybörjare" },
      { fieldId: 5n, fieldLabel: "Mål / هدف", value: "Vardagslivet" },
      { fieldId: 6n, fieldLabel: "Modersmål / زبان مادری", value: "Persiska" },
    ],
    createdAt: ts(2),
  },
  {
    id: 66002n, activityId: 62006n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Jonas Eriksson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "jonas.e@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "" },
      { fieldId: 4n, fieldLabel: "Nivå / سطح", value: "B1 — Medel" },
      { fieldId: 5n, fieldLabel: "Mål / هدف", value: "Arbete och affärer" },
      { fieldId: 6n, fieldLabel: "Modersmål / زبان مادری", value: "Svenska" },
    ],
    createdAt: ts(5),
  },
  {
    id: 66003n, activityId: 62021n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Maria Lindqvist" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "maria.lq@example.com" },
      { fieldId: 3n, fieldLabel: "Anledning / دلیل", value: "Kommunicera med döv familjemedlem" },
      { fieldId: 4n, fieldLabel: "Döv i omgivning / ناشنوا در اطراف", value: "Ja, i familjen" },
    ],
    createdAt: ts(8),
  },
  { id: 66004n, activityId: 62007n, name: "Reza Moradi", email: "reza.m@example.com", phone: "+46705544332", message: "هدفم گرفتن IELTS 7.5 برای دانشگاه است.", fieldValues: [], createdAt: ts(11) },
  { id: 66005n, activityId: 62011n, name: "Isabel Costa", email: "isabel.c@example.com", phone: "+46704433221", message: "Jag är halvt spansk, vill förbättra mitt spanska.", fieldValues: [], createdAt: ts(16) },
];

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 67001n, name_fa: "ثبت‌نام مکالمه", name_sv: "Konversationsregistrering",
    description_fa: "فرم برای کلاس‌های مکالمه", description_sv: "Formulär för konversationsklasser",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "سطح فعلی", label_sv: "Nuvarande nivå", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "A1–A2", sv: "A1–A2" }, { fa: "B1–B2", sv: "B1–B2" }, { fa: "C1–C2", sv: "C1–C2" }], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 67002n, name_fa: "ثبت‌نام دوره آکادمیک", name_sv: "Akademisk kursregistrering",
    description_fa: "فرم برای دوره‌های آزمون رسمی", description_sv: "Formulär för officiella provkurser",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "نمره هدف", label_sv: "Målbetyg", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "6.0", sv: "6.0" }, { fa: "6.5", sv: "6.5" }, { fa: "7.0", sv: "7.0" }, { fa: "7.5+", sv: "7.5+" }], sortOrder: 4n },
      { id: 5n, fieldType: "date", label_fa: "تاریخ آزمون برنامه‌ریزی‌شده", label_sv: "Planerat provdatum", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 67003n, name_fa: "ثبت‌نام دوره کودکان", name_sv: "Barnkursregistrering",
    description_fa: "فرم برای ثبت‌نام کودکان در دوره‌های زبان", description_sv: "Formulär för barnens språkkurser",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام کودک", label_sv: "Barnets namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "number", label_fa: "سن کودک", label_sv: "Barnets ålder", placeholder_fa: "مثلاً ۸", placeholder_sv: "T.ex. 8", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "نام والدین", label_sv: "Föräldrarnas namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "email", label_fa: "ایمیل والدین", label_sv: "Föräldrarnas e-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "phone", label_fa: "تلفن اضطراری", label_sv: "Nödtelefon", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
      { id: 6n, fieldType: "textarea", label_fa: "شرایط پزشکی یا نیازهای خاص", label_sv: "Medicinska tillstånd eller särskilda behov", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 6n },
    ],
    createdAt: ts(90),
  },
];
