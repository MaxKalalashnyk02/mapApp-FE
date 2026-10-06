"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Container from "@/components/ui/Container";
import { LogoMark } from "@/components/ui/Logo";
import TypingLogo from "@/components/ui/TypingLogo";
import LanguageSwitcher from "./LanguageSwitcher";

const SECTIONS = ["features", "business", "complexes", "how", "faq"] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-[env(safe-area-inset-top,0px)] z-50 border-b bg-white/85 backdrop-blur-xl backdrop-saturate-150 transition-colors ${
        scrolled || open ? "border-line" : "border-transparent"
      }`}
    >
      <Container className="flex h-[68px] items-center gap-6">
        <Link href="/" aria-label={t("homeAria")} className="flex items-center gap-2.5">
          <LogoMark />
          <TypingLogo />
        </Link>

        <nav aria-label={t("label")} className="ml-auto hidden items-center gap-7 text-[15px] font-medium xl:flex">
          {SECTIONS.map((s) => (
            <Link key={s} href={`/#${s}`} className="text-ink-2 transition-colors hover:text-orange-deep">
              {t(s)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-0">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <Link
            href="/#download"
            className="hidden rounded-full bg-orange px-[18px] py-[11px] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(255,107,26,.7)] transition hover:-translate-y-0.5 hover:bg-orange-deep sm:inline-flex"
          >
            {t("download")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="grid size-11 place-items-center rounded-full bg-tint xl:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-0.5 w-5 rounded bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </Container>
    </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-[calc(68px+env(safe-area-inset-top,0px))] bottom-0 z-40 overflow-y-auto border-t border-line bg-white xl:hidden"
      >
        <Container className="flex flex-col gap-2 py-6">
          {SECTIONS.map((s) => (
            <Link
              key={s}
              href={`/#${s}`}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-4 font-display text-2xl font-bold tracking-tight hover:bg-tint"
            >
              {t(s)}
            </Link>
          ))}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line px-4 pt-6">
            <LanguageSwitcher />
            <Link
              href="/#download"
              onClick={() => setOpen(false)}
              className="inline-flex rounded-full bg-orange px-6 py-3.5 font-semibold text-white"
            >
              {t("download")}
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
