"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import Modal, { useModalClose } from "./Modal";

type Status = "idle" | "sending" | "sent" | "error";

export const fieldCls =
  "w-full rounded-2xl border border-line bg-white px-4 py-3 text-[15px] font-normal text-ink outline-none transition placeholder:text-ink-3 focus:border-orange focus:ring-4 focus:ring-orange/15";
export const labelCls = "flex flex-col gap-1.5 text-sm font-semibold";

type Props = {
  endpoint: string;
  ns: "complexes.request.form" | "business.request" | "business.ask" | "faq.ask";
  trigger: ReactNode;
  triggerClassName: string;
  children: ReactNode;
};

export default function FormModal({ endpoint, ns, trigger, triggerClassName, children }: Props) {
  const t = useTranslations(ns as "business.ask");
  const [status, setStatus] = useState<Status>("idle");

  return (
    <Modal
      trigger={trigger}
      triggerClassName={triggerClassName}
      label={t("title")}
      onOpen={() => status !== "sending" && setStatus("idle")}
    >
      {status === "sent" ? (
        <Sent title={t("sentTitle")} text={t("sentText")} done={t("done")} />
      ) : (
        <Form endpoint={endpoint} status={status} setStatus={setStatus} t={t}>
          {children}
        </Form>
      )}
    </Modal>
  );
}

function Sent({ title, text, done }: { title: string; text: string; done: string }) {
  const close = useModalClose();
  return (
    <div className="flex flex-col items-start gap-4 py-6">
      <span className="grid size-14 place-items-center rounded-2xl bg-[#E3F6EC] text-2xl text-ok">✓</span>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="text-ink-2">{text}</p>
      <button type="button" onClick={close} className="mt-2 rounded-full bg-orange px-5 py-3 font-semibold text-white hover:bg-orange-deep">
        {done}
      </button>
    </div>
  );
}

function Form({
  endpoint,
  status,
  setStatus,
  t,
  children,
}: {
  endpoint: string;
  status: Status;
  setStatus: (s: Status) => void;
  t: ReturnType<typeof useTranslations<"business.ask">>;
  children: ReactNode;
}) {
  const locale = useLocale();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="pr-10">
        <h3 className="text-2xl font-bold">{t("title")}</h3>
        <p className="mt-2 text-[15px] text-ink-2">{t("intro")}</p>
      </div>
      {children}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-[#FDECEC] px-4 py-3 text-sm text-[#B42318]">{t("error")}</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-full bg-orange px-5 py-3.5 font-semibold text-white transition hover:bg-orange-deep disabled:opacity-60"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
