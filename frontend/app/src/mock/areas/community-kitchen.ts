import type {
  SiteSettingsReturn, TopicReturn, ActivityReturn, HeroSlideReturn,
  AboutContentReturn, ContactMessageReturn, SocialLinkReturn,
  RegistrationReturn, FormTemplateReturn,
} from "../../backend/api/backend";

const img = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const ts = (daysAgo: number) => BigInt(Date.now() - daysAgo * 86_400_000) * 1_000_000n;

export const mockSettings: SiteSettingsReturn = {
  logoUrl: img("casaverde-logo", 200, 200),
  title_fa: "کازا ورده",
  title_sv: "Casa Verde",
  subtitle_fa: "مدرسه آشپزی و جامعه غذایی",
  subtitle_sv: "Matlagningsskola och matgemenskap",
  landingBackgroundUrl: img("casaverde-landing", 1920, 1080),
  topicsBackgroundUrl: img("casaverde-topics", 1920, 1080),
  mockMode: true,
};

export const mockTopics: TopicReturn[] = [
  { id: 51001n, slug: "italian", title_fa: "آشپزی ایتالیایی", title_sv: "Italiensk matlagning", description_fa: "پاستا، پیتزا، ریزوتو و دسرهای کلاسیک ایتالیایی", description_sv: "Pasta, pizza, risotto och klassiska italienska desserter", icon: "ChefHat", backgroundUrl: img("italian-bg", 1920, 1080), sortOrder: 1n, createdAt: ts(90) },
  { id: 51002n, slug: "baking", title_fa: "نانوایی و شیرینی‌پزی", title_sv: "Bakning och konditori", description_fa: "نان خانگی، کیک، پای و شیرینی‌های فرانسوی", description_sv: "Hembakat bröd, tårta, pajer och franska konditorier", icon: "Croissant", backgroundUrl: img("baking-bg", 1920, 1080), sortOrder: 2n, createdAt: ts(85) },
  { id: 51003n, slug: "street-food", title_fa: "غذای خیابانی جهان", title_sv: "Världens gatumat", description_fa: "تاکو، دیم‌سام، فلافل و تنقلات از سراسر جهان", description_sv: "Tacos, dim sum, falafel och snacks från hela världen", icon: "Sandwich", backgroundUrl: img("streetfood-bg", 1920, 1080), sortOrder: 3n, createdAt: ts(80) },
  { id: 51004n, slug: "fermentation", title_fa: "تخمیر و نگهداری", title_sv: "Fermentering och konservering", description_fa: "کیمچی، کامبوچا، کفیر و تخمیر سبزیجات", description_sv: "Kimchi, kombucha, kefir och fermenterade grönsaker", icon: "FlaskConical", backgroundUrl: img("ferment-bg", 1920, 1080), sortOrder: 4n, createdAt: ts(75) },
  { id: 51005n, slug: "plant-based", title_fa: "آشپزی گیاهی", title_sv: "Växtbaserad matlagning", description_fa: "غذاهای گیاهی خوشمزه بدون گوشت و لبنیات", description_sv: "Utsökt vegetabilisk mat utan kött och mejeri", icon: "Leaf", backgroundUrl: img("plantbased-bg", 1920, 1080), sortOrder: 5n, createdAt: ts(70) },
];

const body = (fa: string, sv: string) => ({
  body_fa: `<h2>${fa}</h2><p>در این کلاس با راهنمایی آشپزهای حرفه‌ای، فنون آشپزی و اسرار طعم‌ها را کشف می‌کنید. هر جلسه شامل آماده‌سازی، پخت و میل کردن مشترک غذاست.</p><ul><li>مواد اولیه تازه و محلی</li><li>دستورالعمل‌های چاپی برای خانه</li><li>فضایی صمیمی با حداکثر ۱۲ نفر</li></ul>`,
  body_sv: `<h2>${sv}</h2><p>I denna klass med professionella kockar som guide, utforskar du matlagningstekniker och smakhemligheter. Varje session inkluderar förberedelse, tillagning och gemensamt ätande.</p><ul><li>Färska lokala ingredienser</li><li>Tryckta recept att ta hem</li><li>Intim miljö med max 12 personer</li></ul>`,
  formTemplateId: undefined as bigint | undefined,
  customFormFields: [] as FormTemplateReturn["fields"],
});

