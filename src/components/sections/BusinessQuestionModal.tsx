"use client";

import { useTranslations } from "next-intl";
import FormModal, { fieldCls, labelCls } from "@/components/ui/FormModal";

export default function BusinessQuestionModal({ trigger }: { trigger: string }) {
  const t = useTranslations("business.ask");
  return (
    <FormModal
      endpoint="/api/business-question"
      ns="business.ask"
      trigger={trigger}
      triggerClassName="rounded-full bg-tint px-5 py-3 font-semibold text-orange-deep hover:bg-tint-2"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          {t("name")} *
          <input name="name" required maxLength={80} autoComplete="name" className={fieldCls} />
        </label>
        <label className={labelCls}>
          {t("business")}
          <input name="business" maxLength={120} placeholder={t("businessPh")} className={fieldCls} />
        </label>
      </div>
      <label className={labelCls}>
        {t("contact")} *
        <input name="contact" required maxLength={120} placeholder={t("contactPh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("question")} *
        <textarea name="question" required rows={4} maxLength={2000} placeholder={t("questionPh")} className={`${fieldCls} resize-none`} />
      </label>
    </FormModal>
  );
}
