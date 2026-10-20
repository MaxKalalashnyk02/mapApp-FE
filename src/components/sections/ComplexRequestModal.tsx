"use client";

import { useTranslations } from "next-intl";
import FormModal, { fieldCls, labelCls } from "@/components/ui/FormModal";

const ROLES = ["osbb", "management", "developer", "resident", "other"] as const;

export default function ComplexRequestModal() {
  const t = useTranslations("complexes.request.form");
  const tr = useTranslations("complexes.request");
  return (
    <FormModal
      endpoint="/api/complex-request"
      ns="complexes.request.form"
      trigger={tr("cta")}
      triggerClassName="mt-auto inline-flex self-start rounded-full bg-orange px-5 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-deep"
    >
      <label className={labelCls}>
        {t("complex")} *
        <input name="complex" required maxLength={120} placeholder={t("complexPh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("address")} *
        <input name="address" required maxLength={200} placeholder={t("addressPh")} className={fieldCls} />
      </label>
      <label className={labelCls}>
        {t("role")}
        <select name="role" defaultValue="resident" className={fieldCls}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{t(`roles.${r}`)}</option>
          ))}
        </select>
      </label>
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
        {t("comment")}
        <textarea name="comment" rows={3} maxLength={1000} placeholder={t("commentPh")} className={`${fieldCls} resize-none`} />
      </label>
    </FormModal>
  );
}
