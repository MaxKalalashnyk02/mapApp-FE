import { getTranslations } from "next-intl/server";
import { ListItem, MButton, Phone, Pill, StatusBar } from "./Phone";

type Row = { name: string; text: string; badge?: string; dist?: string };
const PinGlyph = () => <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />;

export async function MapScreen() {
  const t = await getTranslations("screens.map");
  const tags = t.raw("tags") as string[];
  return (
    <Phone>
      <StatusBar />
      <div className="relative min-h-0 flex-1 bg-[#FFF8F3]">
        <svg viewBox="0 0 260 420" aria-hidden className="absolute inset-0 h-full w-full">
          <rect width="260" height="420" fill="#FFF8F3" />
          <rect x="0" y="190" width="260" height="26" fill="#FFE6D4" />
          <rect x="150" y="0" width="24" height="420" fill="#FFE6D4" />
          <g fill="#fff" stroke="#F2E1D3" strokeWidth="1.5">
            <rect x="16" y="20" width="56" height="150" rx="4" /><rect x="82" y="20" width="56" height="60" rx="4" />
            <rect x="186" y="20" width="60" height="70" rx="4" /><rect x="186" y="100" width="60" height="70" rx="4" />
            <rect x="16" y="232" width="122" height="60" rx="4" /><rect x="16" y="304" width="60" height="90" rx="4" />
            <rect x="186" y="232" width="60" height="160" rx="4" />
          </g>
          <rect x="82" y="92" width="56" height="78" rx="10" fill="#FFE9DA" />
          <path d="M44 203 H162 V262 H186" fill="none" stroke="#FF6B1A" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
          <g fill="#FF6B1A" stroke="#fff" strokeWidth="3">
            <circle cx="44" cy="100" r="9" /><circle cx="216" cy="135" r="9" /><circle cx="100" cy="262" r="9" /><circle cx="46" cy="350" r="9" />
          </g>
          <circle cx="216" cy="262" r="20" fill="#FF6B1A" opacity=".18" />
          <circle cx="216" cy="262" r="12" fill="#E0520A" stroke="#fff" strokeWidth="3" />
          <circle cx="44" cy="203" r="7" fill="#1C1410" stroke="#fff" strokeWidth="3" />
        </svg>
        <div className="absolute inset-x-2 bottom-2 flex flex-col gap-1.5 rounded-[22px] bg-white px-3.5 pt-3 pb-3.5 shadow-[0_-6px_30px_-10px_rgba(120,40,0,.3)]">
          <div className="h-1 w-9 self-center rounded bg-line" />
          <div className="flex items-center justify-between gap-2"><b className="text-sm">{t("name")}</b><Pill tone="green">{t("open")}</Pill></div>
          <span className="text-[11.5px] text-ink-3">{t("where")}</span>
          <div className="flex flex-wrap gap-2">{tags.map((x) => <Pill key={x}>{x}</Pill>)}<Pill tone="ghost">{t("walk")}</Pill></div>
          <div className="flex gap-1.5"><MButton className="flex-1">{t("route")}</MButton><MButton alt className="flex-1">{t("call")}</MButton></div>
        </div>
      </div>
    </Phone>
  );
}

export async function AddScreen() {
  const t = await getTranslations("screens.add");
  const cats = t.raw("cats") as string[];
  const field = "rounded-xl border-[1.5px] border-line px-2.5 py-2";
  return (
    <Phone>
      <StatusBar />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pt-1.5 pb-4">
        <div className="flex gap-1.5"><i className="h-1 flex-1 rounded bg-orange" /><i className="h-1 flex-1 rounded bg-orange" /><i className="h-1 flex-1 rounded bg-line" /></div>
        <span className="text-[11.5px] text-ink-3">{t("step")}</span>
        <div className="font-display text-[17px] leading-tight font-bold tracking-tight">{t("title")}</div>
        <div className={field}><small className="block text-[10px] text-ink-3">{t("nameLabel")}</small>{t("nameValue")}</div>
        <div className="flex flex-wrap gap-2">{cats.map((c, i) => <Pill key={c} tone={i === 0 ? "dark" : "ghost"}>{c}</Pill>)}</div>
        <div className="flex gap-2">
          <div className={`${field} flex-1`}><small className="block text-[10px] text-ink-3">{t("building")}</small>7</div>
          <div className={`${field} flex-1`}><small className="block text-[10px] text-ink-3">{t("section")}</small>1</div>
        </div>
        <div className={`${field} !border-orange shadow-[0_0_0_3px_var(--color-tint-2)]`}>
          <small className="block text-[10px] text-ink-3">{t("entrance")}</small>
          {t("entranceValue")}<span className="ml-px inline-block h-3 w-[1.5px] animate-caret bg-orange align-[-2px]" />
        </div>
        <div className="grid h-[62px] place-items-center rounded-xl border-[1.5px] border-dashed border-orange-soft bg-[repeating-linear-gradient(135deg,var(--color-tint)_0_8px,#fff_8px_16px)] text-[11px] font-semibold text-orange-deep">{t("photo")}</div>
        <MButton className="mt-auto">{t("next")}</MButton>
      </div>
    </Phone>
  );
}

