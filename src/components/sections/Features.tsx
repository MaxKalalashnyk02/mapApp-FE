import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";
import { AddScreen, FreshScreen, MapScreen, NotifyScreen, SearchScreen } from "@/components/phones/Screens";

const ITEMS = [
  { key: "map", screen: <MapScreen /> },
  { key: "add", screen: <AddScreen /> },
  { key: "fresh", screen: <FreshScreen /> },
  { key: "search", screen: <SearchScreen /> },
  { key: "notify", screen: <NotifyScreen /> },
] as const satisfies readonly { key: string; screen: ReactNode }[];

export default async function Features() {
  const t = await getTranslations("features");
  return (
    <section id="features" className="pt-6 pb-16 sm:pb-24">
      <Container>
        <SectionHead eyebrow={t("eyebrow")} title={t("title")} text={t("text")} className="mb-8 sm:mb-12" />
        {ITEMS.map(({ key, screen }, i) => {
          const ticks = t.raw(`items.${key}.ticks`) as string[];
          const rev = i % 2 === 1;
          return (
            <article
              key={key}
              className={`group reveal grid items-center gap-7 py-10 md:grid-cols-2 md:gap-16 md:py-14 ${i ? "border-t border-line" : ""}`}
            >
              <div className={`flex min-w-0 flex-col gap-4 ${rev ? "md:order-2" : ""}`}>
                <span className="eyebrow">{t(`items.${key}.eyebrow`)}</span>
                <h3 className="text-[clamp(24px,2.8vw,36px)] font-bold">{t(`items.${key}.title`)}</h3>
                <p className="max-w-[32em] text-[17.5px] text-ink-2">{t(`items.${key}.text`)}</p>
                <ul className="tick-list mt-1.5 grid gap-2.5">{ticks.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
              <div className="relative grid min-w-0 place-items-center md:min-h-[560px]">
                <div aria-hidden className="absolute aspect-square w-[78%] max-w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-tint-2),transparent_70%)]" />
                {screen}
              </div>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
