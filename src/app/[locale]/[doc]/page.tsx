import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import Container from "@/components/ui/Container";
import LegalDoc, { type Block } from "@/components/legal/LegalDoc";
import { LEGAL_DOCS, LEGAL_SLUGS, type LegalSlug } from "@/config/legal";
import { site } from "@/config/site";
import { getSiteVars } from "@/lib/vars";

type Params = Promise<{ locale: string; doc: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((doc) => ({ doc }));
}

const isSlug = (s: string): s is LegalSlug => s in LEGAL_DOCS;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!isSlug(doc) || !hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "legal.docs" });
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return {
    title: t(`${LEGAL_DOCS[doc]}.title`),
    alternates: { canonical: `${prefix}/${doc}`, languages: { uk: `/${doc}`, en: `/en/${doc}` } },
  };
}

export default async function LegalPage({ params }: { params: Params }) {
  const { locale, doc } = await params;
  if (!isSlug(doc) || !hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("legal");
  const vars = await getSiteVars(locale);
  const key = LEGAL_DOCS[doc];
  const blocks = t.raw(`docs.${key}.blocks`) as Block[];
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(site.effectiveDate));

  return (
    <main>
      <Container className="pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="grid items-start gap-5 md:grid-cols-[240px_minmax(0,1fr)] md:gap-14">
          <nav aria-label={t("navLabel")} className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1.5 md:sticky md:top-[92px] md:mx-0 md:flex-col md:overflow-visible md:px-0">
            {LEGAL_SLUGS.map((s) => (
              <Link
                key={s}
                href={`/${s}`}
                aria-current={s === doc ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2.5 text-[15px] font-medium whitespace-nowrap ${
                  s === doc ? "bg-orange text-white" : "text-ink-2 hover:bg-tint"
                }`}
              >
                {t(`docs.${LEGAL_DOCS[s]}.title`)}
              </Link>
            ))}
          </nav>

          <article className="min-w-0 max-w-[740px]">
            <Link href="/" className="mb-6 inline-flex text-[15px] font-semibold text-orange-deep">{t("back")}</Link>
            <h1 className="mb-3.5 text-[clamp(30px,4vw,46px)] font-bold">{t(`docs.${key}.title`)}</h1>
            <div className="mb-7 flex flex-wrap gap-x-5 gap-y-1 border-b border-line pb-6 font-mono text-[13px] text-ink-3">
              <span>{t("effective", { date })}</span>
              <span>{t("updated", { date })}</span>
            </div>
            <LegalDoc blocks={blocks} vars={vars} />
          </article>
        </div>
      </Container>
    </main>
  );
}
