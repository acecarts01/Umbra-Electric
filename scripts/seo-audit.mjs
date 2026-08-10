// Post-build SEO audit: crawls every generated HTML file and checks H1 count,
// canonical correctness, title/description presence + uniqueness, JSON-LD
// validity, and internal links for 404s. Run after `npm run build`.
// Not part of the build pipeline -- a manual verification tool.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, '.next/server/app');
const DOMAIN = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site.json'), 'utf8')).domain;

let failures = 0;
let warnings = 0;
function fail(msg) { console.log(`FAIL  ${msg}`); failures++; }
function warn(msg) { console.log(`WARN  ${msg}`); warnings++; }

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html') && !entry.name.startsWith('_')) out.push(full);
  }
  return out;
}

// Next's static output is flat: index.html (homepage), about.html,
// shop/adult-electric-dirt-bikes.html -- never nested /index.html.
function toRoute(filePath) {
  const rel = path.relative(APP_DIR, filePath).replace(/\\/g, '/').replace(/\.html$/, '');
  if (rel === 'index') return '/';
  return `/${rel}/`;
}

const files = walk(APP_DIR);
console.log(`Auditing ${files.length} generated routes...\n`);

const titles = new Map();
const descriptions = new Map();
const allKnownPaths = new Set(files.map(toRoute));
allKnownPaths.add('/sitemap.xml');
// /shop/ reads searchParams (the ?q= search box), so Next renders it
// dynamically at request time -- it has no static .html file to crawl here,
// but it is a real working route in production.
allKnownPaths.add('/shop/');

let h1Issues = 0, canonicalIssues = 0, jsonLdIssues = 0, linkIssues = 0, metaIssues = 0;
const brokenLinkExamples = [];

for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const displayRoute = toRoute(f);

  // H1 count
  const h1Count = (html.match(/<h1[ >]/g) || []).length;
  if (h1Count !== 1) { fail(`${displayRoute} — ${h1Count} <h1> tags (want exactly 1)`); h1Issues++; }

  // Canonical
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (!canonicalMatch) {
    fail(`${displayRoute} — no canonical tag`);
    canonicalIssues++;
  } else if (!canonicalMatch[1].startsWith(`https://${DOMAIN}`)) {
    fail(`${displayRoute} — canonical does not match SITE.domain (${DOMAIN}): ${canonicalMatch[1]}`);
    canonicalIssues++;
  }

  // Title / description presence + uniqueness tracking
  const titleMatch = html.match(/<title>([^<]*)<\/title>/);
  const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
  if (!titleMatch || !titleMatch[1].trim()) { fail(`${displayRoute} — missing <title>`); metaIssues++; }
  else {
    const t = titleMatch[1].trim();
    if (!titles.has(t)) titles.set(t, []);
    titles.get(t).push(displayRoute);
  }
  if (!descMatch || !descMatch[1].trim()) {
    // Not fatal (some noindex utility pages skip it) but worth flagging.
    if (!/noindex/.test(html)) { warn(`${displayRoute} — missing meta description`); }
  } else {
    const d = descMatch[1].trim();
    if (!descriptions.has(d)) descriptions.set(d, []);
    descriptions.get(d).push(displayRoute);
  }

  // JSON-LD validity
  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  for (const block of ldBlocks) {
    try { JSON.parse(block[1]); } catch (e) { fail(`${displayRoute} — invalid JSON-LD: ${e.message}`); jsonLdIssues++; }
  }

  // Internal link check (href="/...") against known routes
  const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]);
  for (const href of hrefs) {
    if (href.startsWith('//') || href.startsWith('/_next') || href.startsWith('/images') || href.startsWith('/.well-known')) continue;
    if (href.includes('#')) continue;
    if (/\.(txt|xml|webp|png|svg|jpg|ico|js|json)$/.test(href)) continue;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    let clean = href.split('?')[0];
    if (!clean.endsWith('/')) clean += '/';
    if (!allKnownPaths.has(clean)) {
      linkIssues++;
      if (brokenLinkExamples.length < 20) brokenLinkExamples.push(`${displayRoute} -> ${href}`);
    }
  }
}

console.log(`\nH1 issues: ${h1Issues}`);
console.log(`Canonical issues: ${canonicalIssues}`);
console.log(`JSON-LD issues: ${jsonLdIssues}`);
console.log(`Meta issues: ${metaIssues}`);

if (brokenLinkExamples.length) {
  console.log(`\nPotentially broken internal links (${linkIssues} total, showing up to 20):`);
  brokenLinkExamples.forEach((l) => console.log(`  ${l}`));
}

console.log('\nDuplicate titles (excluding pagination-free duplicates expected by design):');
let dupTitles = 0;
for (const [title, routes] of titles) {
  if (routes.length > 1) { warn(`Title "${title}" used on ${routes.length} pages: ${routes.slice(0, 5).join(', ')}${routes.length > 5 ? '...' : ''}`); dupTitles++; }
}
if (!dupTitles) console.log('  none');

console.log('\nDuplicate meta descriptions:');
let dupDescs = 0;
for (const [desc, routes] of descriptions) {
  if (routes.length > 1) { warn(`Description used on ${routes.length} pages (first: ${routes[0]}): "${desc.slice(0, 60)}..."`); dupDescs++; }
}
if (!dupDescs) console.log('  none');

console.log(`\nSEO audit complete: ${failures} failing, ${warnings} warnings (${files.length} routes checked, ${linkIssues} link issues).`);
if (failures > 0) process.exit(1);
