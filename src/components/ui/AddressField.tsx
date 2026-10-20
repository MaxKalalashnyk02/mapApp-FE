"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Map as MapLibreMap } from "maplibre-gl";
import { fieldCls, labelCls } from "./FormModal";

const START = { lat: 50.5018, lng: 30.4148 };
const STYLE = "https://tiles.openfreemap.org/styles/liberty";

type Address = Record<string, string | undefined>;
type Suggestion = { label: string; place: string; lat: number; lng: number };

function formatAddress(a: Address) {
  const street = a.road || a.pedestrian || a.neighbourhood || a.suburb;
  return [street, a.house_number].filter(Boolean).join(", ");
}

type PhotonFeature = {
  geometry: { coordinates: [number, number] };
  properties: Record<string, string | undefined>;
};

function toSuggestion(f: PhotonFeature): Suggestion | null {
  const p = f.properties;
  if (p.countrycode !== "UA") return null;
  const street = p.street || p.name;
  if (!street) return null;
  const label = [street, p.housenumber].filter(Boolean).join(", ");
  const place = [p.city || p.town || p.village, p.district].filter(Boolean).join(", ");
  const [lng, lat] = f.geometry.coordinates;
  return { label, place, lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
}

export default function AddressField({ name = "address", required = true }: { name?: string; required?: boolean }) {
  const t = useTranslations("addressPicker");
  const locale = useLocale();
  const listId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const reqRef = useRef(0);
  const coordsRef = useRef(coords);
  coordsRef.current = coords;
  const skipLookupRef = useRef(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const searchRef = useRef<{ timer?: number; id: number }>({ id: 0 });

  const search = (q: string) => {
    window.clearTimeout(searchRef.current.timer);
    if (q.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    searchRef.current.timer = window.setTimeout(async () => {
      const id = ++searchRef.current.id;
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lat=${START.lat}&lon=${START.lng}&layer=house&layer=street`,
        );
        const data = await res.json();
        if (id !== searchRef.current.id) return;
        const list = (data.features as PhotonFeature[]).map(toSuggestion).filter((s): s is Suggestion => !!s);
        const seen = new Set<string>();
        setSuggestions(list.filter((s) => !seen.has(s.label + s.place) && seen.add(s.label + s.place)).slice(0, 5));
        setActive(-1);
      } catch {
        if (id === searchRef.current.id) setSuggestions([]);
      }
    }, 350);
  };

  const choose = (s: Suggestion) => {
    setValue(s.label);
    setSuggestions([]);
    setCoords({ lat: s.lat, lng: s.lng });
    skipLookupRef.current = true;
    mapRef.current?.jumpTo({ center: [s.lng, s.lat], zoom: 17 });
  };

  useEffect(() => {
    if (!open || !boxRef.current) return;
    let cancelled = false;
    let timer: number | undefined;

    const lookup = async (lat: number, lng: number) => {
      const id = ++reqRef.current;
      setBusy(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&lat=${lat}&lon=${lng}&accept-language=${locale === "en" ? "en" : "uk"}`,
        );
        const data = await res.json();
        if (id !== reqRef.current) return;
        const text = data?.address ? formatAddress(data.address) : "";
        if (text) setValue(text);
      } catch {
      } finally {
        if (id === reqRef.current) setBusy(false);
      }
    };

    import("maplibre-gl").then(({ Map, NavigationControl }) => {
      if (cancelled || !boxRef.current) return;
      const start = coordsRef.current ?? START;
      const map = new Map({
        container: boxRef.current,
        style: STYLE,
        center: [start.lng, start.lat],
        zoom: 16,
        attributionControl: { compact: true },
      });
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.on("moveend", () => {
        const c = map.getCenter();
        const next = { lat: +c.lat.toFixed(6), lng: +c.lng.toFixed(6) };
        setCoords(next);
        window.clearTimeout(timer);
        if (skipLookupRef.current) {
          skipLookupRef.current = false;
          return;
        }
        timer = window.setTimeout(() => void lookup(next.lat, next.lng), 450);
      });
      map.once("load", () => {
        const label =
          locale === "en"
            ? ["coalesce", ["get", "name:en"], ["get", "name:latin"], ["get", "name"]]
            : ["coalesce", ["get", "name:uk"], ["get", "name"]];
        for (const layer of map.getStyle().layers) {
          if (layer.type !== "symbol") continue;
          const field = map.getLayoutProperty(layer.id, "text-field");
          if (field && JSON.stringify(field).includes("name")) map.setLayoutProperty(layer.id, "text-field", label);
        }
        map.resize();
        map.fire("moveend");
      });
      mapRef.current = map;
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      reqRef.current++;
      setBusy(false);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [open, locale]);

  return (
    <div className="flex flex-col gap-2">
      <label className={labelCls}>
        {t("label")} {required && "*"}
        <span className="relative block">
          <input
            name={name}
            required={required}
            maxLength={200}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setCoords(null);
              search(e.target.value);
            }}
            onKeyDown={(e) => {
              if (!suggestions.length) return;
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const step = e.key === "ArrowDown" ? 1 : -1;
                setActive((i) => (i + step + suggestions.length) % suggestions.length);
              } else if (e.key === "Enter" && active >= 0) {
                e.preventDefault();
                choose(suggestions[active]);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setSuggestions([]);
              }
            }}
            onBlur={() => window.setTimeout(() => setSuggestions([]), 150)}
            autoComplete="qmap-street-search"
            data-1p-ignore
            data-lpignore="true"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            placeholder={t("placeholder")}
            className={`${fieldCls} ${value ? "pr-24" : "pr-14"}`}
          />
          {value && (
            <button
              type="button"
              onClick={(e) => {
                setValue("");
                setCoords(null);
                setSuggestions([]);
                (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement | null)?.focus();
              }}
              aria-label={t("clear")}
              title={t("clear")}
              className="absolute top-1/2 right-[3.25rem] grid size-8 -translate-y-1/2 place-items-center rounded-full text-lg leading-none text-ink-3 hover:bg-tint hover:text-ink"
            >
              ×
            </button>
          )}
          {suggestions.length > 0 && (
            <ul
              id={listId}
              role="listbox"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-2xl border border-line bg-white py-1.5 font-normal shadow-[0_20px_40px_-20px_rgba(60,30,10,.45)]"
            >
              {suggestions.map((s, i) => (
                <li key={`${s.label}-${s.place}-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(s)}
                    className={`flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-left text-[15px] ${i === active ? "bg-tint" : "hover:bg-tint"}`}
                  >
                    <span className="text-ink">{s.label}</span>
                    {s.place && <span className="flex-none text-xs text-ink-3">{s.place}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={t("openMap")}
            title={t("openMap")}
            className={`absolute top-1/2 right-1.5 grid size-10 -translate-y-1/2 place-items-center rounded-xl transition ${
              open ? "bg-orange text-white" : "bg-tint text-orange-deep hover:bg-tint-2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </button>
        </span>
      </label>

      {coords && <input type="hidden" name="latitude" value={coords.lat} />}
      {coords && <input type="hidden" name="longitude" value={coords.lng} />}

      {open && (
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="relative h-64 bg-tint">
            <div ref={boxRef} className="h-full w-full" />
            <svg
              viewBox="0 0 30 40"
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 z-10 w-8 -translate-x-1/2 -translate-y-full drop-shadow-md"
            >
              <path d="M15 1C7.3 1 1.5 6.8 1.5 14.2 1.5 24 15 39 15 39s13.5-15 13.5-24.8C28.5 6.8 22.7 1 15 1z" fill="#FF6B1A" stroke="#fff" strokeWidth="2" />
              <circle cx="15" cy="14" r="5.2" fill="#fff" />
            </svg>
          </div>
          <div className="flex items-center justify-between gap-3 bg-tint px-3.5 py-2.5 text-sm">
            <span className="text-ink-2">{busy ? t("finding") : t("hint")}</span>
            <button type="button" onClick={() => setOpen(false)} className="flex-none rounded-full bg-orange px-4 py-1.5 font-semibold text-white hover:bg-orange-deep">
              {t("done")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
