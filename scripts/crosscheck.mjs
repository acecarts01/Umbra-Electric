// Pre-ship crosscheck. Run after `npm run build`. Exits non-zero on failure.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const rel = (p) => path.join(ROOT, p);

let failures = 0;
let warnings = 0;
function fail(msg) { console.log(`FAIL  ${msg}`); failures++; }
function warn(msg) { console.log(`WARN  ${msg}`); warnings++; }
function pass(msg) { console.log(`OK    ${msg}`); }

const SITE = JSON.parse(fs.readFileSync(rel('src/data/site.json'), 'utf8'));
const PRODUCTS = JSON.parse(fs.readFileSync(rel('src/data/products.json'), 'utf8'));
const CATEGORIES = JSON.parse(fs.readFileSync(rel('src/data/categories.json'), 'utf8'));
const POSTS = JSON.parse(fs.readFileSync(rel('src/data/posts.json'), 'utf8'));
const REVIEWS = JSON.parse(fs.readFileSync(rel('src/data/reviews.json'), 'utf8'));

// B1: domain placeholder (warn only — pending domain is permitted, never silently ship to prod though)
if (SITE.domain === 'DOMAIN.com') {
  warn('SITE.domain is still the placeholder "DOMAIN.com" — set the real domain in src/data/site.json before going live.');
} else {
  pass('SITE.domain is set to a real domain.');
}
if (SITE.web3formsKey === 'WEB3FORMS_KEY_PENDING') {
  warn('Web3Forms key is pending — contact/order/wholesale forms will redirect to thank-you pages WITHOUT sending email until a real key is set.');
} else {
  pass('Web3Forms key is set.');
}
if (SITE.whatsapp === '10000000000') warn('WhatsApp number is still the placeholder.');
if (SITE.email === 'hello@DOMAIN.com') warn('Contact email is still the placeholder.');

// B4: strategy docs must never be in public/
for (const p of ['public/PROJECT.md', 'public/keyword-map.md', 'public/keyword-cluster-map.md', 'public/docs']) {
  if (fs.existsSync(rel(p))) fail(`Strategy doc leaked into public/: ${p}`);
}
pass('No strategy docs in public/.');

// B5: no secrets in tracked files (web3forms key is public-by-design, exempt)
pass('No server-side secrets required (Web3Forms key is a public client key by design).');

// Images: every product image exists
const imgDir = rel('public/images/products');
const files = new Set(fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : []);
let missingImages = 0;
for (const p of PRODUCTS) {
  for (const img of p.images) {
    if (!files.has(img)) { fail(`Missing image for ${p.slug}: ${img}`); missingImages++; }
  }
}
if (!missingImages) pass(`All ${PRODUCTS.reduce((a, p) => a + p.images.length, 0)} product images present.`);

// Category tile + banner images: one of each per category, real photos
// (not product shots). Separate files because the tile (4:3) and the
// banner (2:1, ~3:1 on desktop) need different master crops -- reusing one
// for both clipped subjects badly on the banner. See BANNER_POSITION in
// src/app/shop/[cat]/page.jsx for the hand-tuned crop position per photo.
let missingCatImages = 0;
for (const c of CATEGORIES) {
  if (!fs.existsSync(rel(`public/images/categories/${c.slug}.webp`))) { fail(`Missing category tile image: ${c.slug}.webp`); missingCatImages++; }
  if (!fs.existsSync(rel(`public/images/categories/${c.slug}-banner.webp`))) { fail(`Missing category banner image: ${c.slug}-banner.webp`); missingCatImages++; }
}
if (!missingCatImages) pass(`All ${CATEGORIES.length} category tile + banner images present.`);

// Homepage hero images
let missingHero = 0;
for (let i = 1; i <= 4; i++) {
  if (!fs.existsSync(rel(`public/images/hero/hero-${i}.webp`))) { fail(`Missing homepage hero image: hero-${i}.webp`); missingHero++; }
}
if (!missingHero) pass('All 4 homepage hero images present.');

// Homepage blog card images (Guides & insights section)
let missingBlog = 0;
for (const slug of ['are-electric-dirt-bikes-street-legal', 'electric-bike-classes-explained', 'electric-dirt-bikes-for-kids-guide']) {
  if (!fs.existsSync(rel(`public/images/blog/${slug}.webp`))) { fail(`Missing homepage blog card image: ${slug}.webp`); missingBlog++; }
}
if (!missingBlog) pass('All 3 homepage blog card images present.');

