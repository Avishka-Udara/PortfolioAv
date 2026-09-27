/**
 * Media pipeline
 * --------------
 * Source  : public/<original messy files>
 * Output  : public/media/...   (web-ready, optimised)
 *           src/generated/media.json  (original path -> optimised variants)
 *
 * - video  -> H.264 faststart mp4, capped at 1280px, + auto-picked poster frame
 * - gif    -> mp4 + poster
 * - image  -> webp (full) + webp (card/thumb) + jpg poster
 */
import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public");
const OUT = path.join(ROOT, "public", "media");
const INDEX_OUT = path.join(ROOT, "src", "generated", "media.json");

// resolve in this order: a shared temp install (fast repeat runs), then this
// project's own devDependency, then the plain specifier
let FFMPEG = process.env.FFMPEG_PATH || "";
if (!FFMPEG) {
  for (const candidate of [
    path.join(process.env.TEMP, "mediatools", "node_modules", "ffmpeg-static", "ffmpeg.exe"),
    path.join(ROOT, "node_modules", "ffmpeg-static", "ffmpeg.exe"),
  ]) {
    if (fsSync.existsSync(candidate)) {
      FFMPEG = candidate;
      break;
    }
  }
}
if (!FFMPEG) {
  try {
    FFMPEG = require.resolve("ffmpeg-static");
  } catch {
    FFMPEG = "ffmpeg";
  }
}
const SHARP_OPTS = { limitInputPixels: 0, sequentialRead: true };
let sharp;
// resolve in this order: a shared temp install (fast repeat runs), then this
// project's own devDependency, then the plain specifier
for (const candidate of [
  () => require(path.join(process.env.TEMP, "mediatools", "node_modules", "sharp")),
  () => require(path.join(ROOT, "node_modules", "sharp")),
  () => require("sharp"),
]) {
  try {
    sharp = candidate();
    break;
  } catch {
    /* try the next */
  }
}

const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".mkv", ".m4v"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const MODEL_EXT = new Set([".obj", ".glb", ".gltf"]);

const CARD_W = 900; // grid thumbnail width
const FULL_W = 2000; // detail-page width
const MAX_VIDEO = 1280; // longest edge cap for video
const CONCURRENCY = 2;

const slug = (s) =>
  s
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-")
    .toLowerCase();

/* ------------------------------------------------------------------ probe */

async function probe(file) {
  try {
    const { stderr } = await execFileAsync(FFMPEG, ["-hide_banner", "-i", file], { maxBuffer: 1 << 24 }).catch((e) => ({
      stderr: e.stderr || "",
    }));
    const v = /Stream #\d+:\d+.*?: Video: .*?, (\d+)x(\d+)/.exec(stderr);
    const d = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(stderr);
    const a = /Stream #\d+:\d+.*?: Audio:/.test(stderr);
    if (!v) return null;
    return {
      width: +v[1],
      height: +v[2],
      duration: d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : 0,
      hasAudio: a,
    };
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------- ffmpeg */

async function run(args, label) {
  try {
    await execFileAsync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      maxBuffer: 1 << 26,
      windowsHide: true,
    });
    return true;
  } catch (err) {
    console.error(`   ! ${label} failed: ${String(err.stderr || err.message).slice(0, 400)}`);
    return false;
  }
}

/* --------------------------------------------------------------- posters */

/** Pick the most detailed frame from 6 samples so posters are never black/empty. */
async function bestFrame(file, duration, tmp) {
  const fracs = [0.08, 0.2, 0.35, 0.5, 0.65, 0.8];
  await fs.mkdir(tmp, { recursive: true });
  const stamps = [];
  for (const f of fracs) stamps.push(Math.max(0, Math.min(duration - 0.05, duration * f)));

  for (let i = 0; i < stamps.length; i++) {
    await run(
      [
        "-ss",
        stamps[i].toFixed(2),
        "-i",
        file,
        "-frames:v",
        "1",
        "-vf",
        "scale=240:-2",
        "-q:v",
        "6",
        path.join(tmp, `c${i}.jpg`),
      ],
      "sample"
    );
  }

  let best = { i: 0, score: -1 };
  for (let i = 0; i < stamps.length; i++) {
    const p = path.join(tmp, `c${i}.jpg`);
    try {
      const buf = await fs.readFile(p);
      // `data` is the raw greyscale buffer; stddev = "how much is in this frame",
      // which reliably beats a black fade-in or a flat hold frame.
      const { data } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
      let sum = 0;
      let sumSq = 0;
      for (let k = 0; k < data.length; k++) {
        sum += data[k];
        sumSq += data[k] * data[k];
      }
      const n = data.length;
      const std = Math.sqrt(Math.max(0, sumSq / n - (sum / n) ** 2));
      if (std > best.score) best = { i, score: std };
    } catch {
      /* ignore unreadable sample */
    }
  }
  await fs.rm(tmp, { recursive: true, force: true });
  return stamps[best.i] ?? 0;
}

