"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";

type Pin = { name: string; where: string; status: string };
const BUILDINGS: [number, number, number, number, number, boolean?][] = [
  [30, 30, 70, 150, 96], [110, 30, 120, 60, 72], [110, 110, 60, 70, 50],
  [300, 30, 110, 60, 118, true], [300, 110, 50, 70, 66], [365, 110, 45, 70, 84],
  [30, 255, 90, 60, 80, true], [30, 330, 60, 80, 58], [140, 255, 90, 150, 128],
  [300, 255, 110, 55, 72], [300, 325, 60, 85, 104, true], [370, 325, 40, 85, 50],
];
const PIN_BUILDINGS = [3, 6, 10, 0, 8];
const TREES = [[8, 10], [34, 18], [14, 40], [40, 48]];

const PinIcon = () => (
  <svg viewBox="0 0 30 40" aria-hidden="true">
    <path d="M15 1C7.3 1 1.5 6.8 1.5 14.2 1.5 24 15 39 15 39s13.5-15 13.5-24.8C28.5 6.8 22.7 1 15 1z" fill="#FF6B1A" stroke="#fff" strokeWidth="2" />
    <circle cx="15" cy="14" r="5.2" fill="#fff" />
  </svg>
);

export default function IsoMap() {
  const t = useTranslations("map");
  const pins = t.raw("pins") as Pin[];
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [toast, setToast] = useState(0);
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const stage = stageRef.current, scene = sceneRef.current;
    if (!stage || !scene) return;
    const fit = () => {
      const s = Math.min(1.12, stage.clientWidth / 640, stage.clientHeight / 520);
      scene.style.setProperty("--s", s.toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    let iv: number | undefined;
    const to = window.setTimeout(() => {
      setActive(0);
      if (!reduce) iv = window.setInterval(() => { i = (i + 1) % pins.length; setActive(i); }, 3200);
    }, reduce ? 0 : 2100);
    return () => { clearTimeout(to); if (iv) clearInterval(iv); };
  }, [pins.length]);

  useEffect(() => {
    if (active < 0) return;
    setSwap(true);
    const tm = window.setTimeout(() => { setToast(active); setSwap(false); }, 280);
    return () => clearTimeout(tm);
  }, [active]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = stageRef.current, scene = sceneRef.current;
    if (!stage || !scene) return;
    const host = (stage.closest("[data-hero]") as HTMLElement) ?? stage;
    let tx = 56, tz = -40, cx = 56, cz = -40, raf = 0;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tz = -40 + ((e.clientX - r.left) / r.width - 0.5) * 16;
      tx = 56 - ((e.clientY - r.top) / r.height - 0.5) * 10;
    };
    const leave = () => { tx = 56; tz = -40; };
    const loop = () => {
      cx += (tx - cx) * 0.07;
      cz += (tz - cz) * 0.07;
      scene.style.setProperty("--rx", cx.toFixed(2));
      scene.style.setProperty("--rz", cz.toFixed(2));
      raf = requestAnimationFrame(loop);
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  const p = pins[toast];

  return (
    <div ref={stageRef} role="img" aria-label={t("aria")} className="relative h-[360px] min-w-0 sm:h-[460px] lg:h-[560px]">
      <div ref={sceneRef} className="iso-scene">
        <div className="iso-plane">
          <div className="iso-road h" />
          <div className="iso-road v" />
          <svg className="iso-route" viewBox="0 0 440 440" aria-hidden="true"><path d="M60 218 H272 V300 H330" /></svg>
          <div className="iso-park">
            {TREES.map(([l, tp]) => <i key={`${l}-${tp}`} className="iso-tree" style={{ left: l, top: tp }} />)}
          </div>
          {BUILDINGS.map(([x, y, w, d, h, biz], i) => (
            <div
              key={i}
              className={`iso-b${biz ? " biz" : ""}`}
              style={{ left: x, top: y, width: w, height: d, "--h": `${h}px`, "--i": i } as CSSProperties}
            >
              <i className="s" /><i className="w" /><i className="t" />
            </div>
          ))}
          {pins.map((pin, i) => {
            const [x, y, w, d, h] = BUILDINGS[PIN_BUILDINGS[i % PIN_BUILDINGS.length]];
            return (
              <div
                key={i}
                className={`iso-anchor${active === i ? " on" : ""}`}
                style={{ left: x + w / 2, top: y + d / 2, "--h": `${h + 2}px`, "--i": i } as CSSProperties}
              >
                <i className="iso-ring" />
                <div className="iso-face">
                  <div className="iso-pin"><PinIcon /></div>
                  <div className="iso-tag">{pin.name}<em>● {pin.status}</em></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        aria-live="polite"
        className="absolute right-0 bottom-0 z-[3] flex max-w-[260px] animate-rise-in items-center gap-3 rounded-[18px] border border-line bg-white p-2.5 pr-3 shadow-[0_24px_40px_-20px_rgba(120,40,0,.35)] [animation-delay:1.8s] sm:right-[2%] sm:bottom-[16%] lg:bottom-[4%] sm:max-w-[290px] sm:p-3 sm:pr-4"
      >
        <div className="grid size-10 flex-none place-items-center rounded-xl bg-orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" className="size-[22px]"><path d="M12 5v14M5 12h14" /></svg>
        </div>
        <div className={`min-w-0 transition duration-300 ${swap ? "translate-y-1.5 opacity-0" : ""}`}>
          <small className="block font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-orange-deep">
            {toast % 2 ? t("updated") : t("justAdded")}
          </small>
          <b className="block text-[15px] leading-snug">{p.name}</b>
          <span className="text-[13px] leading-snug text-ink-3">{p.where}</span>
        </div>
      </div>
    </div>
  );
}
