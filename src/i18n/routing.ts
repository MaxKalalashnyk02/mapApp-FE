import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en"],
  defaultLocale: "uk",
  // uk lives at "/", en at "/en"
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