export const mockActivities: ActivityReturn[] = [
  // Italian
  {
    id: 52001n, topicId: 51001n, slug: "pasta-from-scratch",
    title_fa: "پاستا دست‌ساز", title_sv: "Pasta från grunden",
    excerpt_fa: "یادگیری تهیه پاستای تازه با آرد سمولینا و تخم‌مرغ",
    excerpt_sv: "Lär dig göra färsk pasta med semolina och ägg",
    ...body("پاستا دست‌ساز", "Pasta från grunden"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "سطح آشپزی", label_sv: "Matlagningsnivå", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "مبتدی — کمتر از یک سال", sv: "Nybörjare — mindre än ett år" }, { fa: "متوسط — ۱ تا ۳ سال", sv: "Medel — 1–3 år" }, { fa: "پیشرفته — بیش از ۳ سال", sv: "Avancerad — mer än 3 år" }], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "آیا حساسیت به گلوتن دارید؟", label_sv: "Har du glutenintolerans?", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "خیر", sv: "Nej" }, { fa: "بله", sv: "Ja" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "آلرژی‌های غذایی دیگر", label_sv: "Andra matallergier", placeholder_fa: "اگر آلرژی یا محدودیت غذایی دارید بنویسید", placeholder_sv: "Ange eventuella allergier eller kostbegränsningar", required: false, options: [], sortOrder: 5n },
    ],
    icon: "ChefHat", imageUrl: img("pasta-scratch", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(60),
  },
  {
    id: 52002n, topicId: 51001n, slug: "pizza-napoletana",
    title_fa: "پیتزا ناپولیتانا", title_sv: "Pizza Napoletana",
    excerpt_fa: "خمیر ناپولیتانا، سس گوجه سن مارتسانو و پختن با دمای بالا",
    excerpt_sv: "Napolitansk deg, San Marzano-tomatssås och bakning i hög temperatur",
    ...body("پیتزا ناپولیتانا", "Pizza Napoletana"),
    formTemplateId: 57001n,
    icon: "Pizza", imageUrl: img("pizza-naple", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(55),
  },
  {
    id: 52003n, topicId: 51001n, slug: "risotto-masterclass",
    title_fa: "مسترکلاس ریزوتو", title_sv: "Risotto masterclass",
    excerpt_fa: "تکنیک صحیح پختن ریزوتو: خامه‌ای بدون خامه",
    excerpt_sv: "Rätt teknik för risotto: krämigt utan grädde",
    ...body("مسترکلاس ریزوتو", "Risotto masterclass"),
    icon: "Utensils", imageUrl: img("risotto", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(50),
  },
  {
    id: 52004n, topicId: 51001n, slug: "tiramisu-and-panna-cotta",
    title_fa: "تیرامیسو و پانا کوتا", title_sv: "Tiramisu och panna cotta",
    excerpt_fa: "دو دسر کلاسیک ایتالیایی با راز‌های شف اصلی",
    excerpt_sv: "Två klassiska italienska desserter med chefens hemligheter",
    ...body("تیرامیسو و پانا کوتا", "Tiramisu och panna cotta"),
    formTemplateId: 57001n,
    icon: "IceCream", imageUrl: img("tiramisu", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(45),
  },
  {
    id: 52005n, topicId: 51001n, slug: "italian-wine-pairing",
    title_fa: "ترکیب غذا و شراب ایتالیایی", title_sv: "Italiensk mat- och vinkombination",
    excerpt_fa: "اصول جفت‌کردن شراب‌های ایتالیایی با غذاهای کلاسیک",
    excerpt_sv: "Principerna för att kombinera italienska viner med klassiska rätter",
    ...body("ترکیب غذا و شراب ایتالیایی", "Italiensk mat- och vinkombination"),
    icon: "Wine", imageUrl: img("wine-pairing", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(40),
  },
  // Baking
  {
    id: 52006n, topicId: 51002n, slug: "sourdough-bread",
    title_fa: "نان خمیرمایه طبیعی", title_sv: "Surdegsbröd",
    excerpt_fa: "تهیه و نگهداری خمیرمایه و پخت نان خمیرترش اصیل",
    excerpt_sv: "Skapa och underhålla surdeg och baka äkta surdegsbröd",
    ...body("نان خمیرمایه طبیعی", "Surdegsbröd"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "آیا قبلاً نان خمیرمایه پخته‌اید؟", label_sv: "Har du bakat surdegsbröd tidigare?", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "اولین بار است", sv: "Första gången" }, { fa: "چند بار امتحان کرده‌ام", sv: "Försökt ett par gånger" }, { fa: "با تجربه هستم", sv: "Jag har erfarenhet" }], sortOrder: 3n },
      { id: 4n, fieldType: "checkbox", label_fa: "تجهیزات مورد نیاز را تهیه می‌کنم", label_sv: "Jag skaffar nödvändig utrustning", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 4n },
    ],
    icon: "Wheat", imageUrl: img("sourdough", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(58),
  },
  {
    id: 52007n, topicId: 51002n, slug: "french-pastry",
    title_fa: "شیرینی‌پزی فرانسوی", title_sv: "Franska konditorier",
    excerpt_fa: "کراسان، اکلر، مادلن و ماکارون — اصول پاتیسری فرانسوی",
    excerpt_sv: "Croissanter, éclairs, madeleines och macarons — grunderna i fransk patisseri",
    ...body("شیرینی‌پزی فرانسوی", "Franska konditorier"),
    formTemplateId: 57001n,
    icon: "Croissant", imageUrl: img("french-pastry", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(52),
  },
  {
    id: 52008n, topicId: 51002n, slug: "cake-decoration",
    title_fa: "تزئین کیک", title_sv: "Tårtdekorering",
    excerpt_fa: "کرم‌های کره‌ای، گل‌های شکری و تکنیک‌های پایپینگ",
    excerpt_sv: "Smörkrämer, sockerblommor och piping-tekniker",
    ...body("تزئین کیک", "Tårtdekorering"),
    icon: "CakeSlice", imageUrl: img("cake-deco", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(48),
  },
  {
    id: 52009n, topicId: 51002n, slug: "gluten-free-baking",
    title_fa: "نانوایی بدون گلوتن", title_sv: "Glutenfri bakning",
    excerpt_fa: "جایگزین‌های آرد گندم و فنون نانوایی برای حساسین به گلوتن",
    excerpt_sv: "Vetemjölsalternativ och baktekniker för glutenintoleranta",
    ...body("نانوایی بدون گلوتن", "Glutenfri bakning"),
    formTemplateId: 57002n,
    icon: "Star", imageUrl: img("gluten-free", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(43),
  },
  {
    id: 52010n, topicId: 51002n, slug: "chocolate-workshop",
    title_fa: "کارگاه شکلات‌سازی", title_sv: "Chokladworkshop",
    excerpt_fa: "تمپرکردن شکلات، ترافل و شکلات‌های پر شده",
    excerpt_sv: "Temperering av choklad, tryfflar och fyllda choklader",
    ...body("کارگاه شکلات‌سازی", "Chokladworkshop"),
    icon: "Gift", imageUrl: img("chocolate", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(38),
  },
  // Street Food
  {
    id: 52011n, topicId: 51003n, slug: "taco-night",
    title_fa: "شب تاکو", title_sv: "Tacokvällen",
    excerpt_fa: "تاکوی مکزیکی اصیل با ترتیلای دست‌ساز و سالسای تازه",
    excerpt_sv: "Äkta mexikanska tacos med handgjorda tortillas och färsk salsa",
    ...body("شب تاکو", "Tacokvällen"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "number", label_fa: "تعداد نفرات", label_sv: "Antal personer", placeholder_fa: "مثلاً ۲", placeholder_sv: "T.ex. 2", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "رژیم غذایی", label_sv: "Kostval", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "همه‌چیزخور", sv: "Allätare" }, { fa: "گیاهخوار", sv: "Vegetarian" }, { fa: "وگان", sv: "Vegan" }, { fa: "بدون گلوتن", sv: "Glutenfri" }], sortOrder: 4n },
    ],
    icon: "Sandwich", imageUrl: img("taco-night", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(57),
  },
  {
    id: 52012n, topicId: 51003n, slug: "dim-sum",
    title_fa: "دیم‌سام", title_sv: "Dim sum",
    excerpt_fa: "دامپلینگ، باو، ها‌گائو و غذاهای بخارپز چینی",
    excerpt_sv: "Dumplings, baobröd, har gow och ångade kinesiska rätter",
    ...body("دیم‌سام", "Dim sum"),
    formTemplateId: 57001n,
    icon: "Star", imageUrl: img("dim-sum", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(51),
  },
  {
    id: 52013n, topicId: 51003n, slug: "falafel-and-mezze",
    title_fa: "فلافل و مزه خاورمیانه‌ای", title_sv: "Falafel och mellanösterns mezze",
    excerpt_fa: "حمص، فلافل، تبوله و انواع مزه اصیل خاورمیانه",
    excerpt_sv: "Hummus, falafel, tabbouleh och äkta mellanösterns mezze",
    ...body("فلافل و مزه خاورمیانه‌ای", "Falafel och mellanösterns mezze"),
    icon: "Salad", imageUrl: img("falafel-mezze", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(46),
  },
  {
    id: 52014n, topicId: 51003n, slug: "ramen-workshop",
    title_fa: "کارگاه رامن", title_sv: "Ramenworkshop",
    excerpt_fa: "آبگوشت ۱۸ ساعته، تاره و توپینگ‌های رامن ژاپنی",
    excerpt_sv: "18-timmarsbuljongen, tare och japanska ramen-toppings",
    ...body("کارگاه رامن", "Ramenworkshop"),
    formTemplateId: 57001n,
    icon: "Soup", imageUrl: img("ramen", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(41),
  },
  {
    id: 52015n, topicId: 51003n, slug: "street-food-tour",
    title_fa: "گردش غذایی خیابانی", title_sv: "Gatumatsvandring",
    excerpt_fa: "تست غذاهای خیابانی از ۶ کشور مختلف در یک شام",
    excerpt_sv: "Smaka på gatumat från 6 olika länder på en middag",
    ...body("گردش غذایی خیابانی", "Gatumatsvandring"),
    icon: "Globe", imageUrl: img("food-tour", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(36),
  },
  // Fermentation
  {
    id: 52016n, topicId: 51004n, slug: "kimchi-making",
    title_fa: "کیمچی‌سازی", title_sv: "Kimchitillverkning",
    excerpt_fa: "کیمچی سنتی کره‌ای با تخمیر طبیعی باکتری‌های سالم",
    excerpt_sv: "Traditionell koreansk kimchi med naturlig fermentering av nyttiga bakterier",
    ...body("کیمچی‌سازی", "Kimchitillverkning"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "آیا با تخمیر آشنایی دارید؟", label_sv: "Har du erfarenhet av fermentering?", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "اصلاً", sv: "Inte alls" }, { fa: "کمی", sv: "Lite" }, { fa: "بله، تجربه دارم", sv: "Ja, jag har erfarenhet" }], sortOrder: 3n },
      { id: 4n, fieldType: "select", label_fa: "ظرف تخمیر دارید؟", label_sv: "Har du ett fermenteringskärl?", placeholder_fa: "انتخاب کنید", placeholder_sv: "Välj", required: true, options: [{ fa: "بله", sv: "Ja" }, { fa: "خیر، از شما می‌خرم", sv: "Nej, jag köper från er" }, { fa: "می‌خواهم یاد بگیرم چه بخرم", sv: "Vill lära mig vad jag ska köpa" }], sortOrder: 4n },
    ],
    icon: "FlaskConical", imageUrl: img("kimchi", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(56),
  },
  {
    id: 52017n, topicId: 51004n, slug: "kombucha-brewing",
    title_fa: "دم‌کردن کامبوچا", title_sv: "Kombuchatillverkning",
    excerpt_fa: "SCOBY، تخمیر اول و دوم، طعم‌دهی طبیعی",
    excerpt_sv: "SCOBY, första och andra fermentering, naturlig smaksättning",
    ...body("دم‌کردن کامبوچا", "Kombuchatillverkning"),
    formTemplateId: 57001n,
    icon: "Droplets", imageUrl: img("kombucha", 800, 600), hasRegistration: true, sortOrder: 2n, createdAt: ts(49),
  },
  {
    id: 52018n, topicId: 51004n, slug: "vegetable-fermentation",
    title_fa: "تخمیر سبزیجات", title_sv: "Grönsaksfermentering",
    excerpt_fa: "ترشی‌های خانگی، کلم ترش آلمانی و سبزیجات تخمیری",
    excerpt_sv: "Hemgjord surkål, sauerkraut och fermenterade grönsaker",
    ...body("تخمیر سبزیجات", "Grönsaksfermentering"),
    icon: "Leaf", imageUrl: img("veggie-ferment", 800, 600), hasRegistration: false, sortOrder: 3n, createdAt: ts(44),
  },
  {
    id: 52019n, topicId: 51004n, slug: "kefir-and-yogurt",
    title_fa: "کفیر و ماست خانگی", title_sv: "Kefir och hemgjord yoghurt",
    excerpt_fa: "تهیه کفیر شیری، کفیر آبی و ماست یونانی غلیظ",
    excerpt_sv: "Tillverkning av mjölkkefir, vattenkefir och tjock grekisk yoghurt",
    ...body("کفیر و ماست خانگی", "Kefir och hemgjord yoghurt"),
    formTemplateId: 57002n,
    icon: "Milk", imageUrl: img("kefir-yogurt", 800, 600), hasRegistration: true, sortOrder: 4n, createdAt: ts(39),
  },
  {
    id: 52020n, topicId: 51004n, slug: "fermented-pantry",
    title_fa: "آنباری تخمیری", title_sv: "Fermenterat skafferi",
    excerpt_fa: "مایه‌ها، خمیرهای تخمیری و نگهداری غذا به روش سنتی",
    excerpt_sv: "Starter, fermenterade pastor och traditionell matkonservering",
    ...body("آنباری تخمیری", "Fermenterat skafferi"),
    icon: "Archive", imageUrl: img("ferment-pantry", 800, 600), hasRegistration: false, sortOrder: 5n, createdAt: ts(34),
  },
  // Plant-based
  {
    id: 52021n, topicId: 51005n, slug: "vegan-protein",
    title_fa: "پروتئین گیاهی", title_sv: "Veganskt protein",
    excerpt_fa: "توفو، تمپه، سیتان و حبوبات — پروتئین بدون گوشت",
    excerpt_sv: "Tofu, tempeh, seitan och baljväxter — protein utan kött",
    ...body("پروتئین گیاهی", "Veganskt protein"),
    customFormFields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "radio", label_fa: "رژیم غذایی شما", label_sv: "Din kosthållning", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "وگان", sv: "Vegan" }, { fa: "گیاهخوار", sv: "Vegetarian" }, { fa: "دارم به سمت گیاهخواری می‌روم", sv: "Övergår till vegetarisk kost" }, { fa: "کنجکاوم", sv: "Nyfiken" }], sortOrder: 3n },
      { id: 4n, fieldType: "textarea", label_fa: "آلرژی‌ها و محدودیت‌های غذایی", label_sv: "Allergier och kostbegränsningar", placeholder_fa: "آیا به سویا، آجیل یا گلوتن حساسیت دارید؟", placeholder_sv: "Är du allergisk mot soja, nötter eller gluten?", required: false, options: [], sortOrder: 4n },
    ],
    icon: "Carrot", imageUrl: img("vegan-protein", 800, 600), hasRegistration: true, sortOrder: 1n, createdAt: ts(54),
  },
  {
    id: 52022n, topicId: 51005n, slug: "raw-food",
    title_fa: "غذای خام", title_sv: "Rawfood",
    excerpt_fa: "سالادهای پیچیده، مارینادهای خام و چیزکیک خام",
    excerpt_sv: "Komplexa sallader, råa marinader och raw cheesecake",
    ...body("غذای خام", "Rawfood"),
    icon: "Apple", imageUrl: img("raw-food", 800, 600), hasRegistration: false, sortOrder: 2n, createdAt: ts(47),
  },
  {
    id: 52023n, topicId: 51005n, slug: "plant-based-burgers",
    title_fa: "برگر گیاهی خانگی", title_sv: "Hemgjord växtbaserad burger",
    excerpt_fa: "برگر از لوبیا، قارچ، بیت‌روت — طعم اصیل بدون گوشت",
    excerpt_sv: "Burger av bönor, svamp, rödbeta — äkta smak utan kött",
    ...body("برگر گیاهی خانگی", "Hemgjord växtbaserad burger"),
    formTemplateId: 57001n,
    icon: "Sandwich", imageUrl: img("plant-burger", 800, 600), hasRegistration: true, sortOrder: 3n, createdAt: ts(42),
  },
  {
    id: 52024n, topicId: 51005n, slug: "vegan-desserts",
    title_fa: "دسرهای وگان", title_sv: "Veganska desserter",
    excerpt_fa: "موس شکلات آووکادو، کیک خرمای خام، بستنی موزی",
    excerpt_sv: "Avokadochokladmousse, rå dadeltårta, bananglass",
    ...body("دسرهای وگان", "Veganska desserter"),
    icon: "IceCream", imageUrl: img("vegan-dessert", 800, 600), hasRegistration: false, sortOrder: 4n, createdAt: ts(37),
  },
  {
    id: 52025n, topicId: 51005n, slug: "seasonal-plant-cooking",
    title_fa: "آشپزی فصلی گیاهی", title_sv: "Säsongsbaserad växtmatlagning",
    excerpt_fa: "استفاده از سبزیجات فصل برای ایجاد وعده‌های متنوع و اقتصادی",
    excerpt_sv: "Använda säsongens grönsaker för varierade och prisvärda måltider",
    ...body("آشپزی فصلی گیاهی", "Säsongsbaserad växtmatlagning"),
    formTemplateId: 57002n,
    icon: "Leaf", imageUrl: img("seasonal-plant", 800, 600), hasRegistration: true, sortOrder: 5n, createdAt: ts(32),
  },
];

export const mockSlides: HeroSlideReturn[] = [
  { id: 53001n, topicId: 51001n, imageUrl: img("slide-italian-1", 1920, 800), title_fa: "ایتالیا را در آشپزخانه بچشید", title_sv: "Smaka på Italien i köket", subtitle_fa: "پاستا، پیتزا، ریزوتو", subtitle_sv: "Pasta, pizza, risotto", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/italian", sortOrder: 1n },
  { id: 53002n, topicId: 51001n, imageUrl: img("slide-italian-2", 1920, 800), title_fa: "پاستای دست‌ساز", title_sv: "Handgjord pasta", subtitle_fa: "طعمی که یادت می‌ماند", subtitle_sv: "En smak du aldrig glömmer", ctaText_fa: "کلاس جدید", ctaText_sv: "Ny klass", ctaLink: "/topics/italian/pasta-from-scratch", sortOrder: 2n },
  { id: 53003n, topicId: 51002n, imageUrl: img("slide-baking-1", 1920, 800), title_fa: "عطر نان تازه در خانه", title_sv: "Doften av nybakat bröd hemma", subtitle_fa: "کلاس‌های نانوایی هر هفته", subtitle_sv: "Bakkurser varje vecka", ctaText_fa: "شروع کنید", ctaText_sv: "Börja", ctaLink: "/topics/baking", sortOrder: 1n },
  { id: 53004n, topicId: 51002n, imageUrl: img("slide-baking-2", 1920, 800), title_fa: "شیرینی‌پزی فرانسوی", title_sv: "Franska konditorier", subtitle_fa: "کراسان، اکلر، ماکارون", subtitle_sv: "Croissanter, éclairs, macarons", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/baking/french-pastry", sortOrder: 2n },
  { id: 53005n, topicId: 51003n, imageUrl: img("slide-street-1", 1920, 800), title_fa: "سفر طعمی دور دنیا", title_sv: "Smakresa runt världen", subtitle_fa: "غذای خیابانی از ۶ قاره", subtitle_sv: "Gatumat från 6 kontinenter", ctaText_fa: "کشف کنید", ctaText_sv: "Utforska", ctaLink: "/topics/street-food", sortOrder: 1n },
  { id: 53006n, topicId: 51003n, imageUrl: img("slide-street-2", 1920, 800), title_fa: "شب تاکو با طعم مکزیک", title_sv: "Tacokvällen med mexikansk smak", subtitle_fa: "ترتیلا دست‌ساز + سالسای تازه", subtitle_sv: "Handgjorda tortillas + färsk salsa", ctaText_fa: "رزرو جای", ctaText_sv: "Boka plats", ctaLink: "/topics/street-food/taco-night", sortOrder: 2n },
  { id: 53007n, topicId: 51004n, imageUrl: img("slide-ferment-1", 1920, 800), title_fa: "هنر باستانی تخمیر", title_sv: "Fermenteringens uråldriga konst", subtitle_fa: "کیمچی، کامبوچا، ترشی‌های سنتی", subtitle_sv: "Kimchi, kombucha, traditionella pickles", ctaText_fa: "یاد بگیرید", ctaText_sv: "Lär dig", ctaLink: "/topics/fermentation", sortOrder: 1n },
  { id: 53008n, topicId: 51004n, imageUrl: img("slide-ferment-2", 1920, 800), title_fa: "کامبوچا خانگی", title_sv: "Hemlagad kombucha", subtitle_fa: "سالم، خوشمزه، ارزان", subtitle_sv: "Hälsosamt, gott, prisvärt", ctaText_fa: "کارگاه", ctaText_sv: "Workshop", ctaLink: "/topics/fermentation/kombucha-brewing", sortOrder: 2n },
  { id: 53009n, topicId: 51005n, imageUrl: img("slide-plant-1", 1920, 800), title_fa: "گیاهی باشید با لذت", title_sv: "Var vegetarisk med glädje", subtitle_fa: "غذاهایی که دلت می‌خواهد هر روز بخوری", subtitle_sv: "Mat du vill äta varje dag", ctaText_fa: "کشف کنید", ctaText_sv: "Utforska", ctaLink: "/topics/plant-based", sortOrder: 1n },
  { id: 53010n, topicId: 51005n, imageUrl: img("slide-plant-2", 1920, 800), title_fa: "پروتئین بدون گوشت", title_sv: "Protein utan kött", subtitle_fa: "توفو، تمپه، سیتان", subtitle_sv: "Tofu, tempeh, seitan", ctaText_fa: "ثبت‌نام", ctaText_sv: "Registrera", ctaLink: "/topics/plant-based/vegan-protein", sortOrder: 2n },
];

export const mockAbout: AboutContentReturn = {
  headerImageUrl: img("casaverde-about", 1920, 600),
  body_fa: `<h2>درباره Casa Verde</h2><p>کازا ورده یک مدرسه آشپزی است که باور دارد غذا بیشتر از تغذیه است — غذا زبان عشق، ارتباط و فرهنگ است.</p><h3>فلسفه ما</h3><p>ما از مواد اولیه محلی، تازه و فصلی استفاده می‌کنیم. هر کلاس یک سفر حسی است؛ از انتخاب مواد تا پختن تا لذت بردن مشترک از میز.</p><h3>محیط ما</h3><p>آشپزخانه‌های مجهز ما با ظرفیت ۱۲ نفر، فضایی صمیمی و آموزشی فراهم می‌کنند.</p>`,
  body_sv: `<h2>Om Casa Verde</h2><p>Casa Verde är en matlagningsskola som tror att mat är mer än näring — mat är kärlekens, kontaktens och kulturens språk.</p><h3>Vår filosofi</h3><p>Vi använder lokala, färska och säsongsbetonade råvaror. Varje klass är en sensorisk resa från val av ingredienser till tillagning till gemensam njutning vid bordet.</p><h3>Vår miljö</h3><p>Våra välbundna kök med kapacitet för 12 personer erbjuder en intim och pedagogisk miljö.</p>`,
};

export const mockContactMessages: ContactMessageReturn[] = [
  { id: 54001n, name: "Clara Svensson", email: "clara.s@example.com", phone: "+46701234567", message: "Hej! Kan man boka hela köket för ett privat evenemang?", createdAt: ts(3) },
  { id: 54002n, name: "Mehdi Karimi", email: "mehdi.k@example.com", phone: "+46709988776", message: "آیا برای کودکان هم کلاسی دارید؟", createdAt: ts(8) },
  { id: 54003n, name: "Louise Berg", email: "louise.b@example.com", phone: "+46703344556", message: "Är det möjligt att ha presentkort?", createdAt: ts(14) },
  { id: 54004n, name: "Nadia Rahimi", email: "nadia.r@example.com", phone: "+46706655443", message: "آیا کلاس‌های آنلاین هم دارید؟", createdAt: ts(20) },
  { id: 54005n, name: "Tobias Ek", email: "tobias.e@example.com", phone: "+46708877665", message: "Är maten vegetarisk anpassad i alla klasser?", createdAt: ts(26) },
];

export const mockSocialLinks: SocialLinkReturn[] = [
  { id: 55001n, platform: "instagram", url: "https://instagram.com/casaverde_kitchen", sortOrder: 1n },
  { id: 55002n, platform: "facebook", url: "https://facebook.com/casaverde.kitchen", sortOrder: 2n },
  { id: 55003n, platform: "youtube", url: "https://youtube.com/@casaverdekitchen", sortOrder: 3n },
  { id: 55004n, platform: "website", url: "https://casaverde.se", sortOrder: 4n },
  { id: 55005n, platform: "email", url: "mailto:laga@casaverde.se", sortOrder: 5n },
];

export const mockRegistrations: RegistrationReturn[] = [
  {
    id: 56001n, activityId: 52001n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Emma Larsson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "emma.l@example.com" },
      { fieldId: 3n, fieldLabel: "Matlagningsnivå / سطح", value: "Nybörjare — mindre än ett år" },
      { fieldId: 4n, fieldLabel: "Glutenintolerans / حساسیت گلوتن", value: "Nej" },
      { fieldId: 5n, fieldLabel: "Allergier / آلرژی", value: "Allergisk mot nötter." },
    ],
    createdAt: ts(2),
  },
  {
    id: 56002n, activityId: 52011n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Fatima Andersson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "fatima.a@example.com" },
      { fieldId: 3n, fieldLabel: "Antal / تعداد", value: "3" },
      { fieldId: 4n, fieldLabel: "Kostval / رژیم", value: "Vegetarian" },
    ],
    createdAt: ts(5),
  },
  { id: 56003n, activityId: 52002n, name: "Oskar Nilsson", email: "oskar.n@example.com", phone: "+46701239876", message: "Älskar pizza, vill lära mig göra äkta napolitansk!", fieldValues: [], createdAt: ts(8) },
  {
    id: 56004n, activityId: 52016n, name: "", email: "", phone: "", message: "",
    fieldValues: [
      { fieldId: 1n, fieldLabel: "Namn / نام", value: "Sara Henriksson" },
      { fieldId: 2n, fieldLabel: "E-post / ایمیل", value: "sara.h@example.com" },
      { fieldId: 3n, fieldLabel: "Erfarenhet / تجربه", value: "Lite" },
      { fieldId: 4n, fieldLabel: "Kärl / ظرف", value: "Nej, jag köper från er" },
    ],
    createdAt: ts(11),
  },
  { id: 56005n, activityId: 52007n, name: "Isabelle Morin", email: "isabelle.m@example.com", phone: "+46705544332", message: "Jag har drömt om att lära mig göra croissanter hela livet!", fieldValues: [], createdAt: ts(15) },
];

