import type { ReactNode } from "react";

export default function SectionHead({
  eyebrow, title, text, className = "", dark = false,
}: { eyebrow: string; title: string; text?: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={`flex max-w-[760px] flex-col gap-4 ${className}`}>
      <span className={`eyebrow ${dark ? "!text-orange-soft" : ""}`}>{eyebrow}</span>
      <h2 className="text-[clamp(28px,3.6vw,46px)] font-bold">{title}</h2>
      {text && <p className={`text-lg ${dark ? "text-[#D8CBC2]" : "text-ink-2"}`}>{text}</p>}
    </div>
  );
}
