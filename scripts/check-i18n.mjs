import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../messages/", import.meta.url);
const base = "uk";
const load = (l) => JSON.parse(readFileSync(new URL(`${l}.json`, dir), "utf8"));
const paths = (o, p = "") =>
  o && typeof o === "object"
    ? Object.entries(o).flatMap(([k, v]) => paths(v, p ? `${p}.${k}` : k))
    : [p];

const ref = new Set(paths(load(base)));
let failed = false;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== `${base}.json`)) {
  const l = f.replace(".json", "");
  const cur = new Set(paths(load(l)));
  const missing = [...ref].filter((k) => !cur.has(k));
  const extra = [...cur].filter((k) => !ref.has(k));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`✗ ${l}: missing ${missing.length}, extra ${extra.length}`);
    missing.forEach((k) => console.error(`  - missing ${k}`));
    extra.forEach((k) => console.error(`  + extra   ${k}`));
  } else console.log(`✓ ${l}: ${cur.size} keys match ${base}`);
}
process.exit(failed ? 1 : 0);
