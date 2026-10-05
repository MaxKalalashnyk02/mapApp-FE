import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LEGAL_SLUGS } from "@/config/legal";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", ...LEGAL_SLUGS.map((s) => `/${s}`)];
  return routing.locales.flatMap((locale) =>
    paths.map((p) => ({
      url: `${site.url}${locale === routing.defaultLocale ? "" : `/${locale}`}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.5,
    })),
  );
}
