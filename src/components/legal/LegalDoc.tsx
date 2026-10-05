import { isPlaceholder } from "@/config/site";
import { interpolate, rich, type Vars } from "@/lib/rich";
import CopyField from "./CopyField";

export type Block =
  | { type: "p" | "h2" | "h3" | "note"; text: string }
  | { type: "ul" | "steps"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "copy"; value: string };

export default function LegalDoc({ blocks, vars }: { blocks: Block[]; vars: Vars }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i} className="mt-3 text-ink-2 first:mt-0">{rich(b.text, vars)}</p>;
          case "h2":
            return <h2 key={i} className="mt-10 mb-3 text-[21px] font-bold">{rich(b.text, vars)}</h2>;
          case "h3":
            return <h3 key={i} className="mt-6 mb-2 font-body text-[17px] font-bold tracking-normal">{rich(b.text, vars)}</h3>;
          case "note":
            return <div key={i} className="my-5 rounded-[18px] border border-line bg-tint px-5 py-4 text-ink">{rich(b.text, vars)}</div>;
          case "ul":
            return (
              <ul key={i} className="my-2.5 grid list-disc gap-1.5 pl-5 text-ink-2 marker:text-orange">
                {b.items.map((it, j) => <li key={j}>{rich(it, vars)}</li>)}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="my-3 grid gap-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-3.5 text-ink-2">
                    <span className="mt-px grid size-7 flex-none place-items-center rounded-full bg-orange font-display text-[13px] font-bold text-white">{j + 1}</span>
                    <span>{rich(it, vars)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="my-4 overflow-x-auto rounded-[18px] border border-line">
                <table className="w-full min-w-[560px] border-collapse text-[15px]">
                  <thead>
                    <tr>{b.head.map((h) => <th key={h} className="border-b border-line bg-tint px-3.5 py-3 text-left font-semibold">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="[&:last-child>td]:border-0">
                        {r.map((c, k) => <td key={k} className="border-b border-line px-3.5 py-3 align-top text-ink-2">{rich(c, vars)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "copy": {
            const value = interpolate(b.value, vars);
            return <CopyField key={i} value={value} placeholder={isPlaceholder(value)} />;
          }
        }
      })}
    </>
  );
}