async function poster(file, out, at, width = 900) {
  return run(
    ["-ss", Math.max(0, at).toFixed(2), "-i", file, "-frames:v", "1", "-vf", `scale=${width}:-2:flags=lanczos`, "-q:v", "4", out],
    "poster"
  );
}

/* -------------------------------------------------------------- workers */

const exists = (p) => {
  try {
    return fsSync.statSync(p).size > 0;
  } catch {
    return false;
  }
};

async function doVideo(rel, info, tmp) {
  const dir = path.dirname(rel);
  const base = slug(path.basename(rel, path.extname(rel)));
  const outRel = path.join("media", dir, `${base}.mp4`);
  const posterRel = path.join("media", dir, `${base}-poster.jpg`);
  const outAbs = path.join(SRC, outRel);
  const posterAbs = path.join(SRC, posterRel);
  await fs.mkdir(path.dirname(outAbs), { recursive: true });

  const srcAbs = path.join(SRC, rel);
  const p = await probe(srcAbs);
  if (!p) {
    console.log(`   x skip (unreadable) ${rel}`);
    return null;
  }

  // ---- resume: output already encoded on a previous run, just re-index it
  if (exists(outAbs) && !FORCE.has(rel)) {
    if (!exists(posterAbs) || FORCE_POSTERS) {
      const at = await bestFrame(srcAbs, p.duration, tmp);
      await poster(srcAbs, posterAbs, at, 1200);
    }
    console.log(`   =  ${rel}  (cached)`);
    return {
      kind: "video",
      src: "/" + outRel.split(path.sep).join("/"),
      poster: "/" + posterRel.split(path.sep).join("/"),
      width: p.width,
      height: p.height,
      duration: Math.round(p.duration),
      ratio: +(p.width / p.height).toFixed(4),
    };
  }

  const vertical = p.height > p.width;
  const scale = vertical ? `scale=-2:'min(${MAX_VIDEO},ih)'` : `scale='min(${MAX_VIDEO},iw)':-2`;

  // 2D/motion-graphics content is flat colour: -tune animation compresses far better.
  const tune = /(^|[\\/])2d([\\/]|$)|anim|motion|logo|comp/i.test(rel) ? ["-tune", "animation"] : [];

  const ok = await run(
    [
      "-i",
      srcAbs,
      "-vf",
      scale,
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-level",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "medium",
      "-crf",
      "28",
      ...tune,
      ...(p.hasAudio ? ["-c:a", "aac", "-b:a", "96k", "-ac", "2"] : ["-an"]),
      "-movflags",
      "+faststart",
      outAbs,
    ],
    "encode"
  );
  if (!ok) return null;

  const at = await bestFrame(srcAbs, p.duration, tmp);
  await poster(srcAbs, posterAbs, at, 1200);

  const outSize = fsSync.statSync(outAbs).size;
  console.log(
    `   ok ${rel}\n      -> ${outRel}  ${(outSize / 1048576).toFixed(1)}MB  (was ${(info.size / 1048576).toFixed(1)}MB)  ${p.width}x${p.height} ${p.duration.toFixed(0)}s`
  );

  return {
    kind: "video",
    src: "/" + outRel.split(path.sep).join("/"),
    poster: "/" + posterRel.split(path.sep).join("/"),
    width: p.width,
    height: p.height,
    duration: Math.round(p.duration),
    ratio: +(p.width / p.height).toFixed(4),
  };
}

