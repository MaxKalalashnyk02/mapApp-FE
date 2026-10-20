"use client";

import { useEffect, useRef, useState } from "react";

const W = 424;
const H = 865;
const box = (x1: number, y1: number, x2: number, y2: number) => ({
  left: `${(x1 / W) * 100}%`,
  top: `${(y1 / H) * 100}%`,
  width: `${((x2 - x1) / W) * 100}%`,
  height: `${((y2 - y1) / H) * 100}%`,
});

const FIELDS = [
  { frame: box(37, 125, 387, 161), cover: box(45, 128, 380, 158), text: "Кав'ярня «Ранок»" },
  { frame: box(37, 209, 387, 295), cover: box(45, 214, 380, 290), text: "Свіжа випічка й кава з собою. Вхід з двору.", multiline: true },
  { frame: box(37, 495, 387, 532), cover: box(70, 498, 358, 529), text: "Буд. 3, секція 2" },
  { frame: box(37, 542, 387, 579), cover: box(45, 545, 380, 576), text: "+380 67 123 45 67" },
  { frame: box(37, 588, 387, 625), cover: box(45, 591, 380, 622), text: "ranok.coffee" },
];
const SAVE = box(37, 773, 387, 814);
const SCREEN = box(21, 16, 403, 848);

type Phase = "typing" | "press" | "done" | "reset";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function AddFormDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState<number[]>(() => FIELDS.map(() => 0));
  const [active, setActive] = useState(-1);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(FIELDS.map((f) => f.text.length));
      return;
    }

    let cancelled = false;
    let running = false;
    let visible = false;

    async function run() {
      running = true;
      while (!cancelled && visible) {
        setPhase("typing");
        setTyped(FIELDS.map(() => 0));
        await sleep(700);
        for (let i = 0; i < FIELDS.length && !cancelled; i++) {
          setActive(i);
          for (let c = 1; c <= FIELDS[i].text.length && !cancelled; c++) {
            setTyped((t) => t.map((v, j) => (j === i ? c : v)));
            await sleep(40 + Math.random() * 60);
          }
          await sleep(350);
        }
        setActive(-1);
        setPhase("press");
        await sleep(220);
        setPhase("done");
        await sleep(3400);
        setPhase("reset");
        await sleep(450);
      }
      running = false;
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !running) run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 text-[3.55cqw] leading-[1.3] text-ink">
      {FIELDS.map((f, i) => (
        <div key={i}>
          <div
            style={f.frame}
            className={`absolute rounded-[3.3cqw] outline-2 transition-[outline-color] duration-200 ${
              active === i ? "outline-orange" : "outline-transparent"
            }`}
          />
          {(typed[i] > 0 || active === i) && (
            <div
              style={f.cover}
              className={`absolute flex bg-white px-[1cqw] transition-opacity duration-300 ${
                f.multiline ? "items-start pt-[0.6cqw]" : "items-center"
              } ${phase === "reset" ? "opacity-0" : ""}`}
            >
              <span className={f.multiline ? "" : "truncate"}>
                {f.text.slice(0, typed[i])}
                {active === i && <span className="animate-caret ml-px inline-block h-[1.1em] w-[0.4cqw] translate-y-[0.15em] bg-orange" />}
              </span>
            </div>
          )}
        </div>
      ))}
      <div
        style={SAVE}
        className={`absolute rounded-[3.8cqw] transition duration-200 ${phase === "press" ? "scale-95 bg-black/15" : "bg-transparent"}`}
      />
      <MapReveal open={phase === "done"} />
    </div>
  );
}

function MapReveal({ open }: { open: boolean }) {
  return (
    <div style={SCREEN} className="absolute overflow-hidden rounded-[12cqw] [clip-path:inset(0_round_12cqw)]">
      <div
        className={`absolute inset-0 transition-[translate,visibility] duration-500 ease-[cubic-bezier(.25,.9,.3,1)] ${open ? "visible translate-x-0" : "invisible translate-x-full"}`}
      >
        <div
          style={{ backgroundImage: "url(/screens/map-v3.png)", width: "111.54%", height: "104.54%", left: "-5.77%", top: "-2.27%" }}
          className="absolute bg-[length:100%_100%]"
        />

        <div className="absolute top-[57%] left-[55%] -translate-x-1/2 -translate-y-full">
          <div
            className={`absolute bottom-[calc(100%+1.5cqw)] left-1/2 -translate-x-1/2 rounded-[3cqw] bg-white px-[2.6cqw] py-[1.6cqw] text-center whitespace-nowrap shadow-[0_2cqw_5cqw_-1cqw_rgba(60,30,10,.35)] transition duration-400 delay-[1100ms] ${
              open ? "translate-y-0 opacity-100" : "translate-y-[2cqw] opacity-0"
            }`}
          >
            <b className="block text-[3.3cqw] leading-tight text-ink">Кав'ярня «Ранок»</b>
            <span className="text-[2.7cqw] font-semibold text-orange-deep">Новий · Буд. 3, секція 2</span>
          </div>
          <div
            className={`relative transition duration-500 delay-[650ms] ease-[cubic-bezier(.3,1.6,.5,1)] ${
              open ? "translate-y-0 opacity-100" : "-translate-y-[10cqw] opacity-0"
            }`}
          >
            <span className={`absolute inset-0 rounded-full bg-orange/40 ${open ? "animate-ping" : ""}`} />
            <span className="relative grid size-[10cqw] place-items-center rounded-full border-[0.8cqw] border-orange bg-white text-[5cqw] shadow-[0_1.5cqw_3cqw_rgba(60,30,10,.3)]">☕</span>
            <span className="absolute top-full left-1/2 -mt-[0.6cqw] size-[2.4cqw] -translate-x-1/2 rotate-45 bg-orange" />
          </div>
        </div>
      </div>
    </div>
  );
}
