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
  logoUrl: img("harmonia-logo", 200, 200),
  title_fa: "هارمونیا",
  title_sv: "Harmonia",
  subtitle_fa: "آکادمی موسیقی، هنر و رقص",
  subtitle_sv: "Akademi för musik, konst och dans",
  landingBackgroundUrl: img("harmonia-landing", 1920, 1080),
  topicsBackgroundUrl: img("harmonia-topics", 1920, 1080),
  mockMode: true,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const mockTopics: TopicReturn[] = [
  {
    id: 31001n, slug: "piano-keys",
    title_fa: "پیانو و کیبورد", title_sv: "Piano och keyboard",
    description_fa: "درس‌های پیانو کلاسیک، جاز و ایمپروویزاسیون برای تمام سطوح",
    description_sv: "Lektioner i klassiskt piano, jazz och improvisation för alla nivåer",
    icon: "Piano", backgroundUrl: img("piano-bg", 1920, 1080),
    sortOrder: 1n, createdAt: ts(90),
  },
  {
    id: 31002n, slug: "vocals-choir",
    title_fa: "آواز و کُر", title_sv: "Sång och kör",
    description_fa: "تکنیک‌های آواز، کُر جمعی و تفسیر ترانه",
    description_sv: "Sångtekniker, körsjungande och låttolkning",
    icon: "Mic", backgroundUrl: img("vocals-bg", 1920, 1080),
    sortOrder: 2n, createdAt: ts(85),
  },
  {
    id: 31003n, slug: "visual-arts",
    title_fa: "هنرهای بصری", title_sv: "Visuell konst",
    description_fa: "نقاشی آبرنگ، پرتره روغن، مجسمه‌سازی و تصویرسازی دیجیتال",
    description_sv: "Akvarellmålning, oljepotträtt, skulptur och digital illustration",
    icon: "Palette", backgroundUrl: img("visual-arts-bg", 1920, 1080),
    sortOrder: 3n, createdAt: ts(80),
  },
  {
    id: 31004n, slug: "dance",
    title_fa: "رقص", title_sv: "Dans",
    description_fa: "باله، رقص معاصر، ریتم‌های لاتین و رقص برای سلامتی",
    description_sv: "Balett, samtida dans, latinrytmer och dans för välmående",
    icon: "Footprints", backgroundUrl: img("dance-bg", 1920, 1080),
    sortOrder: 4n, createdAt: ts(75),
  },
  {
    id: 31005n, slug: "composition",
    title_fa: "تئوری و آهنگسازی", title_sv: "Teori och komposition",
    description_fa: "تئوری موسیقی، ترانه‌سرایی، تنظیم و موسیقی الکترونیک",
    description_sv: "Musikteori, låtskrivning, arrangemang och elektronisk musik",
    icon: "Music", backgroundUrl: img("composition-bg", 1920, 1080),
    sortOrder: 5n, createdAt: ts(70),
  },
];

