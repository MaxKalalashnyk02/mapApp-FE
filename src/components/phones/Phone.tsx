import type { ReactNode } from "react";

/** Phone frame used for app screen mockups */
export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-[280/580] w-[min(280px,78vw)] rounded-[46px] bg-ink p-2.5 shadow-[0_50px_70px_-35px_rgba(120,40,0,.55),inset_0_0_0_2px_#3a2c24] transition duration-500 group-hover:-translate-y-2 group-hover:-rotate-[1.5deg]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[37px] bg-white text-xs leading-snug">
        <div className="absolute top-[9px] left-1/2 z-10 h-6 w-[84px] -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  );
}

export function StatusBar({ time = "9:41", light = false }: { time?: string; light?: boolean }) {
  return (
    <div className={`flex h-10 flex-none justify-between px-[22px] pt-3 text-[11.5px] font-semibold ${light ? "text-white" : ""}`}>
      <span>{time}</span>
      <span>●●● 5G</span>
    </div>
  );
}

type PillTone = "orange" | "green" | "dark" | "ghost";
const tones: Record<PillTone, string> = {
  orange: "bg-tint text-orange-deep",
  green: "bg-[#E3F6EC] text-ok",
  dark: "bg-ink text-white",
  ghost: "border border-line bg-white text-ink-2",
};
export function Pill({ children, tone = "orange" }: { children: ReactNode; tone?: PillTone }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-[5px] text-[10.5px] leading-none font-semibold ${tones[tone]}`}>{children}</span>;
}

export function MButton({ children, alt = false, className = "" }: { children: ReactNode; alt?: boolean; className?: string }) {
  return (
    <div className={`rounded-xl p-2.5 text-center text-[12.5px] font-semibold ${alt ? "bg-tint text-orange-deep" : "bg-orange text-white"} ${className}`}>
      {children}
    </div>
  );
}

export function ListItem({ icon, title, text, right }: { icon: ReactNode; title: string; text: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[14px] border border-line px-2.5 py-[9px]">
      <div className="grid size-[34px] flex-none place-items-center rounded-[10px] bg-tint">
        <svg viewBox="0 0 24 24" fill="none" stroke="#E0520A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">{icon}</svg>
      </div>
      <div className="min-w-0 flex-1">
        <b className="block truncate text-[12.5px]">{title}</b>
        <span className="text-[10.5px] text-ink-3">{text}</span>
      </div>
      {right}
    </div>
  );
}
