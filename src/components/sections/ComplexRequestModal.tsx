"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import FormModal, { fieldCls, labelCls } from "@/components/ui/FormModal";
import AddressField from "@/components/ui/AddressField";

const CTA_CLS =
  "mt-auto inline-flex self-start rounded-full bg-orange px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-deep";

export default function ComplexRequestModal({ trigger, triggerClassName = CTA_CLS }: { trigger?: ReactNode; triggerClassName?: string }) {
  const t = useTranslations("complexes.request.form");
  const tr = useTranslations("complexes.request");
  return (
    <FormModal
      endpoint="/api/complex-request"
      ns="complexes.request.form"
      trigger={trigger ?? tr("cta")}
      triggerClassName={triggerClassName}
    >
      <label className={labelCls}>
        {t("complex")} *
        <input name="complex" required maxLength={120} placeholder={t("complexPh")} className={fieldCls} />
      </label>
      <AddressField />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          {t("name")} *
          <input name="name" required maxLength={80} autoComplete="name" className={fieldCls} />
        </label>
        <label className={labelCls}>
          {t("contact")} *
          <input
            name="contact"
            required
            maxLength={64}
            autoComplete="tel"
            pattern="(\+?[0-9\s\-\(\)]{10,20})|((https?://)?(t\.me/)?@?[A-Za-z0-9_]{5,32})"
            title={t("contactPh")}
            placeholder={t("contactPh")}
            className={fieldCls}
          />
        </label>
      </div>
      <label className={labelCls}>
        {t("comment")}
        <textarea name="comment" rows={3} maxLength={1000} placeholder={t("commentPh")} className={`${fieldCls} resize-none`} />
      </label>
    </FormModal>
  );
}
