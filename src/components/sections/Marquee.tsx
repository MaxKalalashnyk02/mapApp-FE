import { getTranslations } from "next-intl/server";

export default async function Marquee() {
  const t = await getTranslations();
  const cats = t.raw("categories") as string[];
  const row = [...cats, ...cats];
  return (
    <div aria-hidden className="overflow-hidden py-3">
      <div className="-mx-5 my-4 -rotate-[1.2deg] overflow-hidden bg-orange py-4 text-white">
        <div className="flex w-max animate-marquee gap-10 font-display text-lg font-bold whitespace-nowrap sm:text-xl">
          {row.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-10 after:size-2.5 after:rounded-full after:bg-white/70 after:content-['']">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
