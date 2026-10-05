"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

export default function CopyField({ value, placeholder = false }: { value: string; placeholder?: boolean }) {
  const t = useTranslations("legal");
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const el = ref.current;
      if (!el) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  return (
    <div className="my-3.5 flex flex-wrap items-center gap-2.5">
      <code ref={ref} className={`rounded-xl border border-line bg-tint px-3.5 py-2.5 font-mono text-[15px] break-all text-ink select-all ${placeholder ? "ph" : ""}`}>
        {value}
      </code>
      <button type="button" onClick={copy} className="rounded-xl bg-ink px-4 py-[11px] text-sm font-semibold text-white">
        {copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
