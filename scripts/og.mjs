/**
 * Builds public/media/og.jpg — the social share card referenced by index.html.
 * Composes a branded 1200x630 plate (SVG -> sharp) so the card always matches
 * the site's type and palette instead of being a loose screenshot.
 *
 *   node scripts/og.mjs
 */
import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const W = 1200;
const H = 630;
const OUT = path.resolve("public/media/og.jpg");

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#08080a"/>
      <stop offset="55%" stop-color="#0d0d11"/>
      <stop offset="100%" stop-color="#15151b"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#00e5ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- fine grid -->
  <g stroke="#ffffff" stroke-opacity="0.045" stroke-width="1">
    ${Array.from({ length: Math.floor(W / 60) + 1 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="${H}"/>`).join("")}
    ${Array.from({ length: Math.floor(H / 60) + 1 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="${W}" y2="${i * 60}"/>`).join("")}
  </g>

  <!-- frame -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="url(#stroke)" stroke-width="1.5"/>

  <!-- status dot -->
  <circle cx="72" cy="104" r="5" fill="#00e5ff"/>
  <text x="92" y="110" fill="#8b8b96" font-family="monospace" font-size="17" letter-spacing="4">
    AVAILABLE FOR FREELANCE
  </text>

  <!-- name -->
  <text x="68" y="300" fill="#f1f1f3" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="700" letter-spacing="-4">
    AVISHKA
  </text>
  <text x="68" y="412" fill="transparent" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="700" letter-spacing="-4">
    UDARA
  </text>
  <circle cx="640" cy="392" r="9" fill="#00e5ff"/>

  <!-- role -->
  <text x="68" y="482" fill="#8b8b96" font-family="monospace" font-size="22" letter-spacing="3">
    VISUAL DESIGN · MOTION · 3D · VIDEO
  </text>

  <!-- footer -->
  <text x="68" y="556" fill="#5a5a64" font-family="monospace" font-size="17" letter-spacing="3">
    SRI LANKA — 9+ YEARS — AUDARA799@GMAIL.COM
  </text>
</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });

await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(OUT);

console.log(`wrote ${path.relative(process.cwd(), OUT)}`);
