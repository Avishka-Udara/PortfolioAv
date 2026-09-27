/**
 * Interaction QA for the new features. Runs in headless Chromium (rAF works
 * there, unlike an occluded desktop tab), so it can verify the 3D viewer
 * actually paints and the capabilities anchor actually lands.
 *
 *   node scripts/verify.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://127.0.0.1:5173";
const results = {};

async function settle(page, ms = 1600) {
  await page.waitForTimeout(ms);
}

async function newPage(ctx, url) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 300)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 300)));
  await page.goto(BASE + url, { waitUntil: "load" });
  await settle(page, 3000);
  return { page, errors };
}

async function section(name, fn) {
  try {
    await fn();
  } catch (e) {
    results[name] = { FAILED: String(e).slice(0, 220) };
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  reducedMotion: "no-preference",
});

/* ----------------------------------------------------------------- 3D --- */
await section("3d-viewer", async () => {
  const { page, errors } = await newPage(ctx, "/work/token-coin-cgi");
  // click the thumbnail badged "3D" for the small coin.obj (BBA_coin poster)
  const clicked = await page.evaluate(() => {
    const badges = [...document.querySelectorAll("span")].filter((s) => s.textContent.trim() === "3D");
    const target = badges.find((b) => {
      const img = b.closest("button")?.querySelector("img");
      return img && img.src.includes("BBA_coin");
    });
    if (target) { target.closest("button").click(); return true; }
    badges[0]?.closest("button").click();
    return !!badges.length;
  });

  // wait for the canvas to appear and the model to load
  await page.waitForFunction(
    () => {
      const d = document.querySelector("[role=dialog]");
      if (!d) return false;
      const c = d.querySelector("canvas");
      if (!c || c.width < 300) return false;
      return ![...d.querySelectorAll("span")].some((s) => s.textContent.includes("Loading"));
    },
    { timeout: 30000 }
  );
  await settle(page, 2500);

  const probe = await page.evaluate(() => {
    const d = document.querySelector("[role=dialog]");
    const c = d.querySelector("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    const w = c.width, h = c.height;
    const buf = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
    let nonBg = 0, bright = 0, samples = 0;
    for (let i = 0; i < buf.length; i += 4 * 41) {
      const r = buf[i], g = buf[i + 1], b = buf[i + 2];
      if (Math.abs(r - 12) + Math.abs(g - 12) + Math.abs(b - 16) > 45) nonBg++;
      if (r + g + b > 430) bright++;
      samples++;
    }
    return {
      counter: d.querySelectorAll("p")[1]?.textContent,
      canvas: `${w}x${h}`,
      nonBgPct: Math.round((nonBg / samples) * 100),
      brightPct: Math.round((bright / samples) * 100),
    };
  });
  await page.screenshot({ path: "shots/verify-3d.png" });
  results["3d-viewer"] = { clicked, ...probe, errors };
  await page.close();
});

/* ------------------------------------------------------- capabilities --- */
await section("capabilities", async () => {
  const { page, errors } = await newPage(ctx, "/work");
  await page.evaluate(() => {
    const a = [...document.querySelectorAll("a")].find((x) => x.textContent.includes("Capabilities"));
    a?.click();
  });
  await settle(page, 3500);
  const landed = await page.evaluate(() => {
    const el = document.getElementById("capabilities");
    return {
      url: location.href,
      hasSection: !!el,
      sectionTop: el ? Math.round(el.getBoundingClientRect().top) : null,
      scrollY: Math.round(window.scrollY),
      innerHeight: window.innerHeight,
    };
  });
  await page.screenshot({ path: "shots/verify-capabilities.png" });
  results["capabilities"] = { ...landed, errors };
  await page.close();
});

/* ------------------------------------------------- work grid + sets ----- */
await section("work-grid", async () => {
  const { page, errors } = await newPage(ctx, "/work");
  const grid = await page.evaluate(() => {
    const setTiles = [...document.querySelectorAll("button")]
      .filter((b) => /pieces in this set/.test(b.textContent || ""))
      .map((b) => b.textContent.trim().slice(0, 50));
    const cards = document.querySelectorAll("article").length;
    return { cards, setTiles };
  });
  await page.screenshot({ path: "shots/verify-work.png", fullPage: false });
  results["work-grid"] = { ...grid, errors };
  await page.close();
});

/* --------------------------------------------------------- logos hover -- */
await section("logos", async () => {
  const { page, errors } = await newPage(ctx, "/");
  // scroll to the client marquee
  await page.evaluate(() => {
    const sec = [...document.querySelectorAll("section")].find((s) =>
      /Trusted by brands/.test(s.textContent || "")
    );
    sec?.scrollIntoView();
  });
  await settle(page, 1200);
  // freeze the marquee so the tiles stop moving, then hover one
  await page.addStyleTag({ content: "* { animation-play-state: paused !important; }" });
  await settle(page, 400);
  const tile = await page.$(".group\\/logo");
  if (tile) await tile.hover();
  await settle(page, 900);
  await page.screenshot({ path: "shots/verify-logos.png" });
  const logoInfo = await page.evaluate(() => {
    const tiles = document.querySelectorAll(".group\\/logo");
    const first = tiles[0];
    return {
      tileCount: tiles.length,
      caption: first ? first.querySelector("span:last-child")?.textContent.trim() : null,
      haloOpacity: first ? window.getComputedStyle(first.querySelector("span")).opacity : null,
    };
  });
  results["logos"] = { ...logoInfo, errors };
  await page.close();
});

/* -------------------------------------------------- floating drive CTA --- */
await section("fab", async () => {
  const routes = ["/", "/work", "/about", "/contact", "/work/token-coin-cgi"];
  const found = {};
  for (const r of routes) {
    const { page, errors } = await newPage(ctx, r);
    found[r] = await page.evaluate(() => {
      const a = document.querySelector('a[aria-label*="Google Drive"]');
      if (!a) return null;
      const b = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        label: a.textContent.trim(),
        href: a.getAttribute("href"),
        target: a.target,
        rel: a.rel,
        bg: cs.backgroundColor,
        fixed: cs.position === "fixed",
        right: Math.round(innerWidth - b.right),
        bottom: Math.round(innerHeight - b.bottom),
        visible: b.width > 40 && b.height > 30,
        overflowX: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    if (r === "/work/token-coin-cgi") await page.screenshot({ path: "shots/verify-fab-desktop.png" });
    if (found[r]) found[r].errors = errors;
    await page.close();
  }
  results["fab"] = found;
});

/* the pill must float: its wrapper is fixed and it doesn't move on scroll */
await section("fab-fixed", async () => {
  const { page, errors } = await newPage(ctx, "/");
  const probe = await page.evaluate(() => {
    const a = document.querySelector('a[aria-label*="Google Drive"]');
    const wrap = a?.closest("div");
    const before = a.getBoundingClientRect();
    window.scrollTo(0, 2500);
    const after = a.getBoundingClientRect();
    return {
      wrapPosition: wrap ? getComputedStyle(wrap).position : null,
      staysPut: Math.abs(before.top - after.top) < 2,
      pulseRing: !!wrap?.querySelector("span.border-hot"),
    };
  });
  results["fab-fixed"] = { ...probe, errors };
  await page.close();
});

await section("fab-mobile", async () => {
  const mctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const { page, errors } = await newPage(mctx, "/");
  const info = await page.evaluate(() => {
    const a = document.querySelector('a[aria-label*="Google Drive"]');
    if (!a) return null;
    const b = a.getBoundingClientRect();
    return {
      label: a.textContent.trim(),
      fitsX: b.left >= 0 && b.right <= innerWidth,
      right: Math.round(innerWidth - b.right),
      bottom: Math.round(innerHeight - b.bottom),
      overflowX: document.documentElement.scrollWidth > innerWidth + 1,
    };
  });
  await page.screenshot({ path: "shots/verify-fab-mobile.png" });
  results["fab-mobile"] = { ...info, errors };
  await mctx.close();
});

await browser.close();
console.log(JSON.stringify(results, null, 2));
