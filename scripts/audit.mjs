/**
 * Audit: which media.json keys are referenced by projects, which fall through
 * to the archive, and which project media keys fail to resolve at all.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const media = JSON.parse(await fs.readFile(path.join(ROOT, "src", "generated", "media.json"), "utf8"));
const keys = Object.keys(media);

// pull every quoted path out of projects.ts media arrays
const src = await fs.readFile(path.join(ROOT, "src", "data", "projects.ts"), "utf8");
const referenced = [...src.matchAll(/"([A-Za-z0-9_\-./ ]+\.(?:png|jpg|jpeg|webp|mp4|gif|mov))"/g)].map((m) => m[1]);

const refSet = new Set(referenced);
const used = keys.filter((k) => refSet.has(k));
const missing = [...refSet].filter((k) => !media[k]);

// same logic as archiveGroups
const FOLDER_LABELS = {
  companies_and_NGO_i_works_with: "Client logos",
  Designings: "Packaging & mockups",
  Graphics: "Graphics & campaigns",
  Logos_png: "Logos",
  "2D": "2D animation",
  "3D": "3D & CGI",
};
const groups = {};
for (const k of keys) {
  if (refSet.has(k)) continue;
  const [folder, ...rest] = k.split("/");
  const base = FOLDER_LABELS[folder] ?? folder.replace(/_/g, " ");
  const label = rest.length > 1 ? `${base} — ${rest[0].replace(/_/g, " ")}` : base;
  (groups[label] ??= []).push(k);
}

console.log(`media.json entries : ${keys.length}`);
console.log(`referenced in code : ${referenced.length} (${new Set(referenced).size} unique)`);
console.log(`resolved to project : ${used.length}`);
console.log(`archive (unused)   : ${keys.length - used.length}`);
console.log(`\n-- project keys that do NOT resolve (${missing.length}) --`);
for (const m of missing) console.log("   x", m);
console.log(`\n-- archive groups --`);
for (const [label, arr] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`   ${arr.length.toString().padStart(3)}  ${label}`);
}
