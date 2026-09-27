/**
 * Writes public/robots.txt and public/sitemap.xml from the project data.
 *   SITE_URL=https://your-domain.com node scripts/sitemap.mjs
 *
 * robots.txt is always written. sitemap.xml is only written when SITE_URL is
 * set — a sitemap full of guessed URLs is worse than none, so it fails loud
 * instead of shipping something wrong.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || "")
  .trim()
  .replace(/\/+$/, "");

const src = fs.readFileSync(path.join(root, "src", "data", "projects.ts"), "utf8");
const slugs = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const stamp = new Date().toISOString().slice(0, 10);

const routes = [
  { loc: "/", priority: "1.0", changefreq: "monthly" },
  { loc: "/work", priority: "0.9", changefreq: "weekly" },
  { loc: "/about", priority: "0.6", changefreq: "yearly" },
  { loc: "/contact", priority: "0.6", changefreq: "yearly" },
  ...slugs.map((slug) => ({
    loc: `/work/${slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
];

// ------------------------------------------------------------- robots.txt
const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  "# only the optimised web-ready assets live under /media",
  "Disallow: /media/*.mp4$",
  "Disallow: /media/*.obj$",
  "",
  ...(SITE_URL ? [`Sitemap: ${SITE_URL}/sitemap.xml`] : ["# Sitemap: set SITE_URL to enable"]),
  "",
].join("\n");

fs.writeFileSync(path.join(root, "public", "robots.txt"), robots);
console.log(`  wrote public/robots.txt (${routes.length - slugs.length} static routes)`);

if (!SITE_URL) {
  console.warn(
    "\n  ⚠ SITE_URL not set — skipping sitemap.xml.\n" +
      "    Deploy with SITE_URL=https://your-domain.com to generate it.\n"
  );
  process.exit(0);
}

// ------------------------------------------------------------ sitemap.xml
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((r) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${r.loc}</loc>`,
      `    <lastmod>${stamp}</lastmod>`,
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      "  </url>",
    ].join("\n")
  ),
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(path.join(root, "public", "sitemap.xml"), xml);
console.log(`  wrote public/sitemap.xml (${routes.length} urls -> ${SITE_URL})`);
