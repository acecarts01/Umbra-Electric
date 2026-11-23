// Applies the approved T-priority keyword rekey (CLAUDE.md "Keyword Rules",
// added 2026-11-23) to 7 flagship products -- surgical edits only: keeps
// every keyword that was already compliant (pure Transactional primary, pure
// Transactional/Commercial supporting), replaces only the specific slots
// that violated the rule, using real Semrush data from
// docs/semrush-export-2026-10-processed.json, verified entity-correct and
// duplicate-free. Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

const CHANGES = {
  'stark-varg-standard': {
    supSwaps: { 'stark varg top speed': 'stark varg 80hp price' },
  },
  'stark-varg-ex-street-legal-enduro': {
    supSwaps: {},
  },
  'talaria-sting-r-mx4': {
    primary: 'talaria mx4 price',
    supSwaps: { 'talaria sting r mx4': 'talaria sting price', 'talaria sting mx4': 'talaria mx4 for sale', 'talaria mx4 sting r': 'talaria bike price' },
  },
  'ktm-freeride-e-xc': {
    primary: 'ktm freeride for sale',
    supSwaps: { 'ktm freeride': 'ktm freeride e price', 'ktm e bike': 'ktm freeride electric price' },
  },
  'zero-fx': {
    supSwaps: { 'street legal electric dirt bike': 'electric motorcycle nearby' },
  },
  'specialized-turbo-levo-sl-expert-carbon': {
    supSwaps: { 'specialized electric mountain bike': 'specialized turbo levo bike' },
  },
  'talaria-komodo-new-2026': {
    supSwaps: { 'new talaria': 'talaria bike price', 'komodo ebike': 'talaria komodo review' },
  },
};

let applied = 0, missing = [];
for (const [slug, change] of Object.entries(CHANGES)) {
  const p = products.find((x) => x.slug === slug);
  if (!p) { missing.push(slug); continue; }
  if (change.primary) p.primaryKeyword = change.primary;
  p.supportingKeywords = p.supportingKeywords.map((k) => change.supSwaps[k] || k);
  // duplicate guard -- abort this product's write rather than ship a broken array
  const dupes = p.supportingKeywords.filter((k, i) => p.supportingKeywords.indexOf(k) !== i);
  if (dupes.length) { console.log(`ABORTED ${slug}: duplicate supportingKeywords after swap:`, dupes); continue; }
  if (p.supportingKeywords.length !== 5) { console.log(`ABORTED ${slug}: supportingKeywords count is ${p.supportingKeywords.length}, not 5`); continue; }
  applied++;
}

if (missing.length) console.log('MISSING SLUGS:', missing.join(', '));

const primaries = products.map((p) => p.primaryKeyword.toLowerCase());
const dupePrimaries = primaries.filter((p, i) => primaries.indexOf(p) !== i);
if (dupePrimaries.length) console.log('WARNING duplicate primaryKeyword values sitewide:', [...new Set(dupePrimaries)]);

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
console.log(`Applied to ${applied}/${Object.keys(CHANGES).length} products.`);
