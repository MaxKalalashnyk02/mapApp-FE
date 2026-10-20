"use client";

import { useTranslations } from "next-intl";
import FormModal, { fieldCls, labelCls } from "@/components/ui/FormModal";

export default function FaqQuestionModal({ trigger }: { trigger: string }) {
  const t = useTranslations("faq.ask");
  return (
    <FormModal
      endpoint="/api/business-question"
      ns="faq.ask"
      trigger={trigger}
      triggerClassName="self-start rounded-full bg-orange px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-deep"
    >
      <input type="hidden" name="source" value="faq" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          {t("name")} *
          <input name="name" required maxLength={80} autoComplete="name" className={fieldCls} />
        </label>
        <label className={labelCls}>
          {t("contact")} *
          <input name="contact" required maxLength={120} placeholder={t("contactPh")} className={fieldCls} />
        </label>
      </div>
      <label className={labelCls}>
        {t("question")} *
        <textarea name="question" required rows={4} maxLength={2000} placeholder={t("questionPh")} className={`${fieldCls} resize-none`} />
      </label>
    </FormModal>
  );
}
