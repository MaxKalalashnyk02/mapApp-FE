"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const KEY = "qm-cookie-notice";

export default function CookieNotice() {
  const t = useTranslations("cookieNotice");
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const close = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-[560px] animate-rise-in flex-col gap-3 rounded-[22px] border border-line bg-white p-4 shadow-[0_24px_50px_-24px_rgba(60,30,10,.45)] sm:bottom-5 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
    >
      <p className="flex-1 text-sm text-ink-2">
        <span aria-hidden className="mr-1.5">🍪</span>
        {t("text")}{" "}
        <Link href="/cookies" className="font-semibold text-orange-deep underline underline-offset-3 hover:text-orange">
          {t("more")}
        </Link>
      </p>
      <button
        type="button"
        onClick={close}
        className="flex-none self-start rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-deep sm:self-auto"
      >
        {t("ok")}
      </button>
    </div>
  );
}
