/**
 * Edit these values before submitting to App Store / Google Play.
 * Values that start with "[" are rendered as highlighted placeholders on the site.
 */
export const site = {
  app: "mapApp",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mapapp.example.com",
  company: "[Назва компанії або ФОП]",
  companyId: "[ЄДРПОУ / РНОКПП]",
  address: "[Юридична адреса, Київ, Україна]",
  email: "[support@ваш-домен.ua]",
  iosUrl: "", // https://apps.apple.com/app/id...
  androidUrl: "", // https://play.google.com/store/apps/details?id=...
  effectiveDate: "2026-10-05",
  minAge: 16,
} as const;

export const isPlaceholder = (v: unknown): boolean =>
  typeof v === "string" && v.trim().startsWith("[");
