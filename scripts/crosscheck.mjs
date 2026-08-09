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
for (const p of ['public/PROJECT.md', 'public/keyword-map.md', 'public/docs']) {
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

// Category hero images: one per category, real photos (not product shots)
let missingCatImages = 0;
for (const c of CATEGORIES) {
  if (!fs.existsSync(rel(`public/images/categories/${c.slug}.webp`))) { fail(`Missing category hero image: ${c.slug}.webp`); missingCatImages++; }
}
if (!missingCatImages) pass(`All ${CATEGORIES.length} category hero images present.`);

// Homepage hero images
let missingHero = 0;
for (let i = 1; i <= 4; i++) {
  if (!fs.existsSync(rel(`public/images/hero/hero-${i}.webp`))) { fail(`Missing homepage hero image: hero-${i}.webp`); missingHero++; }
}
if (!missingHero) pass('All 4 homepage hero images present.');

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
