export const AREA_KEY = "kanon-demo-area";
export const DEFAULT_AREA = "iranian-culture";

export const areaIds = [
  "iranian-culture",
  "yoga-wellness",
  "tech-hub",
  "music-arts",
  "nature-outdoors",
  "community-kitchen",
  "language-center",
  "sports-club",
  "kids-center",
  "photography-academy",
] as const;

export type AreaId = (typeof areaIds)[number];

export interface AreaMeta {
  id: AreaId;
  name_fa: string;
  name_sv: string;
  description_fa: string;
  description_sv: string;
  icon: string;
  color: string;
}

export const areaMetas: AreaMeta[] = [
  {
    id: "iranian-culture",
    name_fa: "کانون فرهنگی ایرانیان",
    name_sv: "Iransk Kulturförening",
    description_fa: "انجمن فرهنگی، آموزشی و ورزشی برای ایرانیان مقیم سوئد",
    description_sv: "Kultur-, utbildnings- och sportförening för iranier i Sverige",
    icon: "Flag",
    color: "text-emerald-400",
  },
  {
    id: "yoga-wellness",
    name_fa: "استودیو یوگا سرنیتی",
    name_sv: "Serenity Wellness Studio",
    description_fa: "استودیوی یوگا، مدیتیشن و تندرستی برای زندگی متعادل",
    description_sv: "Yoga-, meditationsstudio och välmåendecenter för ett balanserat liv",
    icon: "Flower2",
    color: "text-violet-400",
  },
  {
    id: "tech-hub",
    name_fa: "هاب فناوری کداسپیس",
    name_sv: "CodeSpace Tech Hub",
    description_fa: "مرکز یادگیری برنامه‌نویسی، علم داده و فناوری",
    description_sv: "Inlärningscenter för programmering, datavetenskap och teknik",
    icon: "Code2",
    color: "text-cyan-400",
  },
  {
    id: "music-arts",
    name_fa: "آکادمی هنر هارمونیا",
    name_sv: "Harmonia Arts Academy",
    description_fa: "آکادمی موسیقی، هنرهای بصری، رقص و آهنگسازی",
    description_sv: "Akademi för musik, visuell konst, dans och komposition",
    icon: "Music",
    color: "text-rose-400",
  },
  {
    id: "nature-outdoors",
    name_fa: "باشگاه ماجراجویی وایلدپث",
    name_sv: "WildPath Adventure Club",
    description_fa: "کوهنوردی، دوچرخه‌سواری، صخره‌نوردی و ورزش‌های آبی در طبیعت",
    description_sv: "Vandring, cykling, klättring och vattensporter i naturen",
    icon: "Mountain",
    color: "text-lime-400",
  },
  {
    id: "community-kitchen",
    name_fa: "مدرسه آشپزی کاسا ورده",
    name_sv: "Casa Verde Matskola",
    description_fa: "دوره‌های آشپزی، شیرینی‌پزی و تخمیر برای همه سطوح",
    description_sv: "Matkurser, bakning och fermentering för alla nivåer",
    icon: "ChefHat",
    color: "text-orange-400",
  },
  {
    id: "language-center",
    name_fa: "مرکز زبان لینگوا",
    name_sv: "Lingua Språkcenter",
    description_fa: "آموزش زبان‌های سوئدی، انگلیسی، اسپانیایی، ماندارین و زبان اشاره",
    description_sv: "Språkundervisning i svenska, engelska, spanska, mandarin och teckenspråk",
    icon: "Languages",
    color: "text-sky-400",
  },
  {
    id: "sports-club",
    name_fa: "باشگاه ویتافورس",
    name_sv: "VitaForce Sportklubb",
    description_fa: "فوتبال، تنیس، شنا، هنرهای رزمی و دویدن برای همه سنین",
    description_sv: "Fotboll, tennis, simning, kampsport och löpning för alla åldrar",
    icon: "Trophy",
    color: "text-red-400",
  },
  {
    id: "kids-center",
    name_fa: "مرکز کودکان وندرلند",
    name_sv: "Wonderland Barnaktiviteter",
    description_fa: "برنامه‌های خلاقانه، علمی و هنری برای کودکان ۳ تا ۱۴ ساله",
    description_sv: "Kreativa, vetenskapliga och konstnärliga program för barn 3–14 år",
    icon: "Star",
    color: "text-amber-400",
  },
  {
    id: "photography-academy",
    name_fa: "آکادمی عکاسی فریم",
    name_sv: "Frame Fotografi & Film",
    description_fa: "عکاسی پرتره، منظره، فیلم مستند و ویرایش تصویر",
    description_sv: "Porträttfotografi, landskap, dokumentärfilm och bildredigering",
    icon: "Camera",
    color: "text-slate-300",
  },
];

export const getActiveArea = (): AreaId => {
  if (typeof localStorage === "undefined") return DEFAULT_AREA as AreaId;
  const stored = localStorage.getItem(AREA_KEY);
  return (areaIds.includes(stored as AreaId) ? stored : DEFAULT_AREA) as AreaId;
};

export const setActiveArea = (id: AreaId): void => {
  localStorage.setItem(AREA_KEY, id);
};
