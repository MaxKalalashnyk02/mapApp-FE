import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { LogoMark, LogoText } from "@/components/ui/Logo";
import StoreBadges from "@/components/ui/StoreBadges";
import { LEGAL_DOCS, type LegalSlug } from "@/config/legal";
import { rich } from "@/lib/rich";
import { getSiteVars } from "@/lib/vars";

const DOC_LINKS: LegalSlug[] = ["privacy", "terms", "content-rules", "delete-account"];

export default async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("footer");
  const tl = await getTranslations("legal.docs");
  const vars = await getSiteVars(locale);

  return (
    <footer className="mt-10 border-t border-line bg-tint pt-14 pb-8">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 self-start">
              <LogoMark />
              <LogoText />
            </Link>
            <p className="max-w-[30em] text-[15px] text-ink-2">{t("tagline", { complex: vars.complex })}</p>
            <StoreBadges />
          </div>
          <div>
            <h4 className="mb-3.5 font-mono text-[12.5px] font-medium uppercase tracking-[0.1em] text-ink-3">{t("docs")}</h4>
            <ul className="grid gap-2.5">
              {DOC_LINKS.map((slug) => (
                <li key={slug}>
                  <Link href={`/${slug}`} className="font-medium hover:text-orange-deep">
                    {tl(`${LEGAL_DOCS[slug]}.title`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="mb-3.5 font-mono text-[12.5px] font-medium uppercase tracking-[0.1em] text-ink-3">{t("contacts")}</h4>
            <ul className="grid gap-2.5">
              <li><Link href="/support" className="font-medium hover:text-orange-deep">{t("support")}</Link></li>
              <li className="font-medium">{rich("{email}", vars)}</li>
              <li className="text-[15px] text-ink-2">{rich("{address}", vars)}</li>
            </ul>
          </div>
        </div>
        <div className="mt-11 flex flex-wrap justify-between gap-4 border-t border-line pt-5 text-sm text-ink-3">
          <span>© {new Date().getFullYear()} {rich("{company}", vars)}. {t("rights")}</span>
          <span>{t("trademarks")}</span>
        </div>
      </Container>
    </footer>
  );
}