export const mockFormTemplates: FormTemplateReturn[] = [
  {
    id: 57001n, name_fa: "ثبت‌نام کلاس آشپزی", name_sv: "Matlagningskursregistrering",
    description_fa: "فرم پایه برای ثبت‌نام در کلاس‌ها", description_sv: "Grundformulär för kursanmälan",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "textarea", label_fa: "آلرژی یا محدودیت غذایی", label_sv: "Allergier eller kostbegränsningar", placeholder_fa: "هر آلرژی یا محدودیت را بنویسید", placeholder_sv: "Ange eventuella allergier eller restriktioner", required: false, options: [], sortOrder: 3n },
    ],
    createdAt: ts(100),
  },
  {
    id: 57002n, name_fa: "ثبت‌نام کارگاه غذایی", name_sv: "Matworkshopregistrering",
    description_fa: "فرم برای کارگاه‌های تخصصی", description_sv: "Formulär för specialiserade matworkshops",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "select", label_fa: "سطح آشپزی", label_sv: "Matlagningsnivå", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "مبتدی", sv: "Nybörjare" }, { fa: "متوسط", sv: "Medel" }, { fa: "پیشرفته", sv: "Avancerad" }], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "رژیم غذایی", label_sv: "Kosthållning", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "همه‌چیزخور", sv: "Allätare" }, { fa: "گیاهخوار", sv: "Vegetarian" }, { fa: "وگان", sv: "Vegan" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "آلرژی‌ها", label_sv: "Allergier", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(95),
  },
  {
    id: 57003n, name_fa: "ثبت‌نام رویداد غذایی", name_sv: "Matevenemangregistrering",
    description_fa: "برای رویدادها و گردهمایی‌های غذایی", description_sv: "För matevenemang och matsamlingar",
    fields: [
      { id: 1n, fieldType: "text", label_fa: "نام", label_sv: "Namn", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 1n },
      { id: 2n, fieldType: "email", label_fa: "ایمیل", label_sv: "E-post", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 2n },
      { id: 3n, fieldType: "number", label_fa: "تعداد نفرات", label_sv: "Antal personer", placeholder_fa: "", placeholder_sv: "", required: true, options: [], sortOrder: 3n },
      { id: 4n, fieldType: "radio", label_fa: "رژیم غذایی", label_sv: "Kosthållning", placeholder_fa: "", placeholder_sv: "", required: true, options: [{ fa: "همه‌چیزخور", sv: "Allätare" }, { fa: "گیاهخوار", sv: "Vegetarian" }, { fa: "وگان", sv: "Vegan" }, { fa: "بدون گلوتن", sv: "Glutenfri" }], sortOrder: 4n },
      { id: 5n, fieldType: "textarea", label_fa: "آلرژی‌های مهم", label_sv: "Viktiga allergier", placeholder_fa: "", placeholder_sv: "", required: false, options: [], sortOrder: 5n },
    ],
    createdAt: ts(90),
  },
];
