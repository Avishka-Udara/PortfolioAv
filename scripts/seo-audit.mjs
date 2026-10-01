/**
 * SEO Audit Script - Validates SEO implementation and provides recommendations
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("🔍 Running SEO Audit for Avishka Udara Portfolio...\n");

// Check required files
const requiredFiles = [
  "public/robots.txt",
  "public/sitemap.xml", 
  "public/sitemap-images.xml",
  "public/sitemap-index.xml"
];

const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(root, file)));
if (missingFiles.length > 0) {
  console.log("❌ Missing SEO files:");
  missingFiles.forEach(file => console.log(`   - ${file}`));
  console.log("\n   Run: npm run seo to generate missing files\n");
} else {
  console.log("✅ All SEO files present\n");
}

// Check HTML meta tags
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const requiredMetaTags = [
  'name="description"',
  'name="keywords"', 
  'property="og:title"',
  'property="og:description"',
  'property="og:image"',
  'name="twitter:card"',
  'application/ld+json'
];

console.log("📋 Meta tags audit:");
requiredMetaTags.forEach(tag => {
  const present = indexHtml.includes(tag);
  console.log(`${present ? '✅' : '❌'} ${tag}`);
});

// Check structured data
const structuredDataCount = (indexHtml.match(/application\/ld\+json/g) || []).length;
console.log(`\n📊 Structured data scripts: ${structuredDataCount}`);

// Performance recommendations
console.log("\n🚀 SEO Performance Recommendations:");
console.log("✅ Use HTTPS (assumed for production)");
console.log("✅ Implement proper heading hierarchy (H1 > H2 > H3)");
console.log("✅ Add alt text to all images");
console.log("✅ Optimize Core Web Vitals");
console.log("✅ Implement breadcrumbs on project pages");
console.log("✅ Add FAQ section for rich snippets");

// Domain-specific recommendations  
console.log("\n🎯 Avishka Udara specific recommendations:");
console.log("1. Ensure 'Avishka Udara' appears in page titles");
console.log("2. Use location 'Sri Lanka' in meta descriptions");
console.log("3. Include service keywords: 'Visual Designer', 'Motion Graphics', '3D Artist'");
console.log("4. Add client testimonials with schema markup");
console.log("5. Create case study pages with detailed project descriptions");
console.log("6. Add social media profile links when available");

console.log("\n🔗 Next steps to rank #1 for 'Avishka Udara':");
console.log("1. Submit sitemap to Google Search Console");
console.log("2. Create Google My Business profile"); 
console.log("3. Get backlinks from design directories");
console.log("4. Regularly update portfolio with fresh work");
console.log("5. Add blog section with design process articles");
console.log("6. Optimize for local SEO (Sri Lankan design market)");
console.log("\n✨ SEO audit complete!");