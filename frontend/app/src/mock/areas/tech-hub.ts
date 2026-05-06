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
  logoUrl: img("codespace-logo", 200, 200),
  title_fa: "کداسپیس",
  title_sv: "CodeSpace",
  subtitle_fa: "مرکز یادگیری برنامه‌نویسی و فناوری",
  subtitle_sv: "Inlärningscenter för programmering och teknik",
  landingBackgroundUrl: img("codespace-landing", 1920, 1080),
  topicsBackgroundUrl: img("codespace-topics", 1920, 1080),
  mockMode: true,
};

// ─── Topics ───────────────────────────────────────────────────────────────────

export const mockTopics: TopicReturn[] = [
  {
    id: 21001n, slug: "web-dev",
    title_fa: "توسعه وب", title_sv: "Webbutveckling",
    description_fa: "یادگیری HTML، CSS، JavaScript، React و Node.js از صفر تا پیشرفته",
    description_sv: "Lär dig HTML, CSS, JavaScript, React och Node.js från nybörjare till avancerad",
    icon: "Code2", backgroundUrl: img("webdev-bg", 1920, 1080),
    sortOrder: 1n, createdAt: ts(90),
  },
  {
    id: 21002n, slug: "data-science",
    title_fa: "علم داده و هوش مصنوعی", title_sv: "Datavetenskap och AI",
    description_fa: "پایتون، یادگیری ماشین، تجسم داده و مدل‌های زبانی بزرگ",
    description_sv: "Python, maskininlärning, datavisualisering och stora språkmodeller",
    icon: "BarChart2", backgroundUrl: img("datascience-bg", 1920, 1080),
    sortOrder: 2n, createdAt: ts(85),
  },
  {
    id: 21003n, slug: "mobile",
    title_fa: "توسعه اپلیکیشن موبایل", title_sv: "Mobilappsutveckling",
    description_fa: "ساخت اپلیکیشن‌های iOS و Android با React Native و Flutter",
    description_sv: "Bygg iOS- och Android-appar med React Native och Flutter",
    icon: "Smartphone", backgroundUrl: img("mobile-bg", 1920, 1080),
    sortOrder: 3n, createdAt: ts(80),
  },
  {
    id: 21004n, slug: "cloud-devops",
    title_fa: "ابر و دواپس", title_sv: "Cloud och DevOps",
    description_fa: "AWS، Docker، Kubernetes، CI/CD و زیرساخت به‌عنوان کد",
    description_sv: "AWS, Docker, Kubernetes, CI/CD och infrastruktur som kod",
    icon: "Cloud", backgroundUrl: img("devops-bg", 1920, 1080),
    sortOrder: 4n, createdAt: ts(75),
  },
  {
    id: 21005n, slug: "career",
    title_fa: "کارراهه و جامعه", title_sv: "Karriär och gemenskap",
    description_fa: "هکاتون‌ها، مرور رزومه، آماده‌سازی مصاحبه و رویدادهای شبکه‌سازی",
    description_sv: "Hackathons, CV-granskning, intervjuförberedelse och nätverksevenemang",
    icon: "Users", backgroundUrl: img("career-bg", 1920, 1080),
    sortOrder: 5n, createdAt: ts(70),
  },
];

// ─── Activities ───────────────────────────────────────────────────────────────

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>این دوره برای کسانی طراحی شده که می‌خواهند مهارت‌های فنی خود را ارتقا دهند. با راهنمایی مربیان مجرب و پروژه‌های عملی، آماده ورود به بازار کار خواهید شد.</p><p>از طریق فرم زیر ثبت‌نام کنید.</p>`,
  body_sv: `<h2>${sv}</h2><p>Denna kurs är utformad för dem som vill höja sina tekniska färdigheter. Med vägledning från erfarna instruktörer och praktiska projekt är du redo att träda in i arbetsmarknaden.</p><p>Registrera dig via formuläret nedan.</p>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // ── Web Dev ──
  {
    id: 22001n, topicId: 21001n, slug: "intro-to-react",
    title_fa: "مقدمه‌ای بر React", title_sv: "Introduktion till React",
    excerpt_fa: "ساخت رابط‌های کاربری مدرن با React و TypeScript",
    excerpt_sv: "Bygg moderna användargränssnitt med React och TypeScript",
    ...body("مقدمه‌ای بر React", "Introduktion till React"),
    formTemplateId: 27002n,
    icon: "Code2", imageUrl: img("react-course", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 22002n, topicId: 21001n, slug: "advanced-typescript",
    title_fa: "TypeScript پیشرفته", title_sv: "Avancerad TypeScript",
    excerpt_fa: "تایپ‌های جنریک، دکوراتورها و معماری مقیاس‌پذیر",
    excerpt_sv: "Generiska typer, dekoratörer och skalbar arkitektur",
    ...body("TypeScript پیشرفته", "Avancerad TypeScript"),
    formTemplateId: 27002n,
    icon: "FileCode", imageUrl: img("typescript-course", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 22003n, topicId: 21001n, slug: "fullstack-bootcamp",
    title_fa: "بوت‌کمپ فول‌استک", title_sv: "Full-stack bootcamp",
    excerpt_fa: "از ایده تا استقرار: Node.js + React + پایگاه داده",
    excerpt_sv: "Från idé till driftsättning: Node.js + React + databas",
    ...body("بوت‌کمپ فول‌استک", "Full-stack bootcamp"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "سطح برنامه‌نویسی", label_sv: "Programmeringsnivå", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj nivå", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "زبان برنامه‌نویسی اصلی", label_sv: "Primärt programmeringsspråk", placeholder_fa: "", placeholder_sv: "", required: false, options: [{ fa: "JavaScript", sv: "JavaScript" }, { fa: "Python", sv: "Python" }, { fa: "سایر", sv: "Annat" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "چرا این بوت‌کمپ را انتخاب کردید؟", label_sv: "Varför valde du denna bootcamp?", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    icon: "Server", imageUrl: img("fullstack-bootcamp", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 22004n, topicId: 21001n, slug: "ui-ux-design",
    title_fa: "طراحی UI/UX", title_sv: "UI/UX-design",
    excerpt_fa: "اصول طراحی کاربرپسند، Figma و پروتوتایپ‌سازی",
    excerpt_sv: "Principerna för användarvänlig design, Figma och prototypning",
    ...body("طراحی UI/UX", "UI/UX-design"),
    icon: "Layers", imageUrl: img("ui-ux-design", 800, 600),
    hasRegistration: false, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 22005n, topicId: 21001n, slug: "nodejs-workshop",
    title_fa: "کارگاه Node.js", title_sv: "Node.js-workshop",
    excerpt_fa: "ساخت API‌های RESTful و میکروسرویس‌ها با Node.js",
    excerpt_sv: "Bygg RESTful API:er och mikrotjänster med Node.js",
    ...body("کارگاه Node.js", "Node.js-workshop"),
    formTemplateId: 27002n,
    icon: "Globe", imageUrl: img("nodejs-workshop", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(40),
  },
  // ── Data Science ──
  {
    id: 22006n, topicId: 21002n, slug: "python-beginners",
    title_fa: "پایتون برای مبتدیان", title_sv: "Python för nybörjare",
    excerpt_fa: "مبانی برنامه‌نویسی با پایتون و کتابخانه‌های علم داده",
    excerpt_sv: "Programmeringsgrunder med Python och datavetenskapsbibliotek",
    ...body("پایتون برای مبتدیان", "Python för nybörjare"),
    formTemplateId: 27002n,
    icon: "Terminal", imageUrl: img("python-course", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 22007n, topicId: 21002n, slug: "ml-fundamentals",
    title_fa: "مبانی یادگیری ماشین", title_sv: "Grundläggande maskininlärning",
    excerpt_fa: "الگوریتم‌های کلاسیک، شبکه‌های عصبی و ارزیابی مدل",
    excerpt_sv: "Klassiska algoritmer, neurala nätverk och modellutvärdering",
    ...body("مبانی یادگیری ماشین", "Grundläggande maskininlärning"),
    formTemplateId: 27002n,
    icon: "BrainCircuit", imageUrl: img("ml-course", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 22008n, topicId: 21002n, slug: "data-visualization",
    title_fa: "تجسم داده", title_sv: "Datavisualisering",
    excerpt_fa: "داستان‌سرایی با داده با Matplotlib، Seaborn و Plotly",
    excerpt_sv: "Berättande med data med Matplotlib, Seaborn och Plotly",
    ...body("تجسم داده", "Datavisualisering"),
    icon: "BarChart2", imageUrl: img("data-viz", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 22009n, topicId: 21002n, slug: "intro-to-llms",
    title_fa: "مقدمه‌ای بر مدل‌های زبانی بزرگ", title_sv: "Introduktion till LLM:er",
    excerpt_fa: "کار با GPT، Claude، Llama و ساخت برنامه‌های هوش مصنوعی",
    excerpt_sv: "Arbeta med GPT, Claude, Llama och bygg AI-applikationer",
    ...body("مقدمه‌ای بر مدل‌های زبانی بزرگ", "Introduktion till LLM:er"),
    formTemplateId: 27002n,
    icon: "Sparkles", imageUrl: img("llm-course", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 22010n, topicId: 21002n, slug: "statistics-for-ds",
    title_fa: "آمار برای علم داده", title_sv: "Statistik för datavetenskap",
    excerpt_fa: "آمار استنباطی، آزمون فرضیه و تحلیل رگرسیون",
    excerpt_sv: "Inferensstatistik, hypotestestning och regressionsanalys",
    ...body("آمار برای علم داده", "Statistik för datavetenskap"),
    icon: "TrendingUp", imageUrl: img("statistics", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(38),
  },
  // ── Mobile ──
  {
    id: 22011n, topicId: 21003n, slug: "react-native-workshop",
    title_fa: "کارگاه React Native", title_sv: "React Native-workshop",
    excerpt_fa: "ساخت اپلیکیشن‌های کراس‌پلتفرم با React Native و Expo",
    excerpt_sv: "Bygg plattformsoberoende appar med React Native och Expo",
    ...body("کارگاه React Native", "React Native-workshop"),
    formTemplateId: 27002n,
    icon: "Smartphone", imageUrl: img("react-native", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 22012n, topicId: 21003n, slug: "flutter-basics",
    title_fa: "مبانی Flutter", title_sv: "Flutter-grunder",
    excerpt_fa: "توسعه اپلیکیشن موبایل با Flutter و Dart",
    excerpt_sv: "Mobilappsutveckling med Flutter och Dart",
    ...body("مبانی Flutter", "Flutter-grunder"),
    icon: "Layout", imageUrl: img("flutter-course", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 22013n, topicId: 21003n, slug: "app-design-patterns",
    title_fa: "الگوهای طراحی اپلیکیشن", title_sv: "Appdesignmönster",
    excerpt_fa: "MVC، MVVM و Clean Architecture در توسعه موبایل",
    excerpt_sv: "MVC, MVVM och Clean Architecture i mobilutveckling",
    ...body("الگوهای طراحی اپلیکیشن", "Appdesignmönster"),
    icon: "GitBranch", imageUrl: img("design-patterns", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 22014n, topicId: 21003n, slug: "ios-swift-intro",
    title_fa: "مقدمه‌ای بر iOS Swift", title_sv: "Introduktion till iOS Swift",
    excerpt_fa: "ساخت اپلیکیشن‌های iOS بومی با Swift و SwiftUI",
    excerpt_sv: "Bygg native iOS-appar med Swift och SwiftUI",
    ...body("مقدمه‌ای بر iOS Swift", "Introduktion till iOS Swift"),
    formTemplateId: 27002n,
    icon: "Apple", imageUrl: img("swift-course", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 22015n, topicId: 21003n, slug: "publishing-to-stores",
    title_fa: "انتشار در فروشگاه‌های اپ", title_sv: "Publicering i appbutiker",
    excerpt_fa: "راهنمای گام‌به‌گام انتشار در App Store و Google Play",
    excerpt_sv: "Steg-för-steg-guide för publicering i App Store och Google Play",
    ...body("انتشار در فروشگاه‌های اپ", "Publicering i appbutiker"),
    icon: "Upload", imageUrl: img("app-publish", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(36),
  },
  // ── Cloud & DevOps ──
  {
    id: 22016n, topicId: 21004n, slug: "aws-essentials",
    title_fa: "اصول AWS", title_sv: "AWS-grunder",
    excerpt_fa: "EC2، S3، Lambda و معماری ابری برای توسعه‌دهندگان",
    excerpt_sv: "EC2, S3, Lambda och molnarkitektur för utvecklare",
    ...body("اصول AWS", "AWS-grunder"),
    formTemplateId: 27002n,
    icon: "Cloud", imageUrl: img("aws-course", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 22017n, topicId: 21004n, slug: "docker-kubernetes",
    title_fa: "Docker و Kubernetes", title_sv: "Docker och Kubernetes",
    excerpt_fa: "کانتینرسازی و ارکستراسیون برنامه‌های مدرن",
    excerpt_sv: "Containerisering och orkestrering av moderna applikationer",
    ...body("Docker و Kubernetes", "Docker och Kubernetes"),
    formTemplateId: 27002n,
    icon: "Box", imageUrl: img("docker-k8s", 800, 600),
    hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 22018n, topicId: 21004n, slug: "cicd-pipelines",
    title_fa: "خطوط لوله CI/CD", title_sv: "CI/CD-pipelines",
    excerpt_fa: "یکپارچه‌سازی و استقرار مستمر با GitHub Actions و GitLab CI",
    excerpt_sv: "Kontinuerlig integration och leverans med GitHub Actions och GitLab CI",
    ...body("خطوط لوله CI/CD", "CI/CD-pipelines"),
    icon: "GitMerge", imageUrl: img("cicd", 800, 600),
    hasRegistration: false, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 22019n, topicId: 21004n, slug: "infrastructure-as-code",
    title_fa: "زیرساخت به‌عنوان کد", title_sv: "Infrastruktur som kod",
    excerpt_fa: "مدیریت زیرساخت با Terraform و Pulumi",
    excerpt_sv: "Hantera infrastruktur med Terraform och Pulumi",
    ...body("زیرساخت به‌عنوان کد", "Infrastruktur som kod"),
    formTemplateId: 27002n,
    icon: "Settings2", imageUrl: img("iac-course", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 22020n, topicId: 21004n, slug: "cloud-security",
    title_fa: "امنیت در ابر", title_sv: "Molnsäkerhet",
    excerpt_fa: "بهترین شیوه‌های امنیتی برای محیط‌های ابری",
    excerpt_sv: "Bästa säkerhetspraxis för molnmiljöer",
    ...body("امنیت در ابر", "Molnsäkerhet"),
    icon: "Shield", imageUrl: img("cloud-security", 800, 600),
    hasRegistration: false, sortOrder: 5n, createdAt: ts(34),
  },
  // ── Career ──
  {
    id: 22021n, topicId: 21005n, slug: "hackathon",
    title_fa: "هکاتون ۴۸ ساعته", title_sv: "48-timmars hackathon",
    excerpt_fa: "رقابت کدنویسی دو روزه با جوایز ارزشمند و همکاری تیمی",
    excerpt_sv: "Tvådagars kodtävling med värdefulla priser och teamsamarbete",
    ...body("هکاتون ۴۸ ساعته", "48-timmars hackathon"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "شرکت می‌کنید به‌عنوان", label_sv: "Du deltar som", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "تیم (تا ۴ نفر)", sv: "Team (upp till 4 pers)" }, { fa: "فردی", sv: "Individ" }], sortOrder: 3n },
      { id: 4n, fieldType: "text", label_fa: "نام تیم (اختیاری)", label_sv: "Teamnamn (valfritt)", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 4n },
      { id: 5n, fieldType: "select", label_fa: "سطح تجربه", label_sv: "Erfarenhetsnivå", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 5n },
    ],
    icon: "Zap", imageUrl: img("hackathon", 800, 600),
    hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 22022n, topicId: 21005n, slug: "tech-talks",
    title_fa: "سخنرانی‌های فناوری", title_sv: "Tech talks",
    excerpt_fa: "سخنرانی‌های ماهانه توسط مهندسان ارشد و مدیران فناوری",
    excerpt_sv: "Månadsföreläsningar av seniora ingenjörer och teknologichefer",
    ...body("سخنرانی‌های فناوری", "Tech talks"),
    icon: "Mic", imageUrl: img("tech-talks", 800, 600),
    hasRegistration: false, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 22023n, topicId: 21005n, slug: "portfolio-review",
    title_fa: "بررسی پورتفولیو", title_sv: "Portföljgranskning",
    excerpt_fa: "بازخورد حرفه‌ای از توسعه‌دهندگان ارشد برای بهبود پورتفولیو",
    excerpt_sv: "Professionell feedback från seniora utvecklare för att förbättra din portfölj",
    ...body("بررسی پورتفولیو", "Portföljgranskning"),
    formTemplateId: 27001n,
    icon: "FolderOpen", imageUrl: img("portfolio-review", 800, 600),
    hasRegistration: true, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 22024n, topicId: 21005n, slug: "interview-prep",
    title_fa: "آمادگی مصاحبه", title_sv: "Intervjuförberedelse",
    excerpt_fa: "تمرین سوالات الگوریتمی، مصاحبه سیستم‌طراحی و مهارت‌های نرم",
    excerpt_sv: "Öva algoritmfrågor, systemdesignintervjuer och mjuka färdigheter",
    ...body("آمادگی مصاحبه", "Intervjuförberedelse"),
    formTemplateId: 27001n,
    icon: "MessageSquare", imageUrl: img("interview-prep", 800, 600),
    hasRegistration: true, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 22025n, topicId: 21005n, slug: "networking-mixer",
    title_fa: "رویداد شبکه‌سازی", title_sv: "Nätverksevenemang",
    excerpt_fa: "ملاقات با توسعه‌دهندگان، استارتاپ‌ها و کارفرمایان محلی",
    excerpt_sv: "Träffa utvecklare, startups och lokala arbetsgivare",
    ...body("رویداد شبکه‌سازی", "Nätverksevenemang"),
    icon: "Network", imageUrl: img("networking", 800, 600),
    hasRegistration: true, sortOrder: 5n, createdAt: ts(32),
  },
];

// ─── Hero Slides ──────────────────────────────────────────────────────────────

export const mockSlides: HeroSlideReturn[] = [
  { id: 23001n, topicId: 21001n, imageUrl: img("slide-webdev-1", 1920, 800), title_fa: "وب را بسازید", title_sv: "Bygg webben", subtitle_fa: "از صفر تا استقرار — مهارت‌های واقعی", subtitle_sv: "Från noll till driftsättning — verkliga färdigheter", ctaText_fa: "شروع یادگیری", ctaText_sv: "Börja lära", ctaLink: "/topics/web-dev", sortOrder: 1n },
  { id: 23002n, topicId: 21001n, imageUrl: img("slide-webdev-2", 1920, 800), title_fa: "بوت‌کمپ فول‌استک", title_sv: "Full-stack bootcamp", subtitle_fa: "۱۲ هفته — آماده برای کار", subtitle_sv: "12 veckor — arbetsredo", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/web-dev/fullstack-bootcamp", sortOrder: 2n },
  { id: 23003n, topicId: 21002n, imageUrl: img("slide-ds-1", 1920, 800), title_fa: "داده = قدرت", title_sv: "Data = kraft", subtitle_fa: "یادگیری ماشین و هوش مصنوعی از پایه", subtitle_sv: "Maskininlärning och AI från grunden", ctaText_fa: "کشف کنید", ctaText_sv: "Utforska", ctaLink: "/topics/data-science", sortOrder: 1n },
  { id: 23004n, topicId: 21002n, imageUrl: img("slide-ds-2", 1920, 800), title_fa: "مدل‌های زبانی بزرگ", title_sv: "Stora språkmodeller", subtitle_fa: "بسازید با GPT، Claude و Llama", subtitle_sv: "Bygg med GPT, Claude och Llama", ctaText_fa: "ثبت‌نام در دوره", ctaText_sv: "Anmäl dig till kursen", ctaLink: "/topics/data-science/intro-to-llms", sortOrder: 2n },
  { id: 23005n, topicId: 21003n, imageUrl: img("slide-mobile-1", 1920, 800), title_fa: "اپ بسازید", title_sv: "Bygg en app", subtitle_fa: "iOS و Android از یک پایگاه کد", subtitle_sv: "iOS och Android från en kodbas", ctaText_fa: "یاد بگیرید", ctaText_sv: "Lär dig", ctaLink: "/topics/mobile", sortOrder: 1n },
  { id: 23006n, topicId: 21003n, imageUrl: img("slide-mobile-2", 1920, 800), title_fa: "کارگاه React Native", title_sv: "React Native-workshop", subtitle_fa: "آخر هفته — پروژه‌محور", subtitle_sv: "Helg — projektbaserad", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/mobile/react-native-workshop", sortOrder: 2n },
  { id: 23007n, topicId: 21004n, imageUrl: img("slide-devops-1", 1920, 800), title_fa: "ابر را مسلط شوید", title_sv: "Bemästra molnet", subtitle_fa: "AWS، Docker، Kubernetes برای توسعه‌دهندگان", subtitle_sv: "AWS, Docker, Kubernetes för utvecklare", ctaText_fa: "شروع کنید", ctaText_sv: "Kom igång", ctaLink: "/topics/cloud-devops", sortOrder: 1n },
  { id: 23008n, topicId: 21004n, imageUrl: img("slide-devops-2", 1920, 800), title_fa: "اصول AWS", title_sv: "AWS-grunder", subtitle_fa: "گواهینامه‌ای که کارفرمایان می‌خواهند", subtitle_sv: "Certifieringen arbetsgivare vill ha", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/cloud-devops/aws-essentials", sortOrder: 2n },
  { id: 23009n, topicId: 21005n, imageUrl: img("slide-career-1", 1920, 800), title_fa: "هکاتون ۴۸ ساعته", title_sv: "48-timmars hackathon", subtitle_fa: "کد بزنید — همکاری کنید — برنده شوید", subtitle_sv: "Koda — samarbeta — vinn", ctaText_fa: "ثبت تیم", ctaText_sv: "Registrera team", ctaLink: "/topics/career/hackathon", sortOrder: 1n },
  { id: 23010n, topicId: 21005n, imageUrl: img("slide-career-2", 1920, 800), title_fa: "کار رویایی‌تان را پیدا کنید", title_sv: "Hitta ditt drömjobb", subtitle_fa: "آمادگی مصاحبه با مربیان ارشد", subtitle_sv: "Intervjuförberedelse med seniora mentorer", ctaText_fa: "بیشتر بدانید", ctaText_sv: "Läs mer", ctaLink: "/topics/career/interview-prep", sortOrder: 2n },
];

// ─── About ────────────────────────────────────────────────────────────────────

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("codespace-about", 1920, 600),
  body_fa: `<h2>درباره CodeSpace</h2><p>CodeSpace یک مرکز یادگیری فناوری است که با هدف دموکراتیزه کردن دسترسی به آموزش برنامه‌نویسی و فناوری تأسیس شده است.</p><h3>مأموریت ما</h3><p>ما باور داریم که هر کسی می‌تواند برنامه‌نویسی بیاموزد. برنامه‌های درسی عملی ما توسط مهندسان ارشد صنعت طراحی شده‌اند تا اطمینان حاصل شود که دانش‌آموزان مهارت‌های مورد نیاز بازار کار را کسب می‌کنند.</p><h3>جامعه ما</h3><p>CodeSpace فقط یک مدرسه نیست — بلکه یک جامعه پویا از توسعه‌دهندگان، طراحان و علاقه‌مندان به فناوری است که با هم رشد می‌کنند.</p>`,
  body_sv: `<h2>Om CodeSpace</h2><p>CodeSpace är ett teknologiinlärningscenter grundat för att demokratisera tillgången till programmerings- och teknikutbildning.</p><h3>Vårt uppdrag</h3><p>Vi tror att vem som helst kan lära sig programmera. Våra praktiska läroplaner är utformade av seniora industringenjörer för att säkerställa att elever förvärvar de färdigheter som arbetsmarknaden kräver.</p><h3>Vår gemenskap</h3><p>CodeSpace är inte bara en skola — det är ett livfullt community av utvecklare, designers och teknikentusiaster som växer tillsammans.</p>`,
};

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 24001n, name: "Marcus Lindgren", email: "marcus.l@example.com", phone: "+46701234567", message: "Hej! Jag är intresserad av bootcampen i full-stack. Kan jag få mer info?", createdAt: ts(3) },
  { id: 24002n, name: "Layla Hassan", email: "layla.h@example.com", phone: "+46709988776", message: "آیا این دوره‌ها به‌صورت آنلاین هم ارائه می‌شوند؟", createdAt: ts(8) },
  { id: 24003n, name: "Björn Svensson", email: "bjorn.s@example.com", phone: "+46703344556", message: "Erbjuder ni rabatt för studenter?", createdAt: ts(14) },
  { id: 24004n, name: "Aisha Mohammadi", email: "aisha.m@example.com", phone: "+46706655443", message: "چه مدت طول می‌کشد تا پس از این بوت‌کمپ بتوانم کار پیدا کنم؟", createdAt: ts(20) },
  { id: 24005n, name: "Erik Bergström", email: "erik.b@example.com", phone: "+46708877665", message: "Vill anmäla mitt företag som sponsor till hackathon.", createdAt: ts(28) },
];

// ─── Social Links ─────────────────────────────────────────────────────────────

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 25001n, platform: "instagram", url: "https://instagram.com/codespace_tech", sortOrder: 1n },
  { id: 25002n, platform: "github", url: "https://github.com/codespace-hub", sortOrder: 2n },
  { id: 25003n, platform: "youtube", url: "https://youtube.com/@codespace", sortOrder: 3n },
  { id: 25004n, platform: "website", url: "https://codespace.tech", sortOrder: 4n },
  { id: 25005n, platform: "email", url: "mailto:learn@codespace.tech", sortOrder: 5n },
];

// ─── Registrations ────────────────────────────────────────────────────────────

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 26001n, activityId: 22001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Johan Pettersson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "johan.p@example.com" },
      { fieldId: 3n, fieldLabel: "Telefon / تلفن", value: "+46701112223" },
      { fieldId: 4n, fieldLabel: "Programmeringsnivå / سطح برنامه‌نویسی", value: "Nybörjare" },
      { fieldId: 5n, fieldLabel: "Information / توضیحات", value: "Vill byta karriär till webbutveckling." },
    ],
    createdAt: ts(2),
  },
  {
    id: 26002n, activityId: 22003n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Nora Eklund" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "nora.e@example.com" },
      { fieldId: 3n, fieldLabel: "Programmeringsnivå", value: "Medel" },
      { fieldId: 4n, fieldLabel: "Primärt språk", value: "JavaScript" },
      { fieldId: 5n, fieldLabel: "Varför bootcamp?", value: "Vill lära mig hela stacken." },
    ],
    createdAt: ts(5),
  },
  {
    id: 26003n, activityId: 22021n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Ahmed Karimi" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "ahmed.k@example.com" },
      { fieldId: 3n, fieldLabel: "Deltar som", value: "Team (upp till 4 pers)" },
      { fieldId: 4n, fieldLabel: "Teamnamn", value: "ByteForce" },
      { fieldId: 5n, fieldLabel: "Erfarenhetsnivå", value: "Avancerad" },
    ],
    createdAt: ts(7),
  },
  { id: 26004n, activityId: 22023n, name: "Sara Lindqvist", email: "sara.lq@example.com", phone: "+46705544332", message: "Vill ha feedback på mitt GitHub-projekt.", fieldValues: [], createdAt: ts(10) },
  { id: 26005n, activityId: 22024n, name: "Khalid Rahimi", email: "khalid.r@example.com", phone: "+46704433221", message: "آماده مصاحبه با شرکت‌های بزرگ می‌شوم.", fieldValues: [], createdAt: ts(14) },
];

// ─── Form Templates ───────────────────────────────────────────────────────────

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 27001n, name_fa: "ثبت‌نام پایه", name_sv: "Grundregistrering",
    description_fa: "فرم ساده با نام، ایمیل و پیام", description_sv: "Enkelt formulär med namn, e-post och meddelande",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "textarea", label_fa: "پیام", label_sv: "Meddelande", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 27002n, name_fa: "ثبت‌نام دوره", name_sv: "Kursregistrering",
    description_fa: "فرم برای ثبت‌نام در دوره‌های فنی", description_sv: "Formulär för tekniska kursregistreringar",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "phone", label_fa: "تلفن", label_sv: "Telefon", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح برنامه‌نویسی", label_sv: "Programmeringsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "توضیحات", label_sv: "Information", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 27003n, name_fa: "ثبت‌نام هکاتون", name_sv: "Hackathonregistrering",
    description_fa: "فرم ثبت‌نام تیم یا فردی در هکاتون", description_sv: "Team- eller individuell hackathonregistrering",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "text", label_fa: "نام تیم", label_sv: "Teamnamn", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "سطح", label_sv: "Nivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 4n },
      { id: 5n, fieldType: "checkbox", label_fa: "قوانین هکاتون را می‌پذیرم", label_sv: "Jag accepterar hackathonreglerna", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 5n },
    ],
    createdAt: ts(90),
  },
];
