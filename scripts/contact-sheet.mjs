/** Contact sheet of every video poster, written into public/ so it shares the dev server origin. */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const media = JSON.parse(fs.readFileSync("src/generated/media.json", "utf8"));
const vids = Object.entries(media)
  .filter(([, m]) => m.kind === "video")
  .map(([k, m]) => ({ k, m }));

const cells = vids
  .map(
    (v, i) => `<figure>
      <img src="${v.m.poster}" alt="">
      <figcaption><b>${i + 1}. ${v.k.replace(/\.\w+$/, "")}</b><span>${v.m.width}×${v.m.height} · ${v.m.duration}s</span></figcaption>
    </figure>`
  )
  .join("");

const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b0b0e;font:12px/1.3 ui-monospace,monospace;color:#eee;padding:14px}
  .g{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
  figure{margin:0}
  img{width:100%;aspect-ratio:16/10;object-fit:cover;background:#000;border:1px solid #26262e;border-radius:6px;display:block}
  figcaption{margin-top:5px;font-size:10.5px;word-break:break-all;line-height:1.25}
  figcaption span{color:#8a8a96;display:block}
</style><div class="g">${cells}</div>`;

const sheetPath = path.join("public", "__sheet.html");
fs.writeFileSync(sheetPath, html);

const out = path.resolve(process.env.SHOT_DIR || "shots");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:5173/__sheet.html", { waitUntil: "load" });
await page.evaluate(async () => {
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
});
await page.waitForTimeout(1500);
const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
const file = path.join(out, "contact-sheet.png");
await page.screenshot({ path: file, fullPage: true });
console.log(`${file}  broken=${broken}`);
await browser.close();
fs.rmSync(sheetPath, { force: true });