// ─── Activities ───────────────────────────────────────────────────────────────

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>آکادمی هارمونیا محیطی الهام‌بخش برای هنرمندان در تمام سطوح فراهم می‌کند. مربیان حرفه‌ای ما با رویکردی فردمحور، هر دانشجو را در مسیر رشد هنری‌اش همراهی می‌کنند.</p><p>برای کسب اطلاعات بیشتر و ثبت‌نام در کلاس، با ما تماس بگیرید.</p>`,
  body_sv: `<h2>${sv}</h2><p>Harmonia Academy erbjuder en inspirerande miljö för konstnärer på alla nivåer. Våra professionella instruktörer stödjer varje elev på sin konstnärliga tillväxtresa med ett individuellt anpassat tillvägagångssätt.</p><p>Kontakta oss för mer information och kursanmälan.</p>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // ── Piano ──
  {
    id: 32001n, topicId: 31001n, slug: "beginner-piano",
    title_fa: "پیانو مبتدیان", title_sv: "Nybörjarpiano",
    excerpt_fa: "تسلط بر مبانی پیانو: نُت‌خوانی، پوزیشن دست و ریتم",
    excerpt_sv: "Bemästra pianots grunder: notläsning, handposition och rytm",
    ...body("پیانو مبتدیان", "Nybörjarpiano"),
    formTemplateId: 37001n,
    icon: "Piano", imageUrl: img("beginner-piano", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 32002n, topicId: 31001n, slug: "classical-techniques",
    title_fa: "تکنیک‌های کلاسیک", title_sv: "Klassiska tekniker",
    excerpt_fa: "آثار باخ، موتزارت و بتهوون با تمرکز بر تکنیک‌های اجرایی",
    excerpt_sv: "Verk av Bach, Mozart och Beethoven med fokus på teknisk utförande",
    ...body("تکنیک‌های کلاسیک", "Klassiska tekniker"),
    formTemplateId: 37001n,
    icon: "Music2", imageUrl: img("classical-piano", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 32003n, topicId: 31001n, slug: "jazz-improvisation",
    title_fa: "ایمپروویزاسیون جاز", title_sv: "Jazzimprovisation",
    excerpt_fa: "تئوری جاز، مُد‌ها، کمپ‌ها و ایمپروویزاسیون آزاد",
    excerpt_sv: "Jazzteori, modes, comping och fri improvisation",
    ...body("ایمپروویزاسیون جاز", "Jazzimprovisation"),
    icon: "Shuffle", imageUrl: img("jazz-piano", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 32004n, topicId: 31001n, slug: "piano-ensemble",
    title_fa: "آنسامبل پیانو", title_sv: "Pianoensemble",
    excerpt_fa: "اجرای مشترک قطعات چهار دستی و با گروه",
    excerpt_sv: "Gemensamt framförande av pianoduetter och ensemblestycken",
    ...body("آنسامبل پیانو", "Pianoensemble"),
    formTemplateId: 37001n,
    icon: "Users", imageUrl: img("piano-ensemble", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 32005n, topicId: 31001n, slug: "digital-music-production",
    title_fa: "تولید موسیقی دیجیتال", title_sv: "Digital musikproduktion",
    excerpt_fa: "کار با DAW، Ableton و تهیه بیت‌های حرفه‌ای",
    excerpt_sv: "Arbeta med DAW, Ableton och producera professionella beats",
    ...body("تولید موسیقی دیجیتال", "Digital musikproduktion"),
    icon: "Headphones", imageUrl: img("music-production", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(40),
  },
  // ── Vocals ──
  {
    id: 32006n, topicId: 31002n, slug: "voice-basics",
    title_fa: "مبانی صدا", title_sv: "Röstgrunder",
    excerpt_fa: "تمرین‌های تنفس، گرم‌کردن صدا و تکنیک‌های اساسی آواز",
    excerpt_sv: "Andningsövningar, röstuppvärmning och grundläggande sångtekniker",
    ...body("مبانی صدا", "Röstgrunder"),
    formTemplateId: 37001n,
    icon: "Mic", imageUrl: img("voice-basics", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 32007n, topicId: 31002n, slug: "choir-practice",
    title_fa: "تمرین کُر", title_sv: "Körrepetition",
    excerpt_fa: "هماهنگی آوازی چند صدایی، پارتیتورخوانی و اجرای جمعی",
    excerpt_sv: "Flerstämmig sångharmonisering, partiturläsning och kollektivt framförande",
    ...body("تمرین کُر", "Körrepetition"),
    icon: "Users", imageUrl: img("choir", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 32008n, topicId: 31002n, slug: "song-interpretation",
    title_fa: "تفسیر ترانه", title_sv: "Låttolkning",
    excerpt_fa: "بیان احساسی، دینامیک و روایت‌گری از طریق آواز",
    excerpt_sv: "Känslomässigt uttryck, dynamik och berättande genom sång",
    ...body("تفسیر ترانه", "Låttolkning"),
    icon: "Heart", imageUrl: img("song-interpretation", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 32009n, topicId: 31002n, slug: "breath-posture",
    title_fa: "تنفس و بدن‌آگاهی", title_sv: "Andning och kroppskännedom",
    excerpt_fa: "تکنیک‌های تنفس دیافراگمی و پوسچر صحیح برای خوانندگی",
    excerpt_sv: "Diafragmaandningstekniker och korrekt hållning för sångare",
    ...body("تنفس و بدن‌آگاهی", "Andning och kroppskännedom"),
    formTemplateId: 37001n,
    icon: "Wind", imageUrl: img("breath-vocal", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 32010n, topicId: 31002n, slug: "performance-workshop",
    title_fa: "کارگاه اجرا", title_sv: "Framförandeworkshop",
    excerpt_fa: "آمادگی برای صحنه، ارتباط با مخاطب و مدیریت اضطراب اجرا",
    excerpt_sv: "Scenberedskap, publikengagemang och hantering av scenångest",
    ...body("کارگاه اجرا", "Framförandeworkshop"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "نوع صدا", label_sv: "Rösttyp", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "سوپرانو", sv: "Sopran" }, { fa: "آلتو", sv: "Alt" }, { fa: "تنور", sv: "Tenor" }, { fa: "باریتون/باس", sv: "Baryton/Bas" }], sortOrder: 3n },
      { id: 4n, fieldType: "textarea", label_fa: "قطعه‌ای که قرار است اجرا کنید", label_sv: "Stycket du ska framföra", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 4n },
    ],
    icon: "Star", imageUrl: img("performance-workshop", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(38),
  },
  // ── Visual Arts ──
  {
    id: 32011n, topicId: 31003n, slug: "watercolor-painting",
    title_fa: "نقاشی آبرنگ", title_sv: "Akvarellmålning",
    excerpt_fa: "تکنیک‌های آبرنگ از لایه‌گذاری تا رنگ‌آمیزی آزاد",
    excerpt_sv: "Akvarelltekniker från skiktning till frihandsmålning",
    ...body("نقاشی آبرنگ", "Akvarellmålning"),
    formTemplateId: 37002n,
    icon: "Palette", imageUrl: img("watercolor", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 32012n, topicId: 31003n, slug: "oil-portrait",
    title_fa: "پرتره رنگ روغن", title_sv: "Oljemålad porträtt",
    excerpt_fa: "ترکیب‌بندی، نور و سایه و تکنیک‌های پرتره‌نگاری رنگ روغن",
    excerpt_sv: "Komposition, ljus och skugga och porträtteringsteknik i olja",
    ...body("پرتره رنگ روغن", "Oljemålad porträtt"),
    formTemplateId: 37002n,
    icon: "User", imageUrl: img("oil-portrait", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 32013n, topicId: 31003n, slug: "sculpture-workshop",
    title_fa: "کارگاه مجسمه‌سازی", title_sv: "Skulpturworkshop",
    excerpt_fa: "کار با گِل، سفال و ساخت مجسمه‌های سه‌بعدی",
    excerpt_sv: "Arbeta med lera, keramik och bygga tredimensionella skulpturer",
    ...body("کارگاه مجسمه‌سازی", "Skulpturworkshop"),
    icon: "Box", imageUrl: img("sculpture", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 32014n, topicId: 31003n, slug: "life-drawing",
    title_fa: "طراحی از مدل زنده", title_sv: "Levande modellteckning",
    excerpt_fa: "مطالعه آناتومی هنری و طراحی سریع از مدل زنده",
    excerpt_sv: "Studie av konstnärlig anatomi och snabbteckning från levande modell",
    ...body("طراحی از مدل زنده", "Levande modellteckning"),
    icon: "PenTool", imageUrl: img("life-drawing", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 32015n, topicId: 31003n, slug: "digital-illustration",
    title_fa: "تصویرسازی دیجیتال", title_sv: "Digital illustration",
    excerpt_fa: "کار با iPad Pro، Procreate و Adobe Illustrator",
    excerpt_sv: "Arbeta med iPad Pro, Procreate och Adobe Illustrator",
    ...body("تصویرسازی دیجیتال", "Digital illustration"),
    formTemplateId: 37002n,
    icon: "Monitor", imageUrl: img("digital-art", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(36),
  },
  // ── Dance ──
  {
    id: 32016n, topicId: 31004n, slug: "ballet-intro",
    title_fa: "مقدمه‌ای بر باله", title_sv: "Introduktion till balett",
    excerpt_fa: "تکنیک‌های پایه باله، پوزیشن‌های کلاسیک و آداپتاسیون بدن",
    excerpt_sv: "Grundläggande balettekniker, klassiska positioner och kropp adaptation",
    ...body("مقدمه‌ای بر باله", "Introduktion till balett"),
    formTemplateId: 37001n,
    icon: "Footprints", imageUrl: img("ballet", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 32017n, topicId: 31004n, slug: "contemporary-dance",
    title_fa: "رقص معاصر", title_sv: "Samtida dans",
    excerpt_fa: "بیان بدنی آزاد، فلوچینگ و کوریوگرافی تجربی",
    excerpt_sv: "Fritt kroppsuttryck, flowing och experimentell koreografi",
    ...body("رقص معاصر", "Samtida dans"),
    formTemplateId: 37001n,
    icon: "Wind", imageUrl: img("contemporary-dance", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 32018n, topicId: 31004n, slug: "latin-rhythms",
    title_fa: "ریتم‌های لاتین", title_sv: "Latinrytmer",
    excerpt_fa: "سالسا، باچاتا و چاچا — سرگرمی و سلامتی با هم",
    excerpt_sv: "Salsa, bachata och cha-cha — kul och hälsosamt tillsammans",
    ...body("ریتم‌های لاتین", "Latinrytmer"),
    icon: "Music", imageUrl: img("latin-dance", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 32019n, topicId: 31004n, slug: "dance-for-wellness",
    title_fa: "رقص برای سلامتی", title_sv: "Dans för välmående",
    excerpt_fa: "حرکت آزادانه، تنش‌زدایی عضلانی و شادی از طریق رقص",
    excerpt_sv: "Fri rörelse, muskelavspänning och glädje genom dans",
    ...body("رقص برای سلامتی", "Dans för välmående"),
    icon: "Heart", imageUrl: img("dance-wellness", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 32020n, topicId: 31004n, slug: "choreography-lab",
    title_fa: "آزمایشگاه کوریوگرافی", title_sv: "Koreografilabb",
    excerpt_fa: "ساخت کوریوگرافی شخصی با راهنمایی کوریوگراف حرفه‌ای",
    excerpt_sv: "Skapa personlig koreografi med vägledning av professionell koreograf",
    ...body("آزمایشگاه کوریوگرافی", "Koreografilabb"),
    formTemplateId: 37001n,
    icon: "GitBranch", imageUrl: img("choreography", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(34),
  },
  // ── Composition ──
  {
    id: 32021n, topicId: 31005n, slug: "music-theory-fundamentals",
    title_fa: "مبانی تئوری موسیقی", title_sv: "Musikteorigrunder",
    excerpt_fa: "گام‌ها، آکوردها، ریتم و ساختار موسیقی",
    excerpt_sv: "Skalor, ackord, rytm och musikalisk struktur",
    ...body("مبانی تئوری موسیقی", "Musikteorigrunder"),
    formTemplateId: 37001n,
    icon: "BookOpen", imageUrl: img("music-theory", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 32022n, topicId: 31005n, slug: "songwriting-workshop",
    title_fa: "کارگاه ترانه‌سرایی", title_sv: "Låtskrivarworkshop",
    excerpt_fa: "از ایده تا ترانه: ملودی، هارمونی و کلمات",
    excerpt_sv: "Från idé till låt: melodi, harmoni och text",
    ...body("کارگاه ترانه‌سرایی", "Låtskrivarworkshop"),
    formTemplateId: 37002n,
    icon: "PenLine", imageUrl: img("songwriting", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 32023n, topicId: 31005n, slug: "film-scoring",
    title_fa: "موسیقی فیلم", title_sv: "Filmmusik",
    excerpt_fa: "ساختن موسیقی برای تصویر، احساسات و روایت بصری",
    excerpt_sv: "Skapa musik för bild, känslor och visuellt berättande",
    ...body("موسیقی فیلم", "Filmmusik"),
    icon: "Film", imageUrl: img("film-scoring", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 32024n, topicId: 31005n, slug: "ear-training",
    title_fa: "تمرین گوش", title_sv: "Gehörsträning",
    excerpt_fa: "تشخیص فواصل، آکوردها و ریتم‌ها با گوش موسیقایی",
    excerpt_sv: "Identifiera intervaller, ackord och rytmer med musikaliskt gehör",
    ...body("تمرین گوش", "Gehörsträning"),
    icon: "Ear", imageUrl: img("ear-training", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 32025n, topicId: 31005n, slug: "electronic-music",
    title_fa: "موسیقی الکترونیک", title_sv: "Elektronisk musik",
    excerpt_fa: "سینتسایزر، ساخت بیت و موسیقی آمبیانت تجربی",
    excerpt_sv: "Synthesizer, beatmaking och experimentell ambient musik",
    ...body("موسیقی الکترونیک", "Elektronisk musik"),
    formTemplateId: 37002n,
    icon: "Radio", imageUrl: img("electronic-music", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(32),
  },
];

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export const mockSlides: HeroSlideReturn[] = [
  { id: 33001n, topicId: 31001n, imageUrl: img("slide-piano-1", 1920, 800), title_fa: "صدای پیانو در جانت جاری شود", title_sv: "Låt pianots ljud flöda i dig", subtitle_fa: "از مبتدی تا کنسرت‌دهنده", subtitle_sv: "Från nybörjare till konsertutövare", ctaText_fa: "شروع کنید", ctaText_sv: "Börja", ctaLink: "/topics/piano-keys", sortOrder: 1n },
  { id: 33002n, topicId: 31001n, imageUrl: img("slide-piano-2", 1920, 800), title_fa: "ایمپروویزاسیون جاز", title_sv: "Jazzimprovisation", subtitle_fa: "آزادی در موسیقی", subtitle_sv: "Frihet i musik", ctaText_fa: "کشف کنید", ctaText_sv: "Upptäck", ctaLink: "/topics/piano-keys/jazz-improvisation", sortOrder: 2n },
  { id: 33003n, topicId: 31002n, imageUrl: img("slide-vocals-1", 1920, 800), title_fa: "صدای خود را پیدا کنید", title_sv: "Hitta din röst", subtitle_fa: "آواز — قدرتمندترین ساز", subtitle_sv: "Sång — det mäktigaste instrumentet", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/vocals-choir", sortOrder: 1n },
  { id: 33004n, topicId: 31002n, imageUrl: img("slide-vocals-2", 1920, 800), title_fa: "کُر هارمونیا", title_sv: "Harmonias kör", subtitle_fa: "هارمونی در اتحاد", subtitle_sv: "Harmoni i enighet", ctaText_fa: "بپیوندید", ctaText_sv: "Gå med", ctaLink: "/topics/vocals-choir/choir-practice", sortOrder: 2n },
  { id: 33005n, topicId: 31003n, imageUrl: img("slide-art-v-1", 1920, 800), title_fa: "بیافرینید، بیانگیزید", title_sv: "Skapa, inspirera", subtitle_fa: "کارگاه‌های هنری هفتگی", subtitle_sv: "Veckovisa konstworkshops", ctaText_fa: "مشاهده کارگاه‌ها", ctaText_sv: "Se workshops", ctaLink: "/topics/visual-arts", sortOrder: 1n },
  { id: 33006n, topicId: 31003n, imageUrl: img("slide-art-v-2", 1920, 800), title_fa: "نمایشگاه فارغ‌التحصیلان", title_sv: "Studentutställning", subtitle_fa: "آثار دانشجویان هارمونیا", subtitle_sv: "Harmonia-studenters verk", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/topics/visual-arts/watercolor-painting", sortOrder: 2n },
  { id: 33007n, topicId: 31004n, imageUrl: img("slide-dance-1", 1920, 800), title_fa: "در لحظه برقص", title_sv: "Dansa i ögonblicket", subtitle_fa: "کلاس‌های رقص برای تمام سنین", subtitle_sv: "Danskurser för alla åldrar", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/dance", sortOrder: 1n },
  { id: 33008n, topicId: 31004n, imageUrl: img("slide-dance-2", 1920, 800), title_fa: "ریتم‌های لاتین", title_sv: "Latinrytmer", subtitle_fa: "سالسا، باچاتا، چاچا", subtitle_sv: "Salsa, bachata, cha-cha", ctaText_fa: "کشف کنید", ctaText_sv: "Upptäck", ctaLink: "/topics/dance/latin-rhythms", sortOrder: 2n },
  { id: 33009n, topicId: 31005n, imageUrl: img("slide-comp-1", 1920, 800), title_fa: "موسیقی‌ای بسازید که دوام آورد", title_sv: "Skapa musik som varar", subtitle_fa: "ترانه‌سرایی و آهنگسازی", subtitle_sv: "Låtskrivning och komposition", ctaText_fa: "یاد بگیرید", ctaText_sv: "Lär dig", ctaLink: "/topics/composition", sortOrder: 1n },
  { id: 33010n, topicId: 31005n, imageUrl: img("slide-comp-2", 1920, 800), title_fa: "موسیقی الکترونیک", title_sv: "Elektronisk musik", subtitle_fa: "سینتسایزر و بیت‌سازی مدرن", subtitle_sv: "Synthesizer och modern beatmaking", ctaText_fa: "کارگاه", ctaText_sv: "Workshop", ctaLink: "/topics/composition/electronic-music", sortOrder: 2n },
];

// ─── About ────────────────────────────────────────────────────────────────────

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("harmonia-about", 1920, 600),
  body_fa: `<h2>درباره هارمونیا</h2><p>آکادمی هارمونیا یک مرکز هنری جامع است که به پرورش استعدادهای موسیقی، هنرهای بصری و رقص در محیطی الهام‌بخش و فراگیر اختصاص یافته است.</p><h3>رویکرد ما</h3><p>در هارمونیا، ما باور داریم که هنر زبان جهانی است. هر دانشجو را با استعداد منحصربه‌فردش می‌پذیریم و محیطی فراهم می‌کنیم که در آن خلاقیت شکوفا شود.</p><h3>دستاوردها</h3><p>فارغ‌التحصیلان ما در جشنواره‌های بین‌المللی جوایز کسب کرده‌اند و به ارکسترها، گروه‌های رقص و گالری‌های سراسر جهان پیوسته‌اند.</p>`,
  body_sv: `<h2>Om Harmonia</h2><p>Harmonia Academy är ett heltäckande konstnärligt centrum dedikerat till att odla talanger inom musik, visuell konst och dans i en inspirerande och inkluderande miljö.</p><h3>Vår approach</h3><p>På Harmonia tror vi att konst är ett universellt språk. Vi välkomnar varje elev med sina unika talanger och skapar en miljö där kreativitet blomstrar.</p><h3>Prestationer</h3><p>Våra alumni har vunnit priser på internationella festivaler och gått med i orkestrar, danssällskap och gallerier runt om i världen.</p>`,
};

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 34001n, name: "Isabelle Larsson", email: "isabelle.l@example.com", phone: "+46701234567", message: "Hej! Hur gammal behöver man vara för att börja med balett?", createdAt: ts(3) },
  { id: 34002n, name: "Oliver Magnusson", email: "oliver.m@example.com", phone: "+46709988776", message: "Finns det möjlighet att hyra övningsrum för pianospelning?", createdAt: ts(8) },
  { id: 34003n, name: "Frida Holm", email: "frida.h@example.com", phone: "+46703344556", message: "Erbjuder ni privatlektioner i akvarellmålning?", createdAt: ts(14) },
  { id: 34004n, name: "Daniel Nyström", email: "daniel.n@example.com", phone: "+46706655443", message: "Jag spelar gitarr, kan jag gå med i körens instrumentalsektion?", createdAt: ts(19) },
  { id: 34005n, name: "Emilia Strand", email: "emilia.s@example.com", phone: "+46708877665", message: "Vill gärna veta mer om koreografilabbet.", createdAt: ts(25) },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 35001n, platform: "instagram", url: "https://instagram.com/harmonia_academy", sortOrder: 1n },
  { id: 35002n, platform: "facebook", url: "https://facebook.com/harmoniaacademy", sortOrder: 2n },
  { id: 35003n, platform: "youtube", url: "https://youtube.com/@harmoniaacademy", sortOrder: 3n },
  { id: 35004n, platform: "website", url: "https://harmonia.se", sortOrder: 4n },
  { id: 35005n, platform: "email", url: "mailto:info@harmonia.se", sortOrder: 5n },
];

// ─── Registrations ────────────────────────────────────────────────────────────

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 36001n, activityId: 32001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Linn Johansson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "linn.j@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Har aldrig spelat piano förut, väldigt nervös men exalterad!" },
    ],
    createdAt: ts(2),
  },
  {
    id: 36002n, activityId: 32007n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Viktor Björk" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "viktor.b@example.com" },
      { fieldId: 3n, fieldLabel: "Meddelande / پیام", value: "Sjunger sedan gymnasiet, vill ta nästa steg." },
    ],
    createdAt: ts(5),
  },
  {
    id: 36003n, activityId: 32011n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Maja Lindgren" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "maja.l@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46701239999" },
      { fieldId: 4n, fieldLabel: "Erfarenhetsnivå / سطح تجربه", value: "Nybörjare" },
      { fieldId: 5n, fieldLabel: "Information / توضیحات", value: "Jag älskar naturmotiv och vill lära mig måla blommar." },
    ],
    createdAt: ts(7),
  },
  {
    id: 36004n, activityId: 32010n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Petra Ek" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "petra.e@example.com" },
      { fieldId: 3n, fieldLabel: "Rösttyp / نوع صدا", value: "Sopran" },
      { fieldId: 4n, fieldLabel: "Stycket / قطعه", value: "O mio babbino caro — Puccini" },
    ],
    createdAt: ts(10),
  },
  { id: 36005n, activityId: 32016n, name: "Sara Holmberg", email: "sara.h@example.com", phone: "+46705544332", message: "Min dotter är 8 år och drömmer om balett.", fieldValues: [], createdAt: ts(13) },
];

// ─── Form Templates ───────────────────────────────────────────────────────────

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 37001n, name_fa: "ثبت‌نام کلاس", name_sv: "Kursregistrering",
    description_fa: "فرم پایه برای ثبت‌نام در کلاس‌های آکادمی", description_sv: "Grundformulär för akademikursregistrering",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "textarea", label_fa: "پیام", label_sv: "Meddelande", placeholder_fa: "", placeholder_sv: "Berätta lite om dig och dina mål", required: false, options: [], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 37002n, name_fa: "ثبت‌نام کارگاه", name_sv: "Workshopregistrering",
    description_fa: "فرم کارگاه‌های عملی هنری", description_sv: "Formulär för praktiska konstworkshops",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "توضیحات", label_sv: "Information", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 37003n, name_fa: "ثبت‌نام آدیشن", name_sv: "Auditionregistrering",
    description_fa: "فرم برای آدیشن در گروه‌های هنری", description_sv: "Formulär för audition till konstgrupper",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "date", label_fa: "تاریخ تولد", label_sv: "Födelsedatum", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "حرفه‌ای", sv: "Professionell" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "قطعه آدیشن", label_sv: "Auditionstycke", placeholder_fa: "", placeholder_sv: "Beskriv vad du tänker framföra", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(90),
  },
];