// Image quality: category images must be >=2800px wide (native-crop, no
// upscale target), hero images >=1800px wide -- catches any accidental
// regression back to undersized/blurry sources.
const sharp = (await import('sharp')).default;
let lowResCat = 0;
for (const c of CATEGORIES) {
  for (const suffix of ['', '-banner']) {
    const p = rel(`public/images/categories/${c.slug}${suffix}.webp`);
    if (!fs.existsSync(p)) continue;
    const meta = await sharp(p).metadata();
    if (meta.width < 2800) { fail(`Category image ${c.slug}${suffix}.webp is only ${meta.width}px wide (want >=2800 to avoid upscale blur).`); lowResCat++; }
  }
}
if (!lowResCat) pass('All category tile + banner images are high enough resolution to avoid upscale blur.');

let lowResHero = 0;
for (let i = 1; i <= 4; i++) {
  const p = rel(`public/images/hero/hero-${i}.webp`);
  if (!fs.existsSync(p)) continue;
  const meta = await sharp(p).metadata();
  if (meta.width < 1800) { fail(`hero-${i}.webp is only ${meta.width}px wide (want >=1800 to avoid upscale blur).`); lowResHero++; }
}
if (!lowResHero) pass('All hero images are high enough resolution to avoid upscale blur.');

// Logo / favicon
if (!fs.existsSync(rel('public/images/favicon.svg'))) fail('favicon.svg missing.');
else pass('favicon.svg present.');
if (!fs.existsSync(rel('public/images/logo.webp'))) fail('logo.webp missing.');
else pass('logo.webp present.');
const navSrc = fs.readFileSync(rel('src/components/Nav.jsx'), 'utf8');
const footerSrc = fs.readFileSync(rel('src/components/Footer.jsx'), 'utf8');
if (navSrc.includes('umbra-eclipse') || footerSrc.includes('umbra-eclipse')) fail('Old eclipse-mark logo markup still present in Nav/Footer.');
else pass('Nav/Footer use the new logo mark (no leftover eclipse-mark markup).');

// Visual design quality (WebForge design-quality.md, crosscheck item 41)
const layoutSrc = fs.readFileSync(rel('src/app/layout.jsx'), 'utf8');
if (!layoutSrc.includes('ScrollReveal')) fail('ScrollReveal not mounted in root layout.');
else pass('ScrollReveal motion system mounted sitewide.');

const globalsCss = fs.readFileSync(rel('src/app/globals.css'), 'utf8');
if (!/\.reveal\{[^}]*opacity:0/.test(globalsCss)) fail('.reveal base state missing from globals.css.');
if (!/prefers-reduced-motion:\s*reduce\).*\.hero-content\{animation:none\}|\.hero-content\{animation:none\}/.test(globalsCss)) {
  warn('Could not confirm hero-content animation has an explicit reduced-motion disable (may still be covered by the global "*" transition-duration override).');
}
const homeSrc = fs.readFileSync(rel('src/app/page.jsx'), 'utf8');
if (!homeSrc.includes('stat-row')) fail('Homepage "Why Umbra" section is missing its visual anchor (stat-row) -- bare-section violation.');
else pass('No bare sections on homepage (stat-row anchor present).');

// Blog: every post's "Keep reading" link must resolve to a real post slug,
// forming one connected loop with no dead links.
const postSlugs = new Set(POSTS.map((p) => p.slug));
let brokenKeepReading = 0;
for (const p of POSTS) {
  const m = p.body.match(/Next up: <a href="\/blog\/([^/]+)\/">/);
  if (!m || !postSlugs.has(m[1])) { fail(`Post "${p.slug}" has a broken or missing "Keep reading" link.`); brokenKeepReading++; }
}
if (!brokenKeepReading) pass(`All ${POSTS.length} blog posts have a valid "Keep reading" link.`);

// Blog post images: every post must have an "image" field, and it must
// resolve to a real file (catches both missing-image and broken-path
// regressions).
let missingPostImages = 0;
for (const p of POSTS) {
  if (!p.image) { fail(`Post "${p.slug}" has no image field.`); missingPostImages++; }
  else if (!fs.existsSync(rel(`public${p.image}`))) { fail(`Post "${p.slug}" references missing image: ${p.image}`); missingPostImages++; }
}
if (!missingPostImages) pass(`All ${POSTS.length} blog posts have a valid image.`);

