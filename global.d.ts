import type { routing } from "@/i18n/routing";
import type messages from "./messages/uk.json";

/**
 * Typed translation keys based on messages/uk.json (autocomplete + compile-time checks).
 * next-intl key types don't traverse arrays, so arrays become leaf keys — read them with t.raw().
 * `npm run i18n:check` verifies every locale has exactly the same keys as uk.json.
 */
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
