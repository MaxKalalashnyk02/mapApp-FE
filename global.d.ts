import type { routing } from "@/i18n/routing";
import type messages from "./messages/uk.json";

type ArraysAsLeaves<T> = T extends readonly unknown[]
  ? string
  : T extends object
    ? { [K in keyof T]: ArraysAsLeaves<T[K]> }
    : T;

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: ArraysAsLeaves<typeof messages>;
  }
}
