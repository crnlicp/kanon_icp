import { getActiveArea } from "./areaStore";
import * as iranianCulture from "./areas/iranian-culture";
import * as yogaWellness from "./areas/yoga-wellness";
import * as techHub from "./areas/tech-hub";
import * as musicArts from "./areas/music-arts";
import * as natureOutdoors from "./areas/nature-outdoors";
import * as communityKitchen from "./areas/community-kitchen";
import * as languageCenter from "./areas/language-center";
import * as sportsClub from "./areas/sports-club";
import * as kidsCenter from "./areas/kids-center";
import * as photographyAcademy from "./areas/photography-academy";

const areaMap = {
  "iranian-culture": iranianCulture,
  "yoga-wellness": yogaWellness,
  "tech-hub": techHub,
  "music-arts": musicArts,
  "nature-outdoors": natureOutdoors,
  "community-kitchen": communityKitchen,
  "language-center": languageCenter,
  "sports-club": sportsClub,
  "kids-center": kidsCenter,
  "photography-academy": photographyAcademy,
} as const;

const active = areaMap[getActiveArea() as keyof typeof areaMap] ?? iranianCulture;

export const mockSettings = active.mockSettings;
export const mockTopics = active.mockTopics;
export const mockActivities = active.mockActivities;
export const mockSlides = active.mockSlides;
export const mockAbout = active.mockAbout;
export const mockContactMessages = active.mockContactMessages;
export const mockSocialLinks = active.mockSocialLinks;
export const mockRegistrations = active.mockRegistrations;
export const mockFormTemplates = active.mockFormTemplates;
