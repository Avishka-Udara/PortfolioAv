/**
 * Viewport-sized captures at a series of scroll offsets — readable, and it
 * lets scroll-triggered animations actually play before the shot.
 *
 *   node scripts/frames.mjs <url> <name> [width] [height] [maxFrames]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const [, , url, name, w = "1440", h = "900", max = "8"] = process.argv;
const OUT = path.resolve(process.env.SHOT_DIR || "shots");
fs.mkdirSync(OUT, { recursive: true });

const width = +w;
const height = +h;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(3400);

const total = await page.evaluate(() => document.body.scrollHeight);
const steps = Math.min(+max, Math.max(1, Math.ceil(total / height)));

for (let i = 0; i < steps; i++) {
  const y = Math.min(i * height, total - height);
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await page.waitForTimeout(1400);
  await page.evaluate(async () => {
    document.querySelectorAll("img[loading=lazy]").forEach((el) => (el.loading = "eager"));
    await Promise.all(
      [...document.images].filter((im) => !im.complete).map((im) => new Promise((r) => { im.onload = im.onerror = r; }))
    );
  });
  await page.waitForTimeout(900);
  const file = path.join(OUT, `${name}-${String(i).padStart(2, "0")}.png`);
  await page.screenshot({ path: file });
  const bad = await page.evaluate(() => {
    const im = [...document.images];
    return im.filter((i) => i.complete && i.naturalWidth === 0).length;
  });
  console.log(`  ${path.basename(file)}  y=${y}  broken=${bad}`);
}

console.log(errors.length ? `\n  errors: ${[...new Set(errors)].slice(0, 4).join(" | ")}` : "\n  no console errors");
await browser.close();
