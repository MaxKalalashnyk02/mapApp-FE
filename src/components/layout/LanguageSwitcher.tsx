"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { uk: "UA", en: "EN" };

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div role="group" aria-label={t("language")} className={`inline-flex rounded-full bg-tint p-1 ${pending ? "opacity-60" : ""} ${className}`}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          onClick={() =>
            start(() => {
              // @ts-expect-error -- pathname and params always match the current route
              router.replace({ pathname, params }, { locale: l, scroll: false });
            })
          }
          className={`rounded-full px-3 py-1.5 text-[13px] font-semibold transition ${
            l === locale ? "bg-white text-orange-deep shadow-sm" : "text-ink-2 hover:text-ink"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
