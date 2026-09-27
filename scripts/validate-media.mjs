/**
 * Validates that every media key referenced in projects.ts exists in the
 * generated index, and that every generated asset is used somewhere.
 *   node scripts/validate-media.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const index = JSON.parse(fs.readFileSync(path.join(root, "src/generated/media.json"), "utf8"));
const src = fs.readFileSync(path.join(root, "src/data/projects.ts"), "utf8");

const keys = new Set(Object.keys(index));
const referenced = new Set();

// project media arrays:  media: [ "a", "b", ... ]
for (const block of src.matchAll(/media:\s*\[([\s\S]*?)\]/g)) {
  for (const m of block[1].matchAll(/"([^"]+)"/g)) referenced.add(m[1]);
}

const missing = [...referenced].filter((k) => !keys.has(k));
const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const dupSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
const unused = [...keys].filter((k) => !referenced.has(k));

let bad = false;
if (missing.length) {
  bad = true;
  console.error(`\n  MISSING ${missing.length} media key(s):`);
  missing.forEach((k) => console.error(`    - "${k}"`));
  console.error(`\n  closest matches:`);
  for (const k of missing) {
    const leaf = k.split("/").pop().toLowerCase().replace(/\.\w+$/, "");
    const near = [...keys].filter((c) => c.toLowerCase().includes(leaf.split(/[\s_-]+/)[0] ?? "###"));
    console.error(`    "${k}" -> ${near.slice(0, 4).join("  |  ") || "(none)"}`);
  }
}
if (dupSlugs.length) {
  bad = true;
  console.error(`\n  DUPLICATE slugs: ${[...new Set(dupSlugs)].join(", ")}`);
}

console.log(`  projects referenced : ${referenced.size} media keys`);
console.log(`  total indexed       : ${keys.size}`);
console.log(`  unused (archive)    : ${unused.length}`);
if (unused.length) {
  console.log(`\n  archive items:`);
  const byGroup = {};
  for (const k of unused) (byGroup[k.split("/")[0]] ??= []).push(k);
  for (const [g, v] of Object.entries(byGroup).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`    ${String(v.length).padStart(3)}  ${g}`);
  }
}
console.log(bad ? "\n  FAILED\n" : "\n  OK\n");
process.exit(bad ? 1 : 0);
