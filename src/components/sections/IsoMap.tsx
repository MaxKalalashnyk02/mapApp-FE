"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { COMPLEXES, LAYOUTS, type ComplexId } from "@/config/complexes";

type Pin = { name: string; where: string; status: string };

const PinIcon = () => (
  <svg viewBox="0 0 30 40" aria-hidden="true">
    <path d="M15 1C7.3 1 1.5 6.8 1.5 14.2 1.5 24 15 39 15 39s13.5-15 13.5-24.8C28.5 6.8 22.7 1 15 1z" fill="#FF6B1A" stroke="#fff" strokeWidth="2" />
    <circle cx="15" cy="14" r="5.2" fill="#fff" />
  </svg>
);

function trees(w: number, h: number) {
  const cols = Math.max(2, Math.round(w / 28)), rows = Math.max(2, Math.round(h / 28));
  const out: [number, number][] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      out.push([((c + 0.5) * w) / cols - 7 + (r % 2 ? 5 : -3), ((r + 0.5) * h) / rows - 7]);
  return out;
}

export default function IsoMap() {
  const t = useTranslations("map");
  const tc = useTranslations("complexes");
  const [complex, setComplex] = useState<ComplexId>(COMPLEXES[0].id);
  const cfg = COMPLEXES.find((c) => c.id === complex)!;
  const layout = LAYOUTS[cfg.layout];
  const pins = tc.raw(`items.${complex}.pins`) as Pin[];

  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [toast, setToast] = useState(0);
  const [swap, setSwap] = useState(false);
  const parkTrees = useMemo(() => trees(layout.park.w, layout.park.h), [layout]);

  useEffect(() => {
    const stage = stageRef.current, scene = sceneRef.current;
    if (!stage || !scene) return;
    const fit = () => {
      const s = Math.min(1.12, stage.clientWidth / 640, (stage.clientHeight - 56) / 500);
      scene.style.setProperty("--s", s.toFixed(3));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(-1);
    let i = 0;
    let iv: number | undefined;
    const to = window.setTimeout(() => {
      setActive(0);
      if (!reduce) iv = window.setInterval(() => { i = (i + 1) % pins.length; setActive(i); }, 3200);
    }, reduce ? 0 : 1900);
    return () => { clearTimeout(to); if (iv) clearInterval(iv); };
  }, [complex, pins.length]);

  useEffect(() => {
    if (active < 0) return;
    setSwap(true);
    const tm = window.setTimeout(() => { setToast(active); setSwap(false); }, 280);
    return () => clearTimeout(tm);
  }, [active, complex]);

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

  const p = pins[Math.min(toast, pins.length - 1)];

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label={tc("choose")}>
        <span className="hidden flex-none font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3 2xl:inline">{tc("choose")}</span>
        {COMPLEXES.map((c) => {
          const on = c.id === complex;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setComplex(c.id)}
              className={`flex flex-none items-center gap-2 rounded-full border py-2 pr-3.5 pl-2.5 text-sm font-semibold whitespace-nowrap transition ${
                on ? "border-orange bg-orange text-white shadow-[0_10px_24px_-12px_rgba(255,107,26,.8)]" : "border-line bg-white text-ink hover:border-orange-soft"
              }`}
            >
              <span className={`size-2 rounded-full ${on ? "bg-white" : "bg-ok"}`} />
              {tc(`items.${c.id}.name`)}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${on ? "bg-white/25" : "bg-tint text-orange-deep"}`}>
                {tc(c.badge)}
              </span>
            </button>
          );
        })}
        <a href="#complexes" className="flex-none rounded-full border border-dashed border-orange-soft px-3.5 py-2 text-sm font-semibold whitespace-nowrap text-orange-deep hover:bg-tint">
          {tc("yours")}
        </a>
      </div>

      <div ref={stageRef} role="img" aria-label={`${t("aria")}: ${tc(`items.${complex}.name`)}`} className="relative h-[340px] sm:h-[440px] lg:h-[520px]">
        <div ref={sceneRef} className="iso-scene">
          <div key={complex} className="iso-plane">
            {layout.roads.map((r, i) => (
              <div key={i} className={`iso-road ${r.dir}`} style={{ left: r.x, top: r.y, width: r.w, height: r.h }} />
            ))}
            <svg className="iso-route" viewBox="0 0 440 440" aria-hidden="true"><path d={layout.route} /></svg>
            <div className="iso-park" style={{ left: layout.park.x, top: layout.park.y, width: layout.park.w, height: layout.park.h }}>
              {parkTrees.map(([l, tp], i) => <i key={i} className="iso-tree" style={{ left: l, top: tp }} />)}
            </div>
            {layout.buildings.map(([x, y, w, d, h, biz], i) => (
              <div
                key={i}
                className={`iso-b${biz ? " biz" : ""}`}
                style={{ left: x, top: y, width: w, height: d, "--h": `${h}px`, "--i": i } as CSSProperties}
              >
                <i className="s" /><i className="w" /><i className="t" />
              </div>
            ))}
            {pins.map((pin, i) => {
              const [x, y, w, d, h] = layout.buildings[layout.pinBuildings[i % layout.pinBuildings.length]];
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
          className="absolute right-0 bottom-0 z-[3] flex max-w-[260px] animate-rise-in items-center gap-3 rounded-[18px] border border-line bg-white p-2.5 pr-3 shadow-[0_24px_40px_-20px_rgba(120,40,0,.35)] [animation-delay:1.8s] sm:right-[2%] sm:bottom-[10%] sm:max-w-[290px] sm:p-3 sm:pr-4 lg:bottom-[2%]"
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
    </div>
  );
}
