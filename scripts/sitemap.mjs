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
  { loc: "/", priority: "1.0", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] }, // Highest priority for homepage with current date
  { loc: "/work", priority: "0.9", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
  { loc: "/about", priority: "0.8", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] }, // Higher priority for about page
  { loc: "/contact", priority: "0.7", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] },
  ...slugs.map((slug) => ({
    loc: `/work/${slug}`,
    priority: "0.6",
    changefreq: "monthly",
    lastmod: new Date().toISOString().split('T')[0]
  })),
];

// ------------------------------------------------------------- robots.txt
const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  "# Crawl delay to be respectful to servers",
  "Crawl-delay: 1",
  "",
  "# Optimized assets - allow images but disallow large video/model files",
  "Allow: /media/*.jpg$",
  "Allow: /media/*.jpeg$", 
  "Allow: /media/*.png$",
  "Allow: /media/*.webp$",
  "Allow: /media/*.gif$",
  "Disallow: /media/*.mp4$",
  "Disallow: /media/*.obj$",
  "",
  "# Prevent indexing of development and system files",
  "Disallow: /node_modules/",
  "Disallow: /src/",
  "Disallow: /.git/",
  "Disallow: /.vscode/",
  "Disallow: /.kiro/",
  "Disallow: /scripts/",
  "Disallow: /dist/",
  "Disallow: /*.log$",
  "Disallow: /*.json$",
  "Disallow: /*.ts$",
  "Disallow: /*.tsx$",
  "",
  "# Allow all important pages for SEO",
  "Allow: /work/*",
  "Allow: /about",
  "Allow: /contact",
  "",
  "# Special directives for major search engines",
  "User-agent: Googlebot",
  "Crawl-delay: 0",
  "Allow: /",
  "",
  "User-agent: Bingbot", 
  "Crawl-delay: 0",
  "Allow: /",
  "",
  "User-agent: facebookexternalhit",
  "Allow: /",
  "",
  "User-agent: Twitterbot",
  "Allow: /",
  "",
  "User-agent: LinkedInBot",
  "Allow: /",
  "",
  ...(SITE_URL ? [
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Sitemap: ${SITE_URL}/sitemap-images.xml`
  ] : ["# Sitemap: set SITE_URL to enable"]),
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
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
  '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
  ...routes.map((r) =>
    [
      "  <url>",
      `    <loc>${SITE_URL}${r.loc}</loc>`,
      `    <lastmod>${r.lastmod || stamp}</lastmod>`,
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

// -------------------------------------------------------- sitemap-images.xml
// Create a separate image sitemap for better SEO
const imageSitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  '  <url>',
  `    <loc>${SITE_URL}/</loc>`,
  '    <image:image>',
  `      <image:loc>${SITE_URL}/media/og.jpg</image:loc>`,
  '      <image:title>Avishka Udara - Visual Designer Portfolio</image:title>',
  '      <image:caption>Professional visual designer and motion artist portfolio from Sri Lanka</image:caption>',
  '    </image:image>',
  '  </url>',
  '  <url>',
  `    <loc>${SITE_URL}/work</loc>`,
  '    <image:image>',
  `      <image:loc>${SITE_URL}/media/og.jpg</image:loc>`,
  '      <image:title>Avishka Udara Work Portfolio</image:title>',
  '      <image:caption>Visual design, motion graphics and 3D animation portfolio</image:caption>',
  '    </image:image>',
  '  </url>',
  '</urlset>',
  "",
].join("\n");

fs.writeFileSync(path.join(root, "public", "sitemap-images.xml"), imageSitemap);
console.log(`  wrote public/sitemap-images.xml`);

// -------------------------------------------------------- sitemap-index.xml  
// Create a sitemap index to organize multiple sitemaps
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <sitemap>',
  `    <loc>${SITE_URL}/sitemap.xml</loc>`,
  `    <lastmod>${stamp}</lastmod>`,
  '  </sitemap>',
  '  <sitemap>',
  `    <loc>${SITE_URL}/sitemap-images.xml</loc>`,
  `    <lastmod>${stamp}</lastmod>`,
  '  </sitemap>',
  '</sitemapindex>',
  "",
].join("\n");

fs.writeFileSync(path.join(root, "public", "sitemap-index.xml"), sitemapIndex);
console.log(`  wrote public/sitemap-index.xml`);
