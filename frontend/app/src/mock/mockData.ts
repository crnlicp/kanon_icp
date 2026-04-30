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
} from "../backend/api/backend";

// Deterministic placeholder images via picsum.photos
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

// Timestamps in nanoseconds (ICP format) — spread across recent months
const ts = (daysAgo: number) =>
  BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

// ─── Site Settings ──────────────────────────────────────────────────────────

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("kanon-logo", 200, 200),
  title_fa: "کانون",
  title_sv: "Kanon",
  subtitle_fa: "فرهنگی، آموزشی و ورزشی ایرانیان در سوئد",
  subtitle_sv: "Kultur, utbildning och sport för iranier i Sverige",
  landingBackgroundUrl: img("landing-bg", 1920, 1080),
  topicsBackgroundUrl: img("topics-bg", 1920, 1080),
  mockMode: true,
};

// ─── Topics ─────────────────────────────────────────────────────────────────

export const mockTopics: TopicReturn[] = [
  {
    id: 1001n,
    slug: "culture",
    title_fa: "فرهنگ",
    title_sv: "Kultur",
    description_fa: "برنامه‌های فرهنگی شامل جشن‌های نوروز، شب یلدا، و رویدادهای هنری",
    description_sv: "Kulturella program inklusive Nowruz-firande, Yalda-natt och konstevenemang",
    icon: "Palette",
    backgroundUrl: img("culture-bg", 1920, 1080),
    sortOrder: 1n,
    createdAt: ts(90),
  },
  {
    id: 1002n,
    slug: "education",
    title_fa: "آموزش",
    title_sv: "Utbildning",
    description_fa: "کلاس‌های زبان فارسی، سوئدی و انگلیسی برای تمام سنین",
    description_sv: "Språkkurser i persiska, svenska och engelska för alla åldrar",
    icon: "BookOpen",
    backgroundUrl: img("education-bg", 1920, 1080),
    sortOrder: 2n,
    createdAt: ts(85),
  },
  {
    id: 1003n,
    slug: "sports",
    title_fa: "ورزش",
    title_sv: "Sport",
    description_fa: "فعالیت‌های ورزشی شامل فوتبال، والیبال، شنا و یوگا",
    description_sv: "Sportaktiviteter inklusive fotboll, volleyboll, simning och yoga",
    icon: "Trophy",
    backgroundUrl: img("sports-bg", 1920, 1080),
    sortOrder: 3n,
    createdAt: ts(80),
  },
  {
    id: 1004n,
    slug: "art",
    title_fa: "هنر",
    title_sv: "Konst",
    description_fa: "کارگاه‌های هنری شامل نقاشی، خوشنویسی، موسیقی و تئاتر",
    description_sv: "Konstverkstäder inklusive målning, kalligrafi, musik och teater",
    icon: "Brush",
    backgroundUrl: img("art-bg", 1920, 1080),
    sortOrder: 4n,
    createdAt: ts(75),
  },
  {
    id: 1005n,
    slug: "community",
    title_fa: "اجتماعی",
    title_sv: "Samhälle",
    description_fa: "فعالیت‌های اجتماعی، داوطلبانه و خدمات مشاوره‌ای",
    description_sv: "Sociala aktiviteter, volontärarbete och rådgivningstjänster",
    icon: "Users",
    backgroundUrl: img("community-bg", 1920, 1080),
    sortOrder: 5n,
    createdAt: ts(70),
  },
];

// ─── Activities ─────────────────────────────────────────────────────────────