async function doImage(rel, info) {
  const dir = path.dirname(rel);
  const base = slug(path.basename(rel, path.extname(rel)));
  const fullRel = path.join("media", dir, `${base}.webp`);
  const cardRel = path.join("media", dir, `${base}-card.webp`);
  const fullAbs = path.join(SRC, fullRel);
  const cardAbs = path.join(SRC, cardRel);
  await fs.mkdir(path.dirname(fullAbs), { recursive: true });

  const srcAbs = path.join(SRC, rel);

  // ---- resume
  if (exists(fullAbs) && exists(cardAbs) && !FORCE.has(rel)) {
    console.log(`   =  ${rel}  (cached)`);
    try {
      const meta = await sharp(fullAbs, SHARP_OPTS).metadata();
      const ratio = meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : 1;
      return {
        kind: "image",
        src: "/" + fullRel.split(path.sep).join("/"),
        card: "/" + cardRel.split(path.sep).join("/"),
        width: meta.width,
        height: meta.height,
        ratio,
        orientation: ratio > 1.15 ? "landscape" : ratio < 0.85 ? "portrait" : "square",
        hasAlpha: !!meta.hasAlpha,
      };
    } catch {
      /* fall through and re-encode */
    }
  }

  let meta;
  try {
    meta = await sharp(srcAbs, SHARP_OPTS).metadata();
  } catch (e) {
    console.log(`   x skip ${rel}: ${e.message}`);
    return null;
  }

  try {
    await sharp(srcAbs, SHARP_OPTS)
      .resize({ width: FULL_W, height: FULL_W, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(fullAbs);
    await sharp(srcAbs, SHARP_OPTS)
      .resize({ width: CARD_W, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(cardAbs);
  } catch (e) {
    console.log(`   x skip ${rel}: ${e.message}`);
    return null;
  }

  const fullSize = fsSync.statSync(fullAbs).size;
  const ratio = meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : 1;
  const orientation = ratio > 1.15 ? "landscape" : ratio < 0.85 ? "portrait" : "square";
  console.log(`   ok ${rel}\n      -> ${fullRel}  ${(fullSize / 1024).toFixed(0)}KB  ${meta.width}x${meta.height} ${orientation}`);

  return {
    kind: "image",
    src: "/" + fullRel.split(path.sep).join("/"),
    card: "/" + cardRel.split(path.sep).join("/"),
    width: meta.width,
    height: meta.height,
    ratio,
    orientation,
    hasAlpha: !!meta.hasAlpha,
  };
}

/* ---------------------------------------------------------------- models */

/**
 * 3D meshes are served verbatim (no transcode worth doing for portfolio OBJs),
 * with the nearest rendered image in the same folder volunteered as the poster
 * so grids and the lightbox scrubber have something to show before anyone
 * actually opens the viewer.
 */
async function doModel(rel) {
  const dir = path.dirname(rel);
  const outRel = path.join("media", dir, path.basename(rel));
  const outAbs = path.join(SRC, outRel);
  await fs.mkdir(path.dirname(outAbs), { recursive: true });

  const srcAbs = path.join(SRC, rel);
  try {
    await fs.copyFile(srcAbs, outAbs);
  } catch (e) {
    console.log(`   x skip ${rel}: ${e.message}`);
    return null;
  }

  // poster: first supported image sibling, preferring one that looks like a
  // hero render (closeup / render / numbered shot) over incidental extras
  const siblings = (await fs.readdir(path.dirname(srcAbs), { withFileTypes: true }))
    .filter((e) => e.isFile() && IMAGE_EXT.has(path.extname(e.name).toLowerCase()))
    .map((e) => e.name)
    .sort((a, b) => rankModelPoster(a) - rankModelPoster(b));
  if (!siblings.length) {
    console.log(`   x skip ${rel}: no poster candidate beside it`);
    return null;
  }
  const posterName = siblings[0];
  const posterSrc = path.join(path.dirname(srcAbs), posterName);
  const posterBase = slug(path.basename(posterName, path.extname(posterName)));
  const posterRel = path.join("media", dir, `${posterBase}.webp`);
  const cardRel = path.join("media", dir, `${posterBase}-card.webp`);
  const posterAbs = path.join(SRC, posterRel);
  const cardAbs = path.join(SRC, cardRel);

  try {
    await sharp(posterSrc, SHARP_OPTS).resize({ width: FULL_W, height: FULL_W, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toFile(posterAbs);
    await sharp(posterSrc, SHARP_OPTS).resize({ width: CARD_W, withoutEnlargement: true }).webp({ quality: 78 }).toFile(cardAbs);
  } catch (e) {
    console.log(`   x skip ${rel}: poster failed — ${e.message}`);
    return null;
  }

  const meta = await sharp(posterSrc, SHARP_OPTS).metadata();
  const ratio = meta.width && meta.height ? +(meta.width / meta.height).toFixed(4) : 1;

  console.log(`   ok ${rel}\n      -> ${outRel}  (model, poster ${posterName})`);
  return {
    kind: "model",
    src: "/" + outRel.split(path.sep).join("/"),
    poster: "/" + posterRel.split(path.sep).join("/"),
    card: "/" + cardRel.split(path.sep).join("/"),
    width: meta.width,
    height: meta.height,
    ratio,
  };
}

function rankModelPoster(name) {
  const n = name.toLowerCase();
  if (/closeup|render|hero|beauty|turn/.test(n)) return 0;
  if (/^\d/.test(n)) return 1;
  if (/front|side|persp|view/.test(n)) return 2;
  return 5;
}

/* ----------------------------------------------------------------- main */

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
/** re-encode / re-index these source paths even if cached */
const FORCE = new Set(
  argv
    .filter((a) => a.startsWith("--force="))
    .flatMap((a) => a.slice(8).split(",").filter(Boolean))
);
const FORCE_POSTERS = flag("posters");
const CLEAN = flag("clean");

async function walk(dir, acc = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (e.name === "media" || e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const t0 = Date.now();
const files = await walk(SRC);
const jobs = files
  .map((abs) => ({
    abs,
    rel: path.relative(SRC, abs).split(path.sep).join("/"),
    ext: path.extname(abs).toLowerCase(),
    size: fsSync.statSync(abs).size,
  }))
  .filter((f) => f.rel !== "favicon.ico" && f.rel !== "favicon.svg" && f.rel !== "robots.txt");

const videos = jobs.filter((f) => VIDEO_EXT.has(f.ext) || f.ext === ".gif");
const images = jobs.filter((f) => IMAGE_EXT.has(f.ext));
const models = jobs.filter((f) => MODEL_EXT.has(f.ext));
console.log(
  `\n  ${videos.length} video/gif  ·  ${images.length} image  ·  ${models.length} model  ·  ${(jobs.reduce((s, f) => s + f.size, 0) / 1048576).toFixed(0)}MB total\n`
);

if (CLEAN || FORCE.size) await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

const index = {};
const queue = [
  ...videos.map((f) => ({ ...f, kind: "video" })),
  ...images.map((f) => ({ ...f, kind: "image" })),
  ...models.map((f) => ({ ...f, kind: "model" })),
];
let done = 0;

async function worker(id) {
  const tmp = path.join(OUT, `.probe-${id}`);
  while (queue.length) {
    const job = queue.shift();
    const r =
      job.kind === "video"
        ? await doVideo(job.rel, job, tmp)
        : job.kind === "model"
          ? await doModel(job.rel)
          : await doImage(job.rel);
    if (r) index[job.rel] = r;
    done++;
    process.stdout.write(`\r   processing ${done}/${jobs.length}   `);
  }
  await fs.rm(tmp, { recursive: true, force: true });
}

await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
process.stdout.write("\n");

// stable, sorted output
const sorted = Object.fromEntries(Object.entries(index).sort(([a], [b]) => a.localeCompare(b)));
await fs.mkdir(path.dirname(INDEX_OUT), { recursive: true });
await fs.writeFile(INDEX_OUT, JSON.stringify(sorted, null, 2));

const inBytes = jobs.reduce((s, f) => s + f.size, 0);
const outBytes = Object.values(sorted).reduce(
  (s, r) => s + (exists(path.join(SRC, r.src.slice(1))) ? fsSync.statSync(path.join(SRC, r.src.slice(1))).size : 0),
  0
);
console.log(`\n  done in ${((Date.now() - t0) / 1000 / 60).toFixed(1)} min`);
console.log(`  ${Object.keys(sorted).length}/${jobs.length} files indexed`);
console.log(`  total ${(inBytes / 1048576).toFixed(0)}MB -> ${(outBytes / 1048576).toFixed(1)}MB\n`);