export async function FreshScreen() {
  const t = await getTranslations("screens.fresh");
  const items = t.raw("items") as Row[];
  const pending: Row = { name: t("pendingItem.name"), text: t("pendingItem.text"), badge: t("pendingItem.badge") };
  const icons = [<><circle key="a" cx="12" cy="12" r="8" /><path key="b" d="M12 8v4l3 2" /></>, <path key="c" d="M5 12h14" />, <path key="d" d="M12 5v14M5 12h14" />];
  const tones = ["green", "orange", "dark"] as const;
  return (
    <Phone>
      <StatusBar />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pt-1.5 pb-4">
        <div className="font-display text-[17px] font-bold tracking-tight">{t("title")}</div>
        <span className="text-[11.5px] text-ink-3">{t("today")}</span>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => <ListItem key={it.name} icon={icons[i % 3]} title={it.name} text={it.text} right={<Pill tone={tones[i % 3]}>{it.badge}</Pill>} />)}
        </div>
        <span className="mt-1.5 text-[11.5px] text-ink-3">{t("pending")}</span>
        <ListItem icon={<PinGlyph />} title={pending.name} text={pending.text} right={<Pill tone="ghost">{pending.badge}</Pill>} />
        <div className="mt-auto flex gap-1.5"><MButton className="flex-1">{t("approve")}</MButton><MButton alt className="flex-1">{t("reject")}</MButton></div>
      </div>
    </Phone>
  );
}

export async function SearchScreen() {
  const t = await getTranslations("screens.search");
  const chips = t.raw("chips") as string[];
  const items = t.raw("items") as Row[];
  return (
    <Phone>
      <StatusBar time="21:15" />
      <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-4 pt-1.5 pb-4">
        <div className="flex items-center gap-2 rounded-xl bg-tint px-2.5 py-[9px] text-ink-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className="size-[15px]"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          {t("query")}
        </div>
        <div className="flex flex-wrap gap-2">{chips.map((c, i) => <Pill key={c} tone={i === 0 ? "dark" : "ghost"}>{c}</Pill>)}</div>
        <span className="text-[11.5px] text-ink-3">{t("count")}</span>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <div key={it.name} className={i === items.length - 1 ? "opacity-55" : ""}>
              <ListItem icon={<path d="M12 6v12M6 12h12" />} title={it.name} text={it.text} right={<span className="font-mono text-[10px] text-ink-3">{it.dist}</span>} />
            </div>
          ))}
        </div>
        <MButton alt className="mt-auto">{t("showOnMap")}</MButton>
      </div>
    </Phone>
  );
}

export async function NotifyScreen() {
  const t = await getTranslations("screens.notify");
  const items = t.raw("items") as { title: string; text: string }[];
  return (
    <Phone>
      <div className="flex flex-1 flex-col gap-2 bg-[linear-gradient(170deg,#FF8A45,#FF6B1A_45%,#E0520A)] px-2.5 pt-1.5 pb-4 text-white">
        <StatusBar time="" light />
        <div className="mt-3 text-center font-display text-[50px] leading-none font-bold tracking-[-0.04em]">8:30</div>
        <div className="mb-3 text-center font-medium opacity-90">{t("date")}</div>
        {items.map((n) => (
          <div key={n.title} className="flex gap-2.5 rounded-2xl bg-white/90 px-3 py-2.5 text-ink shadow-[0_8px_20px_-10px_rgba(0,0,0,.35)]">
            <div className="grid size-[30px] flex-none place-items-center rounded-[9px] bg-orange">
              <svg viewBox="0 0 24 24" fill="#fff" className="size-4"><path d="M12 3c-3.6 0-6.4 2.7-6.4 6.2 0 4.6 6.4 10.8 6.4 10.8s6.4-6.2 6.4-10.8C18.4 5.7 15.6 3 12 3z" /></svg>
            </div>
            <div><b className="block text-xs">{n.title}</b><span className="text-[11px] text-ink-2">{n.text}</span></div>
          </div>
        ))}
      </div>
    </Phone>
  );
}