const activityBody = (titleFa: string, titleSv: string) => ({
  body_fa: `<h2>${titleFa}</h2><p>این برنامه با هدف ایجاد فضایی برای آشنایی و مشارکت اعضای جامعه ایرانی در سوئد برگزار می‌شود. شرکت‌کنندگان فرصت خواهند داشت تا در کارگاه‌ها و نشست‌های تعاملی شرکت کنند.</p><p>برای اطلاعات بیشتر و ثبت‌نام با ما تماس بگیرید.</p>`,
  body_sv: `<h2>${titleSv}</h2><p>Detta program syftar till att skapa ett utrymme för att lära känna och engagera medlemmar i det iranska samhället i Sverige. Deltagarna kommer att ha möjlighet att delta i workshops och interaktiva sessioner.</p><p>Kontakta oss för mer information och registrering.</p>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // ── Culture (1001) ──
  {
    id: 2001n, topicId: 1001n, slug: "nowruz-celebration",
    title_fa: "جشن نوروز", title_sv: "Nowruz-firande",
    excerpt_fa: "جشن آغاز بهار و سال نو ایرانی با برنامه‌های متنوع",
    excerpt_sv: "Firande av den iranska nyårsfesten med varierade program",
    ...activityBody("جشن نوروز", "Nowruz-firande"),
    formTemplateId: 7001n, // Uses "Basic Registration" template
    icon: "Sun", imageUrl: img("nowruz", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 2002n, topicId: 1001n, slug: "yalda-night",
    title_fa: "شب یلدا", title_sv: "Yalda-natt",
    excerpt_fa: "بزرگداشت بلندترین شب سال با شعر و موسیقی",
    excerpt_sv: "Firande av årets längsta natt med poesi och musik",
    ...activityBody("شب یلدا", "Yalda-natt"),
    // Custom form: name + how many guests + dietary restrictions
    customFormFields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "نام خود را وارد کنید", placeholder_sv: "Ange ditt fullständiga namn",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "number",
        label_fa: "تعداد مهمانان", label_sv: "Antal gäster",
        placeholder_fa: "مثلاً ۲", placeholder_sv: "T.ex. 2",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "radio",
        label_fa: "نوع غذا", label_sv: "Matpreferens",
        placeholder_fa: "", placeholder_sv: "",
        required: true,
        options: [
          { fa: "عادی", sv: "Vanlig" },
          { fa: "گیاهی", sv: "Vegetarisk" },
          { fa: "وگان", sv: "Vegansk" },
        ],
        sortOrder: 3n,
      },
      {
        id: 4n, fieldType: "textarea",
        label_fa: "توضیحات اضافی", label_sv: "Övrig information",
        placeholder_fa: "آلرژی غذایی یا نیاز خاص", placeholder_sv: "Matallergier eller speciella behov",
        required: false, options: [], sortOrder: 4n,
      },
    ],
    icon: "Moon", imageUrl: img("yalda", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 2003n, topicId: 1001n, slug: "persian-poetry-evening",
    title_fa: "شب شعر فارسی", title_sv: "Persisk poesikväll",
    excerpt_fa: "شب شعرخوانی آثار حافظ، مولانا و شاعران معاصر",
    excerpt_sv: "Poesiuppläsningskväll med verk av Hafez, Rumi och samtida poeter",
    ...activityBody("شب شعر فارسی", "Persisk poesikväll"),
    icon: "BookOpen", imageUrl: img("poetry", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 2004n, topicId: 1001n, slug: "iranian-film-night",
    title_fa: "شب فیلم ایرانی", title_sv: "Iransk filmkväll",
    excerpt_fa: "نمایش فیلم‌های برگزیده سینمای ایران و بحث و گفتگو",
    excerpt_sv: "Visning av utvalda iranska filmer följt av diskussion",
    ...activityBody("شب فیلم ایرانی", "Iransk filmkväll"),
    icon: "Film", imageUrl: img("film-night", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 2005n, topicId: 1001n, slug: "cultural-exhibition",
    title_fa: "نمایشگاه فرهنگی", title_sv: "Kulturutställning",
    excerpt_fa: "نمایشگاه صنایع دستی و هنرهای سنتی ایرانی",
    excerpt_sv: "Utställning av iranska hantverk och traditionell konst",
    ...activityBody("نمایشگاه فرهنگی", "Kulturutställning"),
    icon: "Landmark", imageUrl: img("exhibition", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(40),
  },

  // ── Education (1002) ──
  {
    id: 2006n, topicId: 1002n, slug: "persian-language-class",
    title_fa: "کلاس زبان فارسی", title_sv: "Persiska språkkurser",
    excerpt_fa: "آموزش زبان فارسی برای کودکان و بزرگسالان در سطوح مختلف",
    excerpt_sv: "Persiska språkkurser för barn och vuxna på alla nivåer",
    ...activityBody("کلاس زبان فارسی", "Persiska språkkurser"),
    formTemplateId: 7002n, // Uses "Workshop Registration" template
    icon: "Languages", imageUrl: img("persian-class", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 2007n, topicId: 1002n, slug: "swedish-integration-course",
    title_fa: "دوره آشنایی با جامعه سوئد", title_sv: "Svensk integrationskurs",
    excerpt_fa: "آشنایی با فرهنگ، قوانین و سیستم اجتماعی سوئد",
    excerpt_sv: "Introduktion till svensk kultur, lagar och samhällssystem",
    ...activityBody("دوره آشنایی با جامعه سوئد", "Svensk integrationskurs"),
    icon: "GraduationCap", imageUrl: img("swedish-course", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 2008n, topicId: 1002n, slug: "homework-help",
    title_fa: "کمک درسی دانش‌آموزان", title_sv: "Läxhjälp för elever",
    excerpt_fa: "کمک درسی رایگان برای دانش‌آموزان در مقاطع مختلف",
    excerpt_sv: "Gratis läxhjälp för elever i alla årskurser",
    ...activityBody("کمک درسی دانش‌آموزان", "Läxhjälp för elever"),
    icon: "PenTool", imageUrl: img("homework", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 2009n, topicId: 1002n, slug: "computer-skills-workshop",
    title_fa: "کارگاه مهارت‌های کامپیوتری", title_sv: "Workshop i datorkunskap",
    excerpt_fa: "آموزش مهارت‌های پایه و پیشرفته کامپیوتر",
    excerpt_sv: "Utbildning i grundläggande och avancerade datorkunskaper",
    ...activityBody("کارگاه مهارت‌های کامپیوتری", "Workshop i datorkunskap"),
    formTemplateId: 7002n, // Uses "Workshop Registration" template
    icon: "Monitor", imageUrl: img("computer", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 2010n, topicId: 1002n, slug: "parenting-seminar",
    title_fa: "سمینار فرزندپروری", title_sv: "Föräldraskapsseminarium",
    excerpt_fa: "سمینار درباره تربیت فرزندان در محیط چندفرهنگی",
    excerpt_sv: "Seminarium om barnuppfostran i en mångkulturell miljö",
    ...activityBody("سمینار فرزندپروری", "Föräldraskapsseminarium"),
    icon: "Heart", imageUrl: img("parenting", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(38),
  },

  // ── Sports (1003) ──
  {
    id: 2011n, topicId: 1003n, slug: "football-team",
    title_fa: "تیم فوتبال", title_sv: "Fotbollslag",
    excerpt_fa: "تمرینات هفتگی فوتبال برای جوانان و بزرگسالان",
    excerpt_sv: "Veckovis fotbollsträning för ungdomar och vuxna",
    ...activityBody("تیم فوتبال", "Fotbollslag"),
    formTemplateId: 7003n, // Uses "Sports Registration" template
    icon: "CircleDot", imageUrl: img("football", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 2012n, topicId: 1003n, slug: "volleyball-club",
    title_fa: "باشگاه والیبال", title_sv: "Volleybollklubb",
    excerpt_fa: "تمرینات والیبال برای آقایان و خانم‌ها",
    excerpt_sv: "Volleybollträning för herrar och damer",
    ...activityBody("باشگاه والیبال", "Volleybollklubb"),
    icon: "Activity", imageUrl: img("volleyball", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 2013n, topicId: 1003n, slug: "yoga-wellness",
    title_fa: "یوگا و تندرستی", title_sv: "Yoga och välmående",
    excerpt_fa: "کلاس‌های یوگا و مدیتیشن برای سلامت جسم و روح",
    excerpt_sv: "Yoga- och meditationsklasser för kroppsligt och själsligt välmående",
    ...activityBody("یوگا و تندرستی", "Yoga och välmående"),
    icon: "Flower2", imageUrl: img("yoga", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 2014n, topicId: 1003n, slug: "swimming-lessons",
    title_fa: "کلاس شنا", title_sv: "Simlektioner",
    excerpt_fa: "آموزش شنا برای مبتدیان و پیشرفته‌ها",
    excerpt_sv: "Simlektioner för nybörjare och avancerade",
    ...activityBody("کلاس شنا", "Simlektioner"),
    formTemplateId: 7003n, // Uses "Sports Registration" template
    icon: "Waves", imageUrl: img("swimming", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 2015n, topicId: 1003n, slug: "hiking-group",
    title_fa: "گروه کوهنوردی", title_sv: "Vandringsgrupp",
    excerpt_fa: "پیاده‌روی و کوهنوردی گروهی در طبیعت سوئد",
    excerpt_sv: "Gruppvandring och friluftsliv i svensk natur",
    ...activityBody("گروه کوهنوردی", "Vandringsgrupp"),
    icon: "Mountain", imageUrl: img("hiking", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(36),
  },

  // ── Art (1004) ──
  {
    id: 2016n, topicId: 1004n, slug: "calligraphy-workshop",
    title_fa: "کارگاه خوشنویسی", title_sv: "Kalligrafiworkshop",
    excerpt_fa: "آموزش خوشنویسی فارسی با اساتید مجرب",
    excerpt_sv: "Persisk kalligrafiundervisning med erfarna lärare",
    ...activityBody("کارگاه خوشنویسی", "Kalligrafiworkshop"),
    formTemplateId: 7002n, // Uses "Workshop Registration" template
    icon: "PenTool", imageUrl: img("calligraphy", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 2017n, topicId: 1004n, slug: "painting-class",
    title_fa: "کلاس نقاشی", title_sv: "Målarklass",
    excerpt_fa: "کلاس نقاشی آبرنگ و رنگ‌روغن برای تمام سطوح",
    excerpt_sv: "Akvarell- och oljemålarklass för alla nivåer",
    ...activityBody("کلاس نقاشی", "Målarklass"),
    icon: "Palette", imageUrl: img("painting", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 2018n, topicId: 1004n, slug: "music-ensemble",
    title_fa: "گروه موسیقی", title_sv: "Musikensemble",
    excerpt_fa: "گروه نوازندگی موسیقی سنتی و مدرن ایرانی",
    excerpt_sv: "Ensemble för traditionell och modern iransk musik",
    ...activityBody("گروه موسیقی", "Musikensemble"),
    icon: "Music", imageUrl: img("music", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 2019n, topicId: 1004n, slug: "theater-group",
    title_fa: "گروه تئاتر", title_sv: "Teatergrupp",
    excerpt_fa: "کارگاه بازیگری و اجرای نمایش‌های فارسی و سوئدی",
    excerpt_sv: "Skådespelarworkshop och framförande av persiska och svenska pjäser",
    ...activityBody("گروه تئاتر", "Teatergrupp"),
    // Custom form: audition-specific fields
    customFormFields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "email",
        label_fa: "ایمیل", label_sv: "E-post",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "select",
        label_fa: "تجربه بازیگری", label_sv: "Skådespelarerfarenhet",
        placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj",
        required: true,
        options: [
          { fa: "بدون تجربه", sv: "Ingen erfarenhet" },
          { fa: "آماتور", sv: "Amatör" },
          { fa: "حرفه‌ای", sv: "Professionell" },
        ],
        sortOrder: 3n,
      },
      {
        id: 4n, fieldType: "date",
        label_fa: "تاریخ تولد", label_sv: "Födelsedatum",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 4n,
      },
      {
        id: 5n, fieldType: "textarea",
        label_fa: "چرا می‌خواهید در گروه تئاتر شرکت کنید؟", label_sv: "Varför vill du gå med i teatergruppen?",
        placeholder_fa: "انگیزه خود را بنویسید", placeholder_sv: "Beskriv din motivation",
        required: false, options: [], sortOrder: 5n,
      },
    ],
    icon: "Theater", imageUrl: img("theater", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 2020n, topicId: 1004n, slug: "photography-club",
    title_fa: "باشگاه عکاسی", title_sv: "Fotoklubb",
    excerpt_fa: "آموزش عکاسی و برگزاری نمایشگاه آثار اعضا",
    excerpt_sv: "Fotografiundervisning och utställning av medlemmarnas verk",
    ...activityBody("باشگاه عکاسی", "Fotoklubb"),
    icon: "Camera", imageUrl: img("photography", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(34),
  },

  // ── Community (1005) ──
  {
    id: 2021n, topicId: 1005n, slug: "volunteer-program",
    title_fa: "برنامه داوطلبانه", title_sv: "Volontärprogram",
    excerpt_fa: "مشارکت در فعالیت‌های داوطلبانه و خدمات اجتماعی",
    excerpt_sv: "Delta i volontäraktiviteter och samhällstjänster",
    ...activityBody("برنامه داوطلبانه", "Volontärprogram"),
    icon: "HandHeart", imageUrl: img("volunteer", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 2022n, topicId: 1005n, slug: "family-day",
    title_fa: "روز خانواده", title_sv: "Familjedag",
    excerpt_fa: "برنامه تفریحی ویژه خانواده‌ها با بازی و پذیرایی",
    excerpt_sv: "Underhållningsprogram för familjer med spel och förfriskningar",
    ...activityBody("روز خانواده", "Familjedag"),
    icon: "Users", imageUrl: img("family-day", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 2023n, topicId: 1005n, slug: "mentorship-program",
    title_fa: "برنامه منتورشیپ", title_sv: "Mentorskapsprogram",
    excerpt_fa: "راهنمایی و مشاوره برای تازه‌واردان به سوئد",
    excerpt_sv: "Vägledning och rådgivning för nyanlända till Sverige",
    ...activityBody("برنامه منتورشیپ", "Mentorskapsprogram"),
    // Custom form: mentorship-specific
    customFormFields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "email",
        label_fa: "ایمیل", label_sv: "E-post",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "phone",
        label_fa: "تلفن", label_sv: "Telefon",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 3n,
      },
      {
        id: 4n, fieldType: "radio",
        label_fa: "نقش مورد نظر", label_sv: "Önskad roll",
        placeholder_fa: "", placeholder_sv: "",
        required: true,
        options: [
          { fa: "منتور (راهنما)", sv: "Mentor" },
          { fa: "منتی (جوینده راهنمایی)", sv: "Adept" },
        ],
        sortOrder: 4n,
      },
      {
        id: 5n, fieldType: "select",
        label_fa: "زبان ترجیحی", label_sv: "Föredraget språk",
        placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj",
        required: true,
        options: [
          { fa: "فارسی", sv: "Persiska" },
          { fa: "سوئدی", sv: "Svenska" },
          { fa: "انگلیسی", sv: "Engelska" },
        ],
        sortOrder: 5n,
      },
      {
        id: 6n, fieldType: "textarea",
        label_fa: "درباره خودتان بنویسید", label_sv: "Berätta om dig själv",
        placeholder_fa: "تجربیات و علایق خود را شرح دهید", placeholder_sv: "Beskriv dina erfarenheter och intressen",
        required: false, options: [], sortOrder: 6n,
      },
    ],
    icon: "Compass", imageUrl: img("mentorship", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 2024n, topicId: 1005n, slug: "senior-gathering",
    title_fa: "دورهمی بزرگسالان", title_sv: "Seniorträff",
    excerpt_fa: "نشست‌های هفتگی برای بزرگسالان با چای و گفتگو",
    excerpt_sv: "Veckovisa träffar för seniorer med te och samtal",
    ...activityBody("دورهمی بزرگسالان", "Seniorträff"),
    icon: "Coffee", imageUrl: img("senior", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 2025n, topicId: 1005n, slug: "youth-leadership",
    title_fa: "رهبری جوانان", title_sv: "Ungdomsledarskap",
    excerpt_fa: "دوره آموزش مهارت‌های رهبری برای نوجوانان",
    excerpt_sv: "Ledarskapsutbildning för ungdomar",
    ...activityBody("رهبری جوانان", "Ungdomsledarskap"),
    icon: "Rocket", imageUrl: img("youth", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(32),
  },
];

// ─── Hero Slides ────────────────────────────────────────────────────────────

export const mockSlides: HeroSlideReturn[] = [
  // Culture slides
  {
    id: 3001n, topicId: 1001n, imageUrl: img("slide-culture-1", 1920, 800),
    title_fa: "فرهنگ ایرانی در سوئد", title_sv: "Iransk kultur i Sverige",
    subtitle_fa: "پل ارتباط میان دو فرهنگ", subtitle_sv: "En bro mellan två kulturer",
    ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer",
    ctaLink: "/topics/culture", sortOrder: 1n,
  },
  {
    id: 3002n, topicId: 1001n, imageUrl: img("slide-culture-2", 1920, 800),
    title_fa: "جشن نوروز ۱۴۰۵", title_sv: "Nowruz-firande 1405",
    subtitle_fa: "بزرگترین جشن بهاری", subtitle_sv: "Årets största vårfest",
    ctaText_fa: "ثبت‌نام کنید", ctaText_sv: "Registrera dig",
    ctaLink: "/topics/culture/nowruz-celebration", sortOrder: 2n,
  },
  // Education slides
  {
    id: 3003n, topicId: 1002n, imageUrl: img("slide-edu-1", 1920, 800),
    title_fa: "آموزش برای همه", title_sv: "Utbildning för alla",
    subtitle_fa: "کلاس‌های متنوع برای تمام سنین", subtitle_sv: "Varierade kurser för alla åldrar",
    ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera",
    ctaLink: "/topics/education", sortOrder: 1n,
  },
  {
    id: 3004n, topicId: 1002n, imageUrl: img("slide-edu-2", 1920, 800),
    title_fa: "زبان فارسی را یاد بگیرید", title_sv: "Lär dig persiska",
    subtitle_fa: "دوره‌های ویژه کودکان و بزرگسالان", subtitle_sv: "Specialkurser för barn och vuxna",
    ctaText_fa: "اطلاعات بیشتر", ctaText_sv: "Mer info",
    ctaLink: "/topics/education/persian-language-class", sortOrder: 2n,
  },
  // Sports slides
  {
    id: 3005n, topicId: 1003n, imageUrl: img("slide-sport-1", 1920, 800),
    title_fa: "ورزش و سلامتی", title_sv: "Sport och hälsa",
    subtitle_fa: "فعالیت‌های ورزشی هفتگی", subtitle_sv: "Veckovisa sportaktiviteter",
    ctaText_fa: "عضو شوید", ctaText_sv: "Bli medlem",
    ctaLink: "/topics/sports", sortOrder: 1n,
  },
  {
    id: 3006n, topicId: 1003n, imageUrl: img("slide-sport-2", 1920, 800),
    title_fa: "تیم فوتبال کانون", title_sv: "Kanons fotbollslag",
    subtitle_fa: "بپیوندید به تیم ما", subtitle_sv: "Gå med i vårt lag",
    ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera",
    ctaLink: "/topics/sports/football-team", sortOrder: 2n,
  },
  // Art slides
  {
    id: 3007n, topicId: 1004n, imageUrl: img("slide-art-1", 1920, 800),
    title_fa: "هنر ایرانی", title_sv: "Iransk konst",
    subtitle_fa: "از خوشنویسی تا موسیقی", subtitle_sv: "Från kalligrafi till musik",
    ctaText_fa: "کشف کنید", ctaText_sv: "Upptäck",
    ctaLink: "/topics/art", sortOrder: 1n,
  },
  {
    id: 3008n, topicId: 1004n, imageUrl: img("slide-art-2", 1920, 800),
    title_fa: "کارگاه خوشنویسی", title_sv: "Kalligrafiworkshop",
    subtitle_fa: "هنر زیبای خط فارسی", subtitle_sv: "Den vackra konsten av persisk kalligrafi",
    ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera",
    ctaLink: "/topics/art/calligraphy-workshop", sortOrder: 2n,
  },
  // Community slides
  {
    id: 3009n, topicId: 1005n, imageUrl: img("slide-community-1", 1920, 800),
    title_fa: "جامعه ما", title_sv: "Vårt samhälle",
    subtitle_fa: "با هم قوی‌تریم", subtitle_sv: "Tillsammans är vi starkare",
    ctaText_fa: "بپیوندید", ctaText_sv: "Gå med",
    ctaLink: "/topics/community", sortOrder: 1n,
  },
  {
    id: 3010n, topicId: 1005n, imageUrl: img("slide-community-2", 1920, 800),
    title_fa: "داوطلب شوید", title_sv: "Bli volontär",
    subtitle_fa: "کمک به ساختن جامعه‌ای بهتر", subtitle_sv: "Hjälp till att bygga ett bättre samhälle",
    ctaText_fa: "اطلاعات بیشتر", ctaText_sv: "Mer info",
    ctaLink: "/topics/community/volunteer-program", sortOrder: 2n,
  },
];

// ─── About Content ──────────────────────────────────────────────────────────

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("about-header", 1920, 600),
  body_fa: `<h2>درباره کانون</h2>
<p>کانون فرهنگی، آموزشی و ورزشی ایرانیان یک سازمان غیرانتفاعی است که با هدف حفظ و ترویج فرهنگ ایرانی در سوئد فعالیت می‌کند.</p>
<h3>مأموریت ما</h3>
<p>ما متعهد به ایجاد پلی میان فرهنگ ایرانی و جامعه سوئدی هستیم. از طریق برنامه‌های فرهنگی، آموزشی و ورزشی، ما فضایی را برای تبادل فرهنگی و رشد اجتماعی فراهم می‌کنیم.</p>
<h3>تاریخچه</h3>
<p>کانون در سال ۲۰۲۰ توسط گروهی از ایرانیان مقیم سوئد تأسیس شد و از آن زمان تاکنون صدها برنامه فرهنگی، آموزشی و ورزشی برگزار کرده است.</p>`,
  body_sv: `<h2>Om Kanon</h2>
<p>Kanon är en ideell organisation som arbetar för att bevara och främja iransk kultur i Sverige.</p>
<h3>Vårt uppdrag</h3>
<p>Vi är engagerade i att skapa en bro mellan iransk kultur och det svenska samhället. Genom kulturella, utbildningsmässiga och sportrelaterade program skapar vi utrymmen för kulturellt utbyte och social utveckling.</p>
<h3>Historia</h3>
<p>Kanon grundades 2020 av en grupp iranier bosatta i Sverige och har sedan dess anordnat hundratals kulturella, utbildningsmässiga och sportrelaterade program.</p>`,
};

// ─── Contact Messages ───────────────────────────────────────────────────────

export const mockContactMessages: ContactMessageReturn[] = [
  {
    id: 4001n, name: "Sara Ahmadi", email: "sara.ahmadi@example.com",
    phone: "+46701234567", message: "سلام، می‌خواهم درباره کلاس‌های زبان فارسی اطلاعات بیشتری داشته باشم.",
    createdAt: ts(5),
  },
  {
    id: 4002n, name: "Erik Johansson", email: "erik.j@example.com",
    phone: "+46709876543", message: "Hej, jag vill gärna veta mer om era kulturella evenemang.",
    createdAt: ts(10),
  },
  {
    id: 4003n, name: "Maryam Hosseini", email: "m.hosseini@example.com",
    phone: "+46705551234", message: "آیا امکان ثبت‌نام آنلاین برای کلاس‌های ورزشی وجود دارد؟",
    createdAt: ts(15),
  },
  {
    id: 4004n, name: "Anna Lindström", email: "anna.l@example.com",
    phone: "+46708765432", message: "Jag är intresserad av att bli volontär. Hur kan jag delta?",
    createdAt: ts(20),
  },
  {
    id: 4005n, name: "Ali Rezaei", email: "ali.rezaei@example.com",
    phone: "+46702345678", message: "ممنون از برنامه‌های عالی‌تان. آیا برنامه‌ای برای تابستان دارید؟",
    createdAt: ts(25),
  },
];

// ─── Social Links ───────────────────────────────────────────────────────────

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 5001n, platform: "instagram", url: "https://instagram.com/kanon_se", sortOrder: 1n },
  { id: 5002n, platform: "facebook", url: "https://facebook.com/kanon.se", sortOrder: 2n },
  { id: 5003n, platform: "youtube", url: "https://youtube.com/@kanon_se", sortOrder: 3n },
  { id: 5004n, platform: "website", url: "https://kanon.se", sortOrder: 4n },
  { id: 5005n, platform: "email", url: "mailto:info@kanon.se", sortOrder: 5n },
];

// ─── Registrations ──────────────────────────────────────────────────────────

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 6001n, activityId: 2001n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Nima Karimi" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "nima@example.com" },
      { fieldId: 3n, fieldLabel: "پیام / Meddelande", value: "مشتاقانه منتظر جشن نوروز هستم!" },
    ],
    createdAt: ts(3),
  },
  {
    id: 6002n, activityId: 2001n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Lisa Svensson" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "lisa.s@example.com" },
      { fieldId: 3n, fieldLabel: "پیام / Meddelande", value: "Jag vill gärna delta med min familj." },
    ],
    createdAt: ts(4),
  },
  {
    id: 6003n, activityId: 2006n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Reza Mohammadi" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "reza.m@example.com" },
      { fieldId: 3n, fieldLabel: "تلفن / Telefon", value: "+46707778899" },
      { fieldId: 4n, fieldLabel: "سطح تجربه / Erfarenhetsnivå", value: "مبتدی" },
      { fieldId: 5n, fieldLabel: "توضیحات اضافی / Ytterligare information", value: "می‌خواهم فرزندم را برای کلاس فارسی ثبت‌نام کنم." },
    ],
    createdAt: ts(6),
  },
  {
    id: 6004n, activityId: 2011n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Darius Farhadi" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "darius@example.com" },
      { fieldId: 3n, fieldLabel: "تلفن / Telefon", value: "+46703334455" },
      { fieldId: 4n, fieldLabel: "سن / Ålder", value: "28" },
      { fieldId: 5n, fieldLabel: "اندازه تی‌شرت / T-shirtstorlek", value: "L" },
      { fieldId: 6n, fieldLabel: "قوانین را می‌پذیرم / Jag accepterar reglerna", value: "true" },
    ],
    createdAt: ts(8),
  },
  {
    id: 6005n, activityId: 2016n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Shirin Nazari" },
      { fieldId: 2n, fieldLabel: "ایمیل / E-post", value: "shirin@example.com" },
      { fieldId: 3n, fieldLabel: "تلفن / Telefon", value: "+46706667788" },
      { fieldId: 4n, fieldLabel: "سطح تجربه / Erfarenhetsnivå", value: "متوسط" },
      { fieldId: 5n, fieldLabel: "توضیحات اضافی / Ytterligare information", value: "خیلی علاقه‌مند به یادگیری خوشنویسی هستم." },
    ],
    createdAt: ts(12),
  },
  // Default-form registrations (activities without templates or custom fields)
  {
    id: 6006n, activityId: 2005n, name: "Amir Tehrani", email: "amir.t@example.com",
    phone: "+46701239876", message: "آیا بچه‌ها هم می‌توانند در نمایشگاه شرکت کنند؟",
    fieldValues: [],
    createdAt: ts(7),
  },
  {
    id: 6007n, activityId: 2007n, name: "Fatima Nilsson", email: "fatima.n@example.com",
    phone: "+46708884321", message: "Jag vill anmäla mig och min man till kursen.",
    fieldValues: [],
    createdAt: ts(9),
  },
  // Custom-form registration (Yalda Night)
  {
    id: 6008n, activityId: 2002n, name: "", email: "",
    phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "نام و نام خانوادگی / Fullständigt namn", value: "Parisa Bahrami" },
      { fieldId: 2n, fieldLabel: "تعداد مهمانان / Antal gäster", value: "3" },
      { fieldId: 3n, fieldLabel: "نوع غذا / Matpreferens", value: "گیاهی" },
      { fieldId: 4n, fieldLabel: "توضیحات اضافی / Övrig information", value: "یکی از مهمانان آلرژی به آجیل دارد." },
    ],
    createdAt: ts(2),
  },
];

// ─── Form Templates ─────────────────────────────────────────────────────────

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 7001n,
    name_fa: "ثبت‌نام پایه",
    name_sv: "Grundregistrering",
    description_fa: "فرم ساده با نام، ایمیل و پیام",
    description_sv: "Enkelt formulär med namn, e-post och meddelande",
    fields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "نام خود را وارد کنید", placeholder_sv: "Ange ditt namn",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "email",
        label_fa: "ایمیل", label_sv: "E-post",
        placeholder_fa: "ایمیل خود را وارد کنید", placeholder_sv: "Ange din e-post",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "textarea",
        label_fa: "پیام", label_sv: "Meddelande",
        placeholder_fa: "پیام خود را بنویسید", placeholder_sv: "Skriv ditt meddelande",
        required: false, options: [], sortOrder: 3n,
      },
    ],
    createdAt: ts(100),
  },
  {
    id: 7002n,
    name_fa: "ثبت‌نام کارگاه",
    name_sv: "Workshopregistrering",
    description_fa: "فرم مناسب برای ثبت‌نام در کارگاه‌ها و دوره‌ها",
    description_sv: "Formulär lämpligt för workshop- och kursregistrering",
    fields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "email",
        label_fa: "ایمیل", label_sv: "E-post",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "phone",
        label_fa: "تلفن", label_sv: "Telefon",
        placeholder_fa: "", placeholder_sv: "",
        required: false, options: [], sortOrder: 3n,
      },
      {
        id: 4n, fieldType: "select",
        label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå",
        placeholder_fa: "", placeholder_sv: "",
        required: true,
        options: [
          { fa: "مبتدی", sv: "Nybörjare" },
          { fa: "متوسط", sv: "Medel" },
          { fa: "پیشرفته", sv: "Avancerad" },
        ],
        sortOrder: 4n,
      },
      {
        id: 5n, fieldType: "textarea",
        label_fa: "توضیحات اضافی", label_sv: "Ytterligare information",
        placeholder_fa: "", placeholder_sv: "",
        required: false, options: [], sortOrder: 5n,
      },
    ],
    createdAt: ts(95),
  },
  {
    id: 7003n,
    name_fa: "ثبت‌نام ورزشی",
    name_sv: "Sportregistrering",
    description_fa: "فرم مناسب برای ثبت‌نام در فعالیت‌های ورزشی",
    description_sv: "Formulär för registrering i sportaktiviteter",
    fields: [
      {
        id: 1n, fieldType: "text",
        label_fa: "نام و نام خانوادگی", label_sv: "Fullständigt namn",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 1n,
      },
      {
        id: 2n, fieldType: "email",
        label_fa: "ایمیل", label_sv: "E-post",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 2n,
      },
      {
        id: 3n, fieldType: "phone",
        label_fa: "تلفن", label_sv: "Telefon",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 3n,
      },
      {
        id: 4n, fieldType: "number",
        label_fa: "سن", label_sv: "Ålder",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 4n,
      },
      {
        id: 5n, fieldType: "select",
        label_fa: "اندازه تی‌شرت", label_sv: "T-shirtstorlek",
        placeholder_fa: "", placeholder_sv: "",
        required: false,
        options: [
          { fa: "S", sv: "S" },
          { fa: "M", sv: "M" },
          { fa: "L", sv: "L" },
          { fa: "XL", sv: "XL" },
        ],
        sortOrder: 5n,
      },
      {
        id: 6n, fieldType: "checkbox",
        label_fa: "قوانین را می‌پذیرم", label_sv: "Jag accepterar reglerna",
        placeholder_fa: "", placeholder_sv: "",
        required: true, options: [], sortOrder: 6n,
      },
    ],
    createdAt: ts(90),
  },
];
