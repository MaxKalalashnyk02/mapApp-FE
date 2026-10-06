import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Container from "@/components/ui/Container";

type Perk = { title: string; text: string };

const ICONS: ReactNode[] = [
  <><path d="M20 12v8H4v-8" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" /></>,
  <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9" r="2.5" /><path d="M16 14.2a5 5 0 0 1 5.5 4.8" /></>,
  <><path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  <><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" /></>,
  <><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 6-7" /></>,
  <><path d="M12 2l2.4 2.2 3.2-.4.8 3.1 2.8 1.6-1.2 3 1.2 3-2.8 1.6-.8 3.1-3.2-.4L12 22l-2.4-2.2-3.2.4-.8-3.1-2.8-1.6 1.2-3-1.2-3 2.8-1.6.8-3.1 3.2.4z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
];

async function Dashboard() {
  const t = await getTranslations("business.dash");
  const bars = [38, 52, 47, 66, 58, 74, 88, 81];
  const stats = [
    { label: t("views"), value: "1 248", delta: "+18%" },
    { label: t("routes"), value: "312", delta: "+9%" },
    { label: t("calls"), value: "57", delta: "+4%" },
  ];
  return (
    <div className="relative rounded-[28px] border border-line bg-white p-5 shadow-[0_40px_70px_-40px_rgba(120,40,0,.45)] sm:p-6">
      <span className="absolute -top-3 right-6 rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] text-white">{t("example")}</span>
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-xl bg-orange">
          <svg viewBox="0 0 24 24" fill="#fff" className="size-5"><path d="M12 3c-3.6 0-6.4 2.7-6.4 6.2 0 4.6 6.4 10.8 6.4 10.8s6.4-6.2 6.4-10.8C18.4 5.7 15.6 3 12 3z" /></svg>
        </div>
        <div className="min-w-0">
          <b className="flex items-center gap-2 text-[17px]">
            {t("title")}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E3F6EC] px-2 py-0.5 text-[11px] font-semibold text-ok">✓ {t("verified")}</span>
          </b>
          <span className="text-[13px] text-ink-3">{t("period")}</span>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-tint p-3">
            <span className="block text-[11.5px] leading-tight text-ink-2">{s.label}</span>
            <b className="mt-1 block font-display text-[clamp(18px,2.4vw,24px)] tabular-nums">{s.value}</b>
            <span className="text-xs font-semibold text-ok">{s.delta}</span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <span className="text-[12.5px] text-ink-3">{t("week")}</span>
        <div className="mt-2 flex h-28 items-end gap-2 border-b border-line">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-md ${i === bars.length - 2 ? "bg-orange" : "bg-orange-soft"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-orange-soft px-4 py-3">
        <span className="text-sm font-semibold">{t("promo")}</span>
        <span className="rounded-full bg-orange px-2.5 py-1 text-[11px] font-semibold text-white">{t("promoStatus")}</span>
      </div>
    </div>
  );
}

export default async function ForBusiness() {
  const t = await getTranslations("business");
  const perks = t.raw("perks") as Perk[];
  const steps = t.raw("steps") as string[];
  return (
    <section id="business" className="pb-16 sm:pb-24">
      <Container>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,var(--color-orange),#FF8C45_60%,#FFA466)] px-5 py-10 text-white sm:px-10 sm:py-14 md:rounded-[40px] lg:px-14">
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14">
            <div className="flex min-w-0 flex-col gap-4">
              <span className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-white/80">{t("eyebrow")}</span>
              <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold">{t("title")}</h2>
              <p className="max-w-[34em] text-lg text-white/90">{t("text")}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {perks.map((p, i) => (
                  <li key={p.title} className="reveal flex gap-3.5 rounded-[20px] border border-white/25 bg-white/12 p-4 backdrop-blur-sm">
                    <span className="grid size-10 flex-none place-items-center rounded-xl bg-white text-orange-deep">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>{ICONS[i % ICONS.length]}</svg>
                    </span>
                    <div className="min-w-0">
                      <b className="block text-[16.5px] leading-snug">{p.title}</b>
                      <span className="text-[14.5px] leading-snug text-white/85">{p.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-ink lg:sticky lg:top-28 lg:mt-10"><Dashboard /></div>
          </div>

          <div className="mt-10 flex flex-col gap-5 rounded-[24px] bg-white p-5 text-ink sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <b className="font-display text-xl">{t("stepsTitle")}</b>
              <div className="flex flex-wrap gap-2.5">
                <a href="#download" className="rounded-full bg-orange px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-deep">{t("cta")}</a>
                <Link href="/support" className="rounded-full bg-tint px-5 py-3 font-semibold text-orange-deep hover:bg-tint-2">{t("ctaAlt")}</Link>
              </div>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3 sm:gap-5">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-3 rounded-2xl bg-tint p-4 text-[15px] font-medium">
                  <span className="grid size-7 flex-none place-items-center rounded-full bg-orange font-display text-[13px] font-bold text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <p className="text-sm text-ink-3">{t("note")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
