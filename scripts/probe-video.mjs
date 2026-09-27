import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2] || "http://127.0.0.1:5173/", { waitUntil: "load" });
await page.waitForTimeout(3500);
const r = await page.evaluate(async () => {
  const v = document.querySelector("video");
  const out = {
    src: v?.getAttribute("src"),
    readyState: v?.readyState,
    networkState: v?.networkState,
    error: v?.error ? v.error.code : null,
    currentTime: v?.currentTime,
    paused: v?.paused,
    videoW: v?.videoWidth,
    videoH: v?.videoHeight,
    canPlay: v?.canPlayType('video/mp4; codecs="avc1.4d402a"'),
    rect: v ? { w: Math.round(v.getBoundingClientRect().width), h: Math.round(v.getBoundingClientRect().height) } : null,
  };
  // can the browser fetch the mp4 at all?
  try {
    const res = await fetch("/media/3D/an33.mp4", { headers: { Range: "bytes=0-1023" } });
    out.fetchStatus = res.status;
    out.fetchType = res.headers.get("content-type");
    out.acceptRanges = res.headers.get("accept-ranges");
    out.contentLength = res.headers.get("content-length");
  } catch (e) { out.fetchError = String(e); }
  return out;
});
console.log(JSON.stringify(r, null, 2));
await browser.close();
