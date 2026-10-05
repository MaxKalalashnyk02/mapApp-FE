import { getLocale, getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";
import { rich } from "@/lib/rich";
import { getSiteVars } from "@/lib/vars";

export default async function About() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const vars = await getSiteVars(locale);
  return (
    <section id="about" className="pb-10 sm:pb-16">
      <Container className="grid gap-4 md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] md:gap-14">
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} />
        <div className="flex flex-col gap-3.5 text-lg text-ink-2">
          <p>{rich(t.raw("p1") as string, vars)}</p>
          <p>{t("p2")}</p>
        </div>
      </Container>
    </section>
  );
}
