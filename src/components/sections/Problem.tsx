import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";

type Item = { title: string; text: string };

const ICONS = [
  <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  <><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" /><path d="M18 3v4h-4M6 21v-4h4" /></>,
  <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  <><path d="M3 21h18M5 21V8l7-5 7 5v13" /><path d="M9 21v-6h6v6" /></>,
];

export default async function Problem() {
  const t = await getTranslations("problem");
  const items = t.raw("items") as Item[];
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-8 rounded-[28px] bg-tint px-5 py-10 sm:px-10 sm:py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:gap-14 md:rounded-[40px] lg:px-16">
          <div className="reveal flex flex-col gap-5">
            <span className="eyebrow">{t("eyebrow")}</span>
            <p className="font-display text-[clamp(28px,4vw,52px)] leading-[1.08] font-bold tracking-[-0.025em] text-balance">
              {t("questionStart")} <b className="text-orange">{t("questionHighlight")}</b>
            </p>
            <p className="text-lg text-ink-2">{t("text")}</p>
          </div>
          <ul className="reveal grid gap-3.5">
            {items.map((it, i) => (
              <li key={it.title} className="flex items-start gap-3.5 rounded-[18px] border border-line bg-white px-[18px] py-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 size-[22px] flex-none" aria-hidden>
                  {ICONS[i % ICONS.length]}
                </svg>
                <div>
                  <b className="block">{it.title}</b>
                  <span className="text-[15.5px] text-ink-2">{it.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
