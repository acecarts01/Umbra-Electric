// Applies the live Semrush Keyword Magic Tool research (browser-driven,
// 2026-11-23 session) to the 2 Tier 4 single-product-brand products that had
// full, entity-verified real data. Both got a complete 6-keyword real-data
// set (primary + 5 supporting), so this is a full replace, not a partial
// swap. tork-base-model-72v-16-8kw had zero usable real data (only one
// Navigational hit, disqualified under the T-priority rule) and is
// deliberately left untouched -- see docs/tier4-keyword-audit-2026-11.md.
// Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

const RESEARCH = {
  'santa-cruz-bullit-cc-x0-axs': {
    primary: 'santa cruz bullit for sale',
    supporting: ['santa cruz bullit 2025', 'santa cruz bullit ebike', 'santa cruz bullit review', 'santa cruz bullit 4', 'santa cruz bullit emtb'],
  },
  'sur-ron-ultra-bee': {
    primary: 'sur ron ultra bee for sale',
    supporting: ['sur-ron ultra bee top speed', 'sur ron ultra bee street legal kit', 'sur ron ultra bee x', 'sur ron ultra bee black edition', 'used sur ron ultra bee'],
  },
};

let applied = 0;
for (const [slug, r] of Object.entries(RESEARCH)) {
  const p = products.find((x) => x.slug === slug);
  if (!p) { console.log(`MISSING: ${slug}`); continue; }

  const dupes = r.supporting.filter((k, i) => r.supporting.indexOf(k) !== i);
  if (dupes.length) { console.log(`ABORTED ${slug}: duplicate supportingKeywords`, dupes); continue; }
  if (r.supporting.length !== 5) { console.log(`ABORTED ${slug}: supportingKeywords count is ${r.supporting.length}, not 5`); continue; }

  p.primaryKeyword = r.primary;
  p.supportingKeywords = r.supporting;
  applied++;
}

const primaries = products.map((p) => p.primaryKeyword.toLowerCase());
const dupePrimaries = primaries.filter((p, i) => primaries.indexOf(p) !== i);
if (dupePrimaries.length) console.log('WARNING duplicate primaryKeyword values sitewide:', [...new Set(dupePrimaries)]);

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
console.log(`Applied to ${applied}/${Object.keys(RESEARCH).length} products.`);
