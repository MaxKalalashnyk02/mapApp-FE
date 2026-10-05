import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";

type Item = { label: string; text: string };

export default async function BusinessCta() {
  const t = await getTranslations("business");
  const items = t.raw("items") as Item[];
  return (
    <section id="business" className="pb-16 sm:pb-24">
      <Container>
        <div className="reveal grid items-center gap-10 rounded-[28px] bg-[linear-gradient(120deg,var(--color-orange),#FF8C45)] px-6 py-9 text-white sm:p-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:rounded-[40px]">
          <div>
            <h2 className="text-[clamp(28px,3.4vw,44px)] font-bold">{t("title")}</h2>
            <p className="mt-4 max-w-[30em] text-lg opacity-95">{t("text")}</p>
            <Link href="/support" className="mt-6 inline-flex rounded-full bg-white px-[22px] py-3.5 font-semibold text-orange-deep transition hover:-translate-y-0.5">
              {t("cta")}
            </Link>
          </div>
          <ul className="grid gap-3">
            {items.map((it) => (
              <li key={it.label} className="rounded-[18px] border border-white/30 bg-white/15 px-[18px] py-3.5 font-medium">
                <b className="block font-mono text-xs font-medium uppercase tracking-[0.08em] opacity-85">{it.label}</b>
                {it.text}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
