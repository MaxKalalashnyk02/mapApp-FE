import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHead from "@/components/ui/SectionHead";

type Step = { title: string; text: string; time: string };

export default async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as Step[];
  return (
    <section id="how" className="pb-16 sm:pb-24">
      <Container>
        <div className="rounded-[28px] bg-ink px-5 py-12 text-white sm:px-10 sm:py-16 md:rounded-[40px] lg:px-16">
          <SectionHead dark eyebrow={t("eyebrow")} title={t("title")} text={t("text")} className="mb-10 sm:mb-12" />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal flex flex-col gap-2.5 rounded-[28px] border border-[#3A2C24] bg-ink-soft p-6">
                <span className="grid size-[38px] place-items-center rounded-full bg-orange font-display text-[15px] font-extrabold">{i + 1}</span>
                <b className="text-lg">{s.title}</b>
                <span className="text-[15.5px] text-[#CDBFB5]">{s.text}</span>
                <em className="mt-auto pt-1 font-mono text-xs not-italic text-orange-soft">{s.time}</em>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
