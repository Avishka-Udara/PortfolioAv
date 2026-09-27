/**
 * Visual QA: loads every route at phone / tablet / desktop widths, waits for
 * fonts, media and entrance animations to settle, then writes screenshots.
 *
 *   node scripts/shots.mjs [baseUrl] [outDir]
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://127.0.0.1:5173";
const OUT = path.resolve(process.argv[3] || "shots");
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;

const VIEWPORTS = [
  { name: "phone", width: 390, height: 844, dsf: 2, mobile: true },
  { name: "tablet", width: 834, height: 1112, dsf: 2, mobile: true },
  { name: "desktop", width: 1440, height: 900, dsf: 1, mobile: false },
];

const ROUTES = [
  { name: "home", url: "/", full: true },
  { name: "work", url: "/work", full: true },
  { name: "work-motion", url: "/work?f=motion", full: false },
  { name: "project", url: "/work/crypto-campaign", full: true },
  { name: "project-video", url: "/work/motion-social-reels", full: false },
  { name: "about", url: "/about", full: true },
  { name: "contact", url: "/contact", full: true },
  { name: "404", url: "/nope", full: false },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dsf,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    reducedMotion: "no-preference",
  });

  for (const route of ROUTES) {
    if (ONLY && !ONLY.includes(route.name)) continue;
    const page = await ctx.newPage();
    const logs = [];
    page.on("console", (m) => m.type() === "error" && logs.push(m.text().slice(0, 200)));
    page.on("pageerror", (e) => logs.push("PAGEERROR " + String(e).slice(0, 200)));

    await page.goto(BASE + route.url, { waitUntil: "load" });
    // let the preloader finish and entrance animations resolve
    await page.waitForTimeout(3200);
    // force any still-lazy media to load before capturing
    await page.evaluate(async () => {
      document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 900));
      window.scrollTo(0, 0);
      await Promise.all(
        [...document.images]
          .filter((i) => !i.complete)
          .map((i) => new Promise((r) => { i.onload = i.onerror = r; }))
      );
      await new Promise((r) => setTimeout(r, 700));
    });
    await page.waitForTimeout(500);

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;
      const broken = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"));
      // text that visually clips its own box
      const clipped = [];
      document.querySelectorAll("h1,h2,h3,p,span,a,dd,dt,li").forEach((el) => {
        if (el.children.length) return;
        if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === "hidden")
          clipped.push((el.innerText || "").slice(0, 40));
      });
      return { overflow, broken: broken.slice(0, 6), brokenCount: broken.length, clipped: clipped.slice(0, 6), pageHeight: de.scrollHeight };
    });

    const file = path.join(OUT, `${route.name}-${vp.name}.png`);
    await page.screenshot({ path: file, fullPage: route.full });

    const flag = metrics.overflow > 0 || metrics.brokenCount > 0 ? "FAIL" : " ok ";
    console.log(
      `${flag} ${route.name.padEnd(15)} ${vp.name.padEnd(8)} h=${String(metrics.pageHeight).padStart(6)} overflow=${metrics.overflow} broken=${metrics.brokenCount}` +
        (metrics.clipped.length ? ` clipped=${JSON.stringify(metrics.clipped)}` : "")
    );
    if (logs.length) console.log(`      console: ${logs.slice(0, 3).join(" | ")}`);
    if (metrics.overflow > 0 || metrics.brokenCount > 0) problems.push({ route: route.name, vp: vp.name, ...metrics });

    await page.close();
  }
  await ctx.close();
}

await browser.close();
console.log(problems.length ? `\n  ${problems.length} layout problem(s)\n` : "\n  all clean\n");