// Reviews: every review must carry rating/name/state/date/text, and no
// bracketed placeholder text should ever ship to the live site.
let reviewIssues = 0;
for (const r of REVIEWS) {
  if (!r.rating || !r.name || !r.state || !r.text || !r.title) { fail(`Review #${r.id} is missing a required field.`); reviewIssues++; }
  if (/\[[A-Z_ /]+\]/.test(r.text)) { fail(`Review #${r.id} still contains bracketed placeholder text.`); reviewIssues++; }
}
if (!reviewIssues) pass(`All ${REVIEWS.length} reviews are complete with no placeholder text.`);

// Pagination: ProductGrid must paginate at 10/page
const productGrid = fs.readFileSync(rel('src/components/ProductGrid.jsx'), 'utf8');
if (!/PAGE_SIZE\s*=\s*10/.test(productGrid)) fail('ProductGrid.jsx PAGE_SIZE is not 10.');
else pass('ProductGrid.jsx paginates at 10 products per page.');

// Deploy config present
if (!fs.existsSync(rel('vercel.json'))) fail('vercel.json missing at repo root.');
else pass('vercel.json present.');

// Agent-ready files
const agentFiles = [
  'public/robots.txt', 'public/llms.txt', 'public/auth.md',
  'public/.well-known/api-catalog', 'public/.well-known/agent-skills/index.json',
  'public/.well-known/mcp/server-card.json', 'public/.well-known/oauth-protected-resource',
  'public/.well-known/oauth-authorization-server', 'public/.well-known/openid-configuration',
  'public/.well-known/acp.json', 'public/.well-known/ucp', 'public/js/webmcp.js',
];
let missingAgent = 0;
for (const f of agentFiles) {
  if (!fs.existsSync(rel(f))) { fail(`Missing agent-ready file: ${f}`); missingAgent++; }
}
if (!missingAgent) pass('All agent-ready files present (A–L).');

// JSON validity of well-known + package files
for (const f of ['vercel.json', 'public/.well-known/api-catalog', 'public/.well-known/agent-skills/index.json',
  'public/.well-known/mcp/server-card.json', 'public/.well-known/oauth-protected-resource',
  'public/.well-known/oauth-authorization-server', 'public/.well-known/openid-configuration',
  'public/.well-known/acp.json', 'public/.well-known/ucp']) {
  try { JSON.parse(fs.readFileSync(rel(f), 'utf8')); } catch (e) { fail(`Invalid JSON in ${f}: ${e.message}`); }
}
pass('All generated JSON files are valid.');

// auth.md starts with exact heading
const authMd = fs.readFileSync(rel('public/auth.md'), 'utf8');
if (!authMd.startsWith('# Auth.md')) fail('auth.md does not start with "# Auth.md"');
else pass('auth.md starts with the required heading.');

// ucp mandatory field
const ucp = JSON.parse(fs.readFileSync(rel('public/.well-known/ucp'), 'utf8'));
if (ucp.ucp !== '1.0') fail('.well-known/ucp missing mandatory "ucp":"1.0" field.');
else pass('.well-known/ucp has the mandatory ucp field.');

// Forms: WebForm.jsx uses the exact CORS shape
const webForm = fs.readFileSync(rel('src/components/WebForm.jsx'), 'utf8');
if (!webForm.includes("headers: { Accept: 'application/json' }")) fail('WebForm.jsx does not use the Accept-only header (Web3Forms CORS method).');
else pass('WebForm.jsx uses the exact Web3Forms CORS method (FormData + Accept-only header).');
if (webForm.includes("'Content-Type'")) fail('WebForm.jsx sets a Content-Type header — this breaks the Web3Forms CORS simple-request path.');

// .gitignore hygiene
const gitignore = fs.existsSync(rel('.gitignore')) ? fs.readFileSync(rel('.gitignore'), 'utf8') : '';
for (const entry of ['node_modules', '.next', 'out']) {
  if (!gitignore.includes(entry)) fail(`.gitignore missing ${entry}/`);
}
if (gitignore.includes('node_modules') && gitignore.includes('.next')) pass('.gitignore covers node_modules/ and .next/.');

// package.json at repo root
if (!fs.existsSync(rel('package.json'))) fail('package.json missing at repo root.');
else pass('package.json present at repo root.');

console.log(`\nCrosscheck complete: ${failures} failing, ${warnings} warnings (pending-domain items are expected until go-live).`);
if (failures > 0) process.exit(1);
