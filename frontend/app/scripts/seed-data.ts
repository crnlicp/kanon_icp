// Seed data for "Jasmin Blomman Kultur & Idrott förening" / کانون فرهنگی گل یاس
// All bilingual content (SV/FA). Edit values here, then run `npm run seed`.

export const PICSUM = (seed: string, w = 1600, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const settings = {
  logoUrl: PICSUM("kanon-logo", 256, 256),
  title_fa: "کانون فرهنگی گل یاس",
  title_sv: "Jasmine Blomman Kultur & Idrott förening",
  subtitle_fa: "خانه‌ای برای فرهنگ، آموزش، ورزش و فعالیت‌های اجتماعی خانواده‌های ایرانی-سوئدی",
  subtitle_sv:
    "Ett hem för kultur, utbildning, idrott och sociala aktiviteter för iransk-svenska familjer",
  landingBackgroundUrl: PICSUM("kanon-landing", 1920, 1080),
  topicsBackgroundUrl: PICSUM("kanon-topics", 1920, 1080),
  contactIntro_fa: `
<p>برای ارتباط با کانون فرهنگی گل یاس از راه‌های زیر استفاده کنید:</p>
<ul>
  <li><strong>تلفن:</strong> <a href="tel:+46765654005">+46 76 565 40 05</a></li>
  <li><strong>ایمیل:</strong> <a href="mailto:jasmin.blomman14@gmail.com">jasmin.blomman14@gmail.com</a></li>
  <li><strong>ادمین تلگرام:</strong> <a href="https://t.me/Jasmin_adm" target="_blank" rel="noopener">@Jasmin_adm</a></li>
  <li><strong>امور مالی و کارت:</strong> <a href="https://t.me/kvitton" target="_blank" rel="noopener">@kvitton</a></li>
</ul>
<p>پیشنهادات، انتقادات و درخواست همکاری شما همیشه مورد استقبال است.</p>
`.trim(),
  contactIntro_sv: `
<p>Kontakta Jasmine Blomman Kultur & Idrott förening via något av följande sätt:</p>
<ul>
  <li><strong>Telefon:</strong> <a href="tel:+46765654005">+46 76 565 40 05</a></li>
  <li><strong>E-post:</strong> <a href="mailto:jasmin.blomman14@gmail.com">jasmin.blomman14@gmail.com</a></li>
  <li><strong>Telegram-admin:</strong> <a href="https://t.me/Jasmin_adm" target="_blank" rel="noopener">@Jasmin_adm</a></li>
  <li><strong>Ekonomi & kvitton:</strong> <a href="https://t.me/kvitton" target="_blank" rel="noopener">@kvitton</a></li>
</ul>
<p>Förslag, frågor och samarbetsförfrågningar är alltid välkomna.</p>
`.trim(),
};

export const aboutContent = {
  headerImageUrl: PICSUM("about-header", 1920, 720),
  body_fa: `
<h1>بسمه تعالی</h1>
<p>کانون فرهنگی گل یاس (Jasmin Blomman kultur & idrott förening) در تاریخ ۷ نوامبر ۲۰۱۹ (۱۶ آبان ۱۳۹۸) در شهر گوتنبرگ سوئد تأسیس شده است. این کانون از افراد علاقه‌مند برای عضویت و حضور در برنامه‌ها و مراسم دعوت به عمل آورده است. در حال حاضر این کانون با تکیه بر کمک مالی ماهانه‌ی اعضا در حال توسعه و فعالیت می‌باشد.</p>

<h2>اهداف</h2>
<ul>
  <li>ترویج فرهنگ ایرانی، افغانستانی و سوئدی.</li>
  <li>حذف آداب و رسوم غلط از زندگی افراد با توجه به فرهنگ سوئد.</li>
  <li>تقویت کانون گرم خانواده‌ها و روابط خانوادگی و ایجاد راهکارهایی برای شاد زیستن خانواده‌ها و احساس لذت از زندگی.</li>
  <li>ترغیب جوانان به تنها نبودن و در جمع بودن.</li>
  <li>آموزش شیوه‌ی صحیح تربیت کودکان با توجه به مسائل روز کشور سوئد.</li>
  <li>آموزش چگونگی تعامل نسل قدیم و نسل جوان برای بهتر زیستن افراد.</li>
  <li>ترویج روابط اقوام و تقویت روابط اجتماعی افراد.</li>
  <li>آموزش کار گروهی و تقویت روحیه‌ی گروه‌گرایی در افراد.</li>
  <li>ارتقاء سطح آگاهی افراد، ترغیب افراد به کتاب‌خوانی و امر پژوهش.</li>
</ul>

<h2>برنامه‌ها</h2>
<ul>
  <li>اجرای مراسم‌های فرهنگی پارسی‌زبانان و کشور سوئد، اجرای مراسم مناسبتی اسلامی، مسیحی و سوئدی، برگزاری برنامه‌های شاد برای خانواده‌ها جهت دوستیابی و برقراری ارتباط خانواده‌ها و به‌خصوص فرزندان آن‌ها با یکدیگر، تبادل تجربیات والدین در زمینه‌ی تربیت فرزندان در محیط سوئد، و اجرای کلاس‌های آموزشی به صورت ترمی که در طول سال توسط اعضا برگزار می‌گردد.</li>
  <li>ایجاد برنامه‌های ورزشی شامل رزرو سالن‌های ورزشی و استخر به صورت اختصاصی، برای استفاده‌ی راحت از امکانات ورزشی و تفریحی توسط آقایان و بانوان.</li>
  <li>ایجاد کتابخانه جهت دسترسی به کتب فرهنگی-مذهبی به زبان فارسی و همچنین ترغیب فرهنگ کتاب‌خوانی.</li>
</ul>
`.trim(),
  body_sv: `
<h1>I Guds namn</h1>
<p>Jasmin Blomman kultur & idrott förening (کانون فرهنگی گل یاس) grundades den 7 november 2019 i Göteborg, Sverige. Föreningen bjuder in intresserade att bli medlemmar och delta i våra program och ceremonier. Verksamheten drivs och utvecklas i dagsläget med stöd av medlemmarnas månatliga bidrag.</p>

<h2>Mål</h2>
<ul>
  <li>Att främja iransk, afghansk och svensk kultur.</li>
  <li>Att lägga felaktiga vanor åt sidan i mötet med svensk kultur.</li>
  <li>Att stärka det varma familjebandet och familjerelationerna, samt erbjuda verktyg för ett gladare och mer meningsfullt familjeliv.</li>
  <li>Att uppmuntra ungdomar att inte isolera sig utan vara en del av en gemenskap.</li>
  <li>Att lära ut goda metoder för barnuppfostran anpassade till livet i dagens Sverige.</li>
  <li>Att visa hur den äldre och den yngre generationen kan samverka för ett bättre liv.</li>
  <li>Att främja släktbanden och stärka individens sociala relationer.</li>
  <li>Att lära ut grupparbete och bygga upp en känsla av gemenskap.</li>
  <li>Att höja medlemmarnas kunskapsnivå och uppmuntra läsande och forskning.</li>
</ul>

<h2>Program</h2>
<ul>
  <li>Persiska och svenska kulturella ceremonier, islamiska, kristna och svenska högtidsfiranden, glada familjeprogram för att skapa vänskap mellan familjer — och i synnerhet mellan deras barn — utbyte av föräldraerfarenheter kring att uppfostra barn i Sverige, samt terminsbaserade kurser som hålls av medlemmarna under året.</li>
  <li>Idrottsprogram, inklusive bokning av idrottshallar och simbassänger på exklusiva tider, så att män och kvinnor bekvämt kan använda anläggningarna.</li>
  <li>Ett bibliotek med kulturella och religiösa böcker på persiska, samt arbete för att uppmuntra läsande som kultur.</li>
</ul>
`.trim(),
};

export const socialLinks = [
  { platform: "instagram", url: "https://www.instagram.com/kanon.goleyaas/" },
  { platform: "telegram", url: "https://t.me/yaas14" },
  { platform: "email", url: "mailto:jasmin.blomman14@gmail.com" },
];

// Basic registration form template (Education / Sport / Art & Media).
export const basicFormTemplate = {
  name_fa: "فرم ثبت‌نام پایه",
  name_sv: "Grundläggande registreringsformulär",
  description_fa: "فرم استاندارد برای ثبت‌نام در دوره‌ها و فعالیت‌های کانون",
  description_sv: "Standardformulär för registrering till kurser och aktiviteter",
  fields: [
    {
      fieldType: "text",
      label_fa: "نام و نام خانوادگی",
      label_sv: "För- och efternamn",
      placeholder_fa: "نام کامل خود را وارد کنید",
      placeholder_sv: "Ange ditt fullständiga namn",
      required: true,
      isLookupField: false,
      options: [] as { fa: string; sv: string }[],
    },
    {
      fieldType: "phone",
      label_fa: "شماره تلفن",
      label_sv: "Telefonnummer",
      placeholder_fa: "+46 ...",
      placeholder_sv: "+46 ...",
      required: true,
      isLookupField: true,
      options: [],
    },
    {
      fieldType: "email",
      label_fa: "ایمیل",
      label_sv: "E-post",
      placeholder_fa: "example@email.com",
      placeholder_sv: "example@email.com",
      required: true,
      isLookupField: false,
      options: [],
    },
    {
      fieldType: "number",
      label_fa: "سن شرکت‌کننده",
      label_sv: "Deltagarens ålder",
      placeholder_fa: "",
      placeholder_sv: "",
      required: false,
      isLookupField: false,
      options: [],
      minValue: 1,
      maxValue: 120,
    },
    {
      fieldType: "textarea",
      label_fa: "توضیحات اضافی",
      label_sv: "Övriga kommentarer",
      placeholder_fa: "در صورت نیاز توضیح دهید",
      placeholder_sv: "Skriv om du har övriga kommentarer",
      required: false,
      isLookupField: false,
      options: [],
    },
  ],
};

export type SeedSlide = {
  imageUrl: string;
  title_fa: string;
  title_sv: string;
  subtitle_fa: string;
  subtitle_sv: string;
  ctaText_fa: string;
  ctaText_sv: string;
  ctaLink: string;
};

export type SeedEvent = {
  slug: string;
  title_fa: string;
  title_sv: string;
  excerpt_fa: string;
  excerpt_sv: string;
  body_fa: string;
  body_sv: string;
  icon: string;
  imageUrl: string;
  highlighted?: boolean;
};

export type SeedTopic = {
  slug: string;
  title_fa: string;
  title_sv: string;
  description_fa: string;
  description_sv: string;
  icon: string;
  backgroundUrl: string;
  registration: "none" | "form";
  slides: SeedSlide[];
  events: SeedEvent[];
};

export const topics: SeedTopic[] = [
  // ---------- CULTURE ----------
  {
    slug: "culture",
    title_fa: "فرهنگ",
    title_sv: "Kultur",
    description_fa:
      "گرامیداشت مناسبت‌های فرهنگی و مذهبی ایرانی در سوئد؛ از شب یلدا و نوروز تا مراسم محرم و شب‌های قدر. فضایی برای حفظ هویت، انتقال میراث به نسل جوان و آشنایی جامعه‌ی میزبان با فرهنگ غنی ایرانی.",
    description_sv:
      "Vi firar och uppmärksammar persiska och religiösa kulturella högtider i Sverige — från Yalda och Nouruz till Muharram och Ghadr-nätterna. En plats för att bevara identitet, föra arvet vidare till nästa generation och dela vår rika kultur med det svenska samhället.",
    icon: "Sparkles",
    backgroundUrl: PICSUM("culture-bg", 1920, 1080),
    registration: "none",
    slides: [
      {
        imageUrl: PICSUM("culture-slide-1"),
        title_fa: "میراث، در قلب اروپا",
        title_sv: "Arvet — mitt i Europa",
        subtitle_fa: "گرامیداشت مناسبت‌های ایرانی در کنار خانواده",
        subtitle_sv: "Fira persiska högtider tillsammans med familjen",
        ctaText_fa: "برنامه‌ها",
        ctaText_sv: "Se program",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("culture-slide-2"),
        title_fa: "شب‌های به‌یادماندنی",
        title_sv: "Kvällar att minnas",
        subtitle_fa: "یلدا، نوروز و مناسبت‌های مذهبی",
        subtitle_sv: "Yalda, Nouruz och religiösa högtider",
        ctaText_fa: "اطلاعات بیشتر",
        ctaText_sv: "Läs mer",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("culture-slide-3"),
        title_fa: "هویت و همبستگی",
        title_sv: "Identitet och gemenskap",
        subtitle_fa: "از نسل امروز برای نسل فردا",
        subtitle_sv: "Från dagens generation till nästa",
        ctaText_fa: "همراه ما شوید",
        ctaText_sv: "Var med oss",
        ctaLink: "#events",
      },
    ],
    events: [
      {
        slug: "muharram",
        title_fa: "ایام محرم (۱۰ شب)",
        title_sv: "Muharram (10 kvällar)",
        excerpt_fa: "ده شب مراسم سوگواری، سخنرانی و عزاداری به مناسبت محرم.",
        excerpt_sv: "Tio kvällar av sorgehögtid, föreläsningar och ceremonier under Muharram.",
        body_fa:
          "<p>هر شب از روز اول تا دهم محرم با برنامه‌ای ویژه شامل سخنرانی، روضه‌خوانی و پذیرایی در محل کانون برگزار می‌شود. زمان و مکان دقیق هر شب در اطلاعیه‌ها اعلام خواهد شد.</p>",
        body_sv:
          "<p>Varje kväll från första till tionde Muharram hålls ett program med föreläsning, ceremoni och servering i föreningens lokaler. Exakta tider och platser meddelas inför varje kväll.</p>",
        icon: "Moon",
        imageUrl: PICSUM("event-muharram"),
        highlighted: true,
      },
      {
        slug: "yalda",
        title_fa: "شب یلدا",
        title_sv: "Yalda-natten",
        excerpt_fa: "گرامیداشت بلندترین شب سال با شعر حافظ، هندوانه و انار.",
        excerpt_sv: "Vi firar årets längsta natt med Hafez-poesi, vattenmelon och granatäpple.",
        body_fa:
          "<p>برنامه‌ای خانوادگی شامل شعرخوانی، موسیقی، بازی، شام و سفره‌ی سنتی یلدا. مناسب همه‌ی سنین.</p>",
        body_sv:
          "<p>Ett familjeprogram med poesi, musik, lekar, middag och en traditionell Yalda-duk. Passar alla åldrar.</p>",
        icon: "Moon",
        imageUrl: PICSUM("event-yalda"),
      },
      {
        slug: "nowruz",
        title_fa: "نوروز (سال نو ایرانی)",
        title_sv: "Nouruz (persiska nyåret)",
        excerpt_fa: "جشن سال نو با سفره‌ی هفت‌سین، موسیقی زنده و برنامه‌ی کودکان.",
        excerpt_sv: "Nyårsfest med Haft-Sin-duk, livemusik och barnprogram.",
        body_fa:
          "<p>تحویل سال نو، برنامه‌ی فرهنگی، پذیرایی و سرگرمی برای کودکان و بزرگ‌سالان در فضایی شاد و خانوادگی.</p>",
        body_sv:
          "<p>Nyårsväxlingen, kulturprogram, servering och underhållning för barn och vuxna i en glad och familjevänlig miljö.</p>",
        icon: "Flower2",
        imageUrl: PICSUM("event-nowruz"),
        highlighted: true,
      },
      {
        slug: "ghadr-nights",
        title_fa: "شب‌های قدر (ماه رمضان)",
        title_sv: "Ghadr-nätterna (Ramadan)",
        excerpt_fa: "احیای شب‌های نوزدهم، بیست‌ویکم و بیست‌وسوم ماه رمضان.",
        excerpt_sv: "Vaknätter den 19:e, 21:a och 23:e Ramadan.",
        body_fa:
          "<p>برنامه‌ی احیای شب‌های قدر شامل دعا، سخنرانی و افطاری در محل کانون.</p>",
        body_sv:
          "<p>Vaknattsprogram med böner, föreläsning och iftar-måltid i föreningens lokaler.</p>",
        icon: "Star",
        imageUrl: PICSUM("event-ghadr"),
      },
    ],
  },

  // ---------- EDUCATION ----------
  {
    slug: "education",
    title_fa: "آموزش",
    title_sv: "Utbildning",
    description_fa:
      "دوره‌های آموزشی متنوع برای کودکان، نوجوانان و بزرگ‌سالان؛ از زبان فارسی و عربی تا ریاضی و مدیریت زندگی. برای ثبت‌نام در هر دوره فرم مربوطه را در صفحه‌ی همان دوره تکمیل کنید.",
    description_sv:
      "Varierade kurser för barn, ungdomar och vuxna — från persiska och arabiska till matematik och livskunskap. Anmäl dig till varje kurs via formuläret på respektive kurssida.",
    icon: "GraduationCap",
    backgroundUrl: PICSUM("education-bg", 1920, 1080),
    registration: "form",
    slides: [
      {
        imageUrl: PICSUM("education-slide-1"),
        title_fa: "یادگیری در هر سن",
        title_sv: "Lärande i alla åldrar",
        subtitle_fa: "دوره‌هایی برای کودکان، نوجوانان و بزرگ‌سالان",
        subtitle_sv: "Kurser för barn, ungdomar och vuxna",
        ctaText_fa: "ثبت‌نام",
        ctaText_sv: "Anmäl dig",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("education-slide-2"),
        title_fa: "زبان مادری، پل به ریشه‌ها",
        title_sv: "Modersmålet — bron till våra rötter",
        subtitle_fa: "کلاس‌های فارسی و عربی",
        subtitle_sv: "Kurser i persiska och arabiska",
        ctaText_fa: "دوره‌ها",
        ctaText_sv: "Se kurser",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("education-slide-3"),
        title_fa: "مهارت‌های زندگی",
        title_sv: "Livets färdigheter",
        subtitle_fa: "کارگاه‌های کاربردی برای زنان و خانواده",
        subtitle_sv: "Praktiska workshops för kvinnor och familjer",
        ctaText_fa: "اطلاعات بیشتر",
        ctaText_sv: "Läs mer",
        ctaLink: "#events",
      },
    ],
    events: [
      {
        slug: "persian-language-students",
        title_fa: "زبان فارسی برای دانش‌آموزان",
        title_sv: "Persiska för elever",
        excerpt_fa: "آموزش خواندن، نوشتن و مکالمه‌ی فارسی برای دانش‌آموزان مدرسه.",
        excerpt_sv: "Läs-, skriv- och konversationsundervisning i persiska för skolelever.",
        body_fa:
          "<p>کلاس‌های هفتگی با کتاب‌های آموزشی استاندارد، تمرین گفتار و فعالیت‌های گروهی برای تقویت زبان مادری.</p>",
        body_sv:
          "<p>Veckokurser med standardläromedel, talövningar och gruppaktiviteter för att stärka modersmålet.</p>",
        icon: "BookOpen",
        imageUrl: PICSUM("event-persian"),
      },
      {
        slug: "math-students",
        title_fa: "ریاضی برای دانش‌آموزان",
        title_sv: "Matematik för elever",
        excerpt_fa: "تقویت ریاضی پایه و دبیرستان همراه با حل تمرین و رفع اشکال.",
        excerpt_sv: "Förstärkning av matematik på grundskole- och gymnasienivå med övningar.",
        body_fa:
          "<p>جلسات هفتگی برای دانش‌آموزان دوره‌های مختلف، با تمرکز بر مفاهیم پایه و حل مسائل امتحانی.</p>",
        body_sv:
          "<p>Veckosessioner för elever på olika nivåer, med fokus på grundbegrepp och provuppgifter.</p>",
        icon: "Calculator",
        imageUrl: PICSUM("event-math"),
      },
      {
        slug: "life-management-women",
        title_fa: "مدیریت زندگی برای بانوان",
        title_sv: "Livshantering för kvinnor",
        excerpt_fa: "کارگاه‌های مهارت‌های زندگی، خانواده و تربیت فرزند ویژه‌ی بانوان.",
        excerpt_sv: "Workshops i livskunskap, familjeliv och barnuppfostran för kvinnor.",
        body_fa:
          "<p>کارگاه‌های ماهانه با حضور کارشناسان و فرصت گفت‌وگو بین شرکت‌کنندگان.</p>",
        body_sv:
          "<p>Månatliga workshops med experter och utrymme för samtal mellan deltagarna.</p>",
        icon: "HeartHandshake",
        imageUrl: PICSUM("event-life-mgmt"),
      },
      {
        slug: "arabic-kids",
        title_fa: "زبان عربی برای کودکان",
        title_sv: "Arabiska för barn",
        excerpt_fa: "آموزش الفبا، تلاوت و مکالمه‌ی ساده‌ی عربی به شیوه‌ی کودکانه.",
        excerpt_sv: "Alfabet, recitation och enkel konversation på arabiska — barnvänligt upplägg.",
        body_fa:
          "<p>کلاس‌های هفتگی با بازی، آواز و کتاب برای جذاب کردن یادگیری زبان عربی برای کودکان.</p>",
        body_sv:
          "<p>Veckokurser med lek, sång och böcker för att göra arabiska roligt för barn.</p>",
        icon: "Languages",
        imageUrl: PICSUM("event-arabic"),
      },
    ],
  },

  // ---------- SPORT ----------
  {
    slug: "sport",
    title_fa: "ورزش",
    title_sv: "Idrott",
    description_fa:
      "فعالیت‌های ورزشی منظم برای آقایان، بانوان و کودکان در رشته‌های متنوع. هدف ما ارتقای سلامت جسمی و روحی اعضای کانون در محیطی دوستانه و امن است.",
    description_sv:
      "Regelbundna idrottsaktiviteter för män, kvinnor och barn i flera grenar. Vårt mål är att främja fysisk och mental hälsa i en trygg och vänlig miljö.",
    icon: "Dumbbell",
    backgroundUrl: PICSUM("sport-bg", 1920, 1080),
    registration: "form",
    slides: [
      {
        imageUrl: PICSUM("sport-slide-1"),
        title_fa: "حرکت، سلامتی، شادی",
        title_sv: "Rörelse, hälsa, glädje",
        subtitle_fa: "برنامه‌های ورزشی هفتگی برای همه",
        subtitle_sv: "Veckovisa idrottsprogram för alla",
        ctaText_fa: "ثبت‌نام",
        ctaText_sv: "Anmäl dig",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("sport-slide-2"),
        title_fa: "سالن‌های مجزای بانوان",
        title_sv: "Separata sektioner för kvinnor",
        subtitle_fa: "محیطی امن و راحت برای ورزش بانوان",
        subtitle_sv: "Trygg och bekväm miljö för kvinnors träning",
        ctaText_fa: "اطلاعات بیشتر",
        ctaText_sv: "Läs mer",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("sport-slide-3"),
        title_fa: "تیم‌های ورزشی کانون",
        title_sv: "Föreningens idrottslag",
        subtitle_fa: "والیبال، شنا، پیلاتس و رقص",
        subtitle_sv: "Volleyboll, simning, Pilates och dans",
        ctaText_fa: "رشته‌ها",
        ctaText_sv: "Se grenar",
        ctaLink: "#events",
      },
    ],
    events: [
      {
        slug: "men-volleyball",
        title_fa: "والیبال آقایان",
        title_sv: "Volleyboll för män",
        excerpt_fa: "تمرین هفتگی والیبال در سالن سرپوشیده.",
        excerpt_sv: "Veckoträning i volleyboll i inomhushall.",
        body_fa:
          "<p>تمرینات منظم برای علاقه‌مندان والیبال در رده‌ی آقایان، شامل گرم‌کردن، تکنیک و بازی.</p>",
        body_sv:
          "<p>Regelbunden träning för volleybollintresserade män med uppvärmning, teknik och matchspel.</p>",
        icon: "Volleyball",
        imageUrl: PICSUM("event-men-vb"),
      },
      {
        slug: "women-volleyball",
        title_fa: "والیبال بانوان",
        title_sv: "Volleyboll för kvinnor",
        excerpt_fa: "تمرین هفتگی والیبال در سالنی اختصاصی بانوان.",
        excerpt_sv: "Veckoträning i volleyboll i sal endast för kvinnor.",
        body_fa: "<p>محیطی امن و دوستانه برای تمرین والیبال بانوان در همه‌ی سطوح.</p>",
        body_sv: "<p>En trygg och vänlig miljö för volleybollträning för kvinnor på alla nivåer.</p>",
        icon: "Volleyball",
        imageUrl: PICSUM("event-women-vb"),
      },
      {
        slug: "men-swimming",
        title_fa: "شنای آقایان",
        title_sv: "Simning för män",
        excerpt_fa: "جلسات شنای هفتگی در استخر اختصاصی.",
        excerpt_sv: "Veckovisa simpass i bokad bassäng.",
        body_fa: "<p>جلسات شنا برای آقایان در سطوح مختلف، با امکان مربی.</p>",
        body_sv: "<p>Simpass för män på olika nivåer, instruktör tillgänglig.</p>",
        icon: "Waves",
        imageUrl: PICSUM("event-men-swim"),
      },
      {
        slug: "women-swimming",
        title_fa: "شنای بانوان",
        title_sv: "Simning för kvinnor",
        excerpt_fa: "جلسات شنای هفتگی در استخر اختصاصی بانوان.",
        excerpt_sv: "Veckovisa simpass i bassäng endast för kvinnor.",
        body_fa: "<p>محیطی کاملاً خصوصی برای شنای بانوان به همراه مربی خانم.</p>",
        body_sv: "<p>Helt privat miljö för kvinnors simning med kvinnlig instruktör.</p>",
        icon: "Waves",
        imageUrl: PICSUM("event-women-swim"),
      },
      {
        slug: "women-pilates",
        title_fa: "پیلاتس بانوان",
        title_sv: "Pilates för kvinnor",
        excerpt_fa: "کلاس‌های پیلاتس برای آرامش، انعطاف و قدرت بدنی.",
        excerpt_sv: "Pilatesklasser för avslappning, rörlighet och styrka.",
        body_fa: "<p>کلاس‌های منظم پیلاتس با مربی متخصص بانوان.</p>",
        body_sv: "<p>Regelbundna Pilatesklasser med kvinnlig specialistinstruktör.</p>",
        icon: "Activity",
        imageUrl: PICSUM("event-pilates"),
      },
      {
        slug: "women-dance",
        title_fa: "رقص بانوان",
        title_sv: "Dans för kvinnor",
        excerpt_fa: "کلاس‌های رقص شاد و انرژی‌بخش برای بانوان.",
        excerpt_sv: "Glada och energifyllda dansklasser för kvinnor.",
        body_fa: "<p>سبک‌های مختلف رقص ایرانی و مدرن در فضایی صمیمی و امن.</p>",
        body_sv: "<p>Olika persiska och moderna dansstilar i en vänlig och trygg miljö.</p>",
        icon: "Music2",
        imageUrl: PICSUM("event-dance"),
      },
    ],
  },

  // ---------- ART & MEDIA ----------
  {
    slug: "art-media",
    title_fa: "هنر و رسانه",
    title_sv: "Konst & Media",
    description_fa:
      "برنامه‌های هنری، فیلم و کارگاه‌های خلاقیت برای همه‌ی گروه‌های سنی. هدف، پرورش ذوق هنری، گفت‌وگو درباره‌ی فیلم و آشنایی کودکان با موسیقی و هنرهای دستی است.",
    description_sv:
      "Konst-, film- och kreativitetsprogram för alla åldrar. Målet är att utveckla konstnärlig sensibilitet, samtala om film och introducera barn till musik och hantverk.",
    icon: "Palette",
    backgroundUrl: PICSUM("art-bg", 1920, 1080),
    registration: "form",
    slides: [
      {
        imageUrl: PICSUM("art-slide-1"),
        title_fa: "نمایش و گفت‌وگو",
        title_sv: "Visning och samtal",
        subtitle_fa: "کلوب‌های فیلم برای آقایان، بانوان و خانواده",
        subtitle_sv: "Filmklubbar för män, kvinnor och familjer",
        ctaText_fa: "برنامه‌ها",
        ctaText_sv: "Se program",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("art-slide-2"),
        title_fa: "هنر در دستان کودکان",
        title_sv: "Konst i barnens händer",
        subtitle_fa: "کارگاه‌های نقاشی، کاردستی و موسیقی",
        subtitle_sv: "Workshops i målning, hantverk och musik",
        ctaText_fa: "اطلاعات بیشتر",
        ctaText_sv: "Läs mer",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("art-slide-3"),
        title_fa: "خلاقیت در جمع",
        title_sv: "Kreativitet i gemenskap",
        subtitle_fa: "جایی برای کشف و بیان",
        subtitle_sv: "En plats för upptäckt och uttryck",
        ctaText_fa: "همراه شوید",
        ctaText_sv: "Var med",
        ctaLink: "#events",
      },
    ],
    events: [
      {
        slug: "men-movie-club",
        title_fa: "کلوب فیلم آقایان",
        title_sv: "Filmklubb för män",
        excerpt_fa: "نمایش فیلم و گفت‌وگوی نقادانه ویژه‌ی آقایان.",
        excerpt_sv: "Filmvisning och kritisk diskussion för män.",
        body_fa: "<p>جلسات ماهانه با انتخاب فیلم‌های ایرانی و جهانی و بحث پس از نمایش.</p>",
        body_sv: "<p>Månatliga möten med utvalda persiska och internationella filmer följt av diskussion.</p>",
        icon: "Film",
        imageUrl: PICSUM("event-men-movie"),
      },
      {
        slug: "women-movie-club",
        title_fa: "کلوب فیلم بانوان",
        title_sv: "Filmklubb för kvinnor",
        excerpt_fa: "نمایش فیلم و گفت‌وگو در فضایی اختصاصی بانوان.",
        excerpt_sv: "Filmvisning och samtal i miljö endast för kvinnor.",
        body_fa: "<p>گردهمایی ماهانه برای دیدن و تحلیل فیلم در جمعی صمیمی.</p>",
        body_sv: "<p>Månatlig sammankomst för att se och analysera film i en vänlig grupp.</p>",
        icon: "Film",
        imageUrl: PICSUM("event-women-movie"),
      },
      {
        slug: "family-movie-club",
        title_fa: "کلوب فیلم خانواده",
        title_sv: "Familjefilmklubb",
        excerpt_fa: "نمایش فیلم مناسب همه‌ی اعضای خانواده.",
        excerpt_sv: "Filmvisning lämplig för hela familjen.",
        body_fa: "<p>عصرهای خانوادگی همراه با فیلم، پاپ‌کورن و گفت‌وگوی سبک.</p>",
        body_sv: "<p>Familjekvällar med film, popcorn och lättsamt samtal.</p>",
        icon: "Film",
        imageUrl: PICSUM("event-family-movie"),
      },
      {
        slug: "kids-handicraft",
        title_fa: "کاردستی و نقاشی کودکان",
        title_sv: "Hantverk och målning för barn",
        excerpt_fa: "کارگاه‌های هنری برای پرورش خلاقیت کودکان.",
        excerpt_sv: "Konstverkstäder för att utveckla barns kreativitet.",
        body_fa: "<p>جلسات هفتگی با ابزارهای رنگ، کاغذ، خمیر و سایر مواد هنری.</p>",
        body_sv: "<p>Veckosessioner med färg, papper, lera och annat skapande material.</p>",
        icon: "Paintbrush",
        imageUrl: PICSUM("event-handicraft"),
      },
      {
        slug: "kids-music",
        title_fa: "موسیقی و آواز کودکان",
        title_sv: "Musik och sång för barn",
        excerpt_fa: "آشنایی کودکان با ریتم، ساز و آواز در گروه.",
        excerpt_sv: "Barn introduceras till rytm, instrument och sång i grupp.",
        body_fa: "<p>کلاس‌های شاد و بازی‌محور برای پرورش گوش موسیقایی کودکان.</p>",
        body_sv: "<p>Roliga och lekfulla klasser för att utveckla barns musikalitet.</p>",
        icon: "Music",
        imageUrl: PICSUM("event-kids-music"),
      },
    ],
  },

  // ---------- SOCIAL ----------
  {
    slug: "social",
    title_fa: "اجتماعی و معنوی",
    title_sv: "Socialt & Andligt",
    description_fa:
      "گردهمایی‌های هفتگی برای دعا و معنویت در فضایی صمیمی. این برنامه‌ها بدون نیاز به ثبت‌نام و باز برای همه‌ی اعضا و میهمانان است.",
    description_sv:
      "Veckovisa sammankomster för bön och andlighet i en vänlig miljö. Programmen kräver ingen anmälan och är öppna för alla medlemmar och gäster.",
    icon: "Users",
    backgroundUrl: PICSUM("social-bg", 1920, 1080),
    registration: "none",
    slides: [
      {
        imageUrl: PICSUM("social-slide-1"),
        title_fa: "گردهم‌آیی هفتگی",
        title_sv: "Veckosammankomster",
        subtitle_fa: "دعای کمیل پنجشنبه‌ها، دعای توسل سه‌شنبه‌ها",
        subtitle_sv: "Komeyl på torsdagar, Tavasol på tisdagar",
        ctaText_fa: "برنامه‌ها",
        ctaText_sv: "Se program",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("social-slide-2"),
        title_fa: "فضایی برای آرامش",
        title_sv: "En plats för lugn",
        subtitle_fa: "دور هم، با نیت پاک",
        subtitle_sv: "Tillsammans, med rena avsikter",
        ctaText_fa: "اطلاعات بیشتر",
        ctaText_sv: "Läs mer",
        ctaLink: "#events",
      },
      {
        imageUrl: PICSUM("social-slide-3"),
        title_fa: "همراه با خانواده",
        title_sv: "Tillsammans med familjen",
        subtitle_fa: "باز برای همه‌ی اعضا و میهمانان",
        subtitle_sv: "Öppet för alla medlemmar och gäster",
        ctaText_fa: "حضور یابید",
        ctaText_sv: "Kom och delta",
        ctaLink: "#events",
      },
    ],
    events: [
      {
        slug: "komeyl-dua",
        title_fa: "دعای کمیل (پنجشنبه‌ها)",
        title_sv: "Komeyl-bönen (torsdagar)",
        excerpt_fa: "قرائت دعای کمیل هر پنجشنبه شب در محل کانون.",
        excerpt_sv: "Recitation av Komeyl-bönen varje torsdagskväll i föreningens lokaler.",
        body_fa:
          "<p>برنامه‌ی هفتگی شامل قرائت دعا، چند دقیقه سخنرانی و پذیرایی. حضور برای همه آزاد است.</p>",
        body_sv:
          "<p>Veckoprogram med bön, kort föreläsning och servering. Öppet för alla.</p>",
        icon: "BookHeart",
        imageUrl: PICSUM("event-komeyl"),
      },
      {
        slug: "tavasol-dua",
        title_fa: "دعای توسل (سه‌شنبه‌ها)",
        title_sv: "Tavasol-bönen (tisdagar)",
        excerpt_fa: "قرائت دعای توسل هر سه‌شنبه شب در محل کانون.",
        excerpt_sv: "Recitation av Tavasol-bönen varje tisdagskväll i föreningens lokaler.",
        body_fa:
          "<p>برنامه‌ی هفتگی شامل قرائت دعا، سخنرانی کوتاه و پذیرایی. بدون نیاز به ثبت‌نام.</p>",
        body_sv:
          "<p>Veckoprogram med bön, kort föreläsning och servering. Ingen anmälan krävs.</p>",
        icon: "BookHeart",
        imageUrl: PICSUM("event-tavasol"),
      },
    ],
  },
];
