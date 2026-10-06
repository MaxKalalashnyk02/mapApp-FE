import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import StoreBadges from "@/components/ui/StoreBadges";
import IsoMap from "./IsoMap";

type Fact = { value: string; label: string };

export default async function Hero() {
  const t = await getTranslations("hero");
  const facts = t.raw("facts") as Fact[];
  const stagger = ["", "[animation-delay:80ms]", "[animation-delay:160ms]", "[animation-delay:240ms]", "[animation-delay:320ms]"];

  return (
    <div id="download" data-hero className="relative overflow-hidden pt-7 pb-6 sm:pt-12 sm:pb-10">
      <div aria-hidden className="pointer-events-none absolute -top-20 -right-36 size-[620px] animate-blob rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(255,140,60,.38),rgba(255,107,26,.12)_45%,transparent_70%)] blur-[10px]" />
      <div aria-hidden className="dots-bg pointer-events-none absolute inset-0" />

      <Container className="relative grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <span className={`inline-flex animate-rise-in items-center gap-2 self-start rounded-full border border-line bg-tint py-[7px] pr-3.5 pl-2 text-sm font-medium ${stagger[0]}`}>
            <i className="grid size-[22px] place-items-center rounded-full bg-orange">
              <i className="size-2 animate-blink rounded-full bg-white" />
            </i>
            {t("chip")}
          </span>

          <h1 className={`animate-rise-in text-[clamp(32px,4.4vw,58px)] font-extrabold ${stagger[1]}`}>
            {t("titleStart")}{" "}
            <span className="relative whitespace-nowrap text-orange">
              {t("titleHighlight")}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true" className="absolute -bottom-[0.18em] left-[-2%] h-[0.36em] w-[104%] overflow-visible">
                <path d="M4 14 C 70 4, 150 4, 296 12" className="animate-draw" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="420" />
              </svg>
            </span>
          </h1>

          <p className={`max-w-[34em] animate-rise-in text-lg text-ink-2 sm:text-[19px] ${stagger[2]}`}>{t("lede")}</p>

          <StoreBadges className={`animate-rise-in ${stagger[3]}`} />

          <div className={`grid animate-rise-in grid-cols-2 gap-x-7 gap-y-4 pt-1.5 sm:flex sm:flex-wrap ${stagger[4]}`}>
            {facts.map((f) => (
              <div key={f.value}>
                <b className="block font-display text-xl sm:text-[22px]">{f.value}</b>
                <span className="text-sm text-ink-3">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <IsoMap />
      </Container>
    </div>
  );
}
