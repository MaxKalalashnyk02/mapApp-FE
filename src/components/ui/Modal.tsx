"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";

const CloseContext = createContext<() => void>(() => {});
export const useModalClose = () => useContext(CloseContext);

type Props = {
  trigger: ReactNode;
  triggerClassName: string;
  label: string;
  onOpen?: () => void;
  children: ReactNode;
};

export default function Modal({ trigger, triggerClassName, label, onOpen, children }: Props) {
  const t = useTranslations("modal");
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        className={triggerClassName}
        onClick={() => {
          onOpen?.();
          ref.current?.showModal();
        }}
      >
        {trigger}
      </button>

      <dialog
        ref={ref}
        aria-label={label}
        onClick={(e) => e.target === ref.current && close()}
        className="m-auto max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-32px))] overflow-y-auto rounded-[28px] bg-white p-0 text-ink shadow-[0_40px_80px_-30px_rgba(60,30,10,.5)] backdrop:bg-ink/45 backdrop:backdrop-blur-sm open:animate-rise-in"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-tint text-xl text-ink-2 hover:bg-tint-2"
          >
            ×
          </button>
          <CloseContext.Provider value={close}>{children}</CloseContext.Provider>
        </div>
      </dialog>
    </>
  );
}
