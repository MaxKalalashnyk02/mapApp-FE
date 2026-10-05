export const site = {
  app: "mapApp",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mapapp.example.com",
  company: "[Назва компанії або ФОП]",
  companyId: "[ЄДРПОУ / РНОКПП]",
  address: "[Юридична адреса, Київ, Україна]",
  email: "[support@ваш-домен.ua]",
  iosUrl: "",
  androidUrl: "",
  effectiveDate: "2026-10-05",
  minAge: 16,
} as const;

export const isPlaceholder = (v: unknown): boolean =>
  typeof v === "string" && v.trim().startsWith("[");
