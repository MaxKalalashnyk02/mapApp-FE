import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";
import { rich } from "@/lib/rich";
import { getSiteVars } from "@/lib/vars";

type QA = { q: string; a: string };

export default async function Faq() {
  const locale = await getLocale();
  const t = await getTranslations("faq");
  const vars = await getSiteVars(locale);
  const items = t.raw("items") as QA[];
  return (
    <section id="faq" className="pb-16 sm:pb-24">
      <Container className="grid gap-4 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:gap-14">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} text={rich(t.raw("text") as string, vars)} />
        <div>
          {items.map((it) => (
            <details key={it.q} className="faq-item border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[17px] font-semibold sm:text-lg">
                {it.q}
                <span aria-hidden className="faq-plus grid size-7 flex-none place-items-center rounded-full bg-tint text-lg leading-none text-orange-deep transition-transform">+</span>
              </summary>
              <p className="max-w-[40em] pb-5 text-ink-2">{rich(it.a, vars)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
