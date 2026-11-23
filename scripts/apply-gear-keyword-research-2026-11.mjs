// Applies the gear-accessories keyword research pulled live from Semrush's
// Keyword Magic Tool (browser-driven, 2026-11-23 session) to 10 products.
// Real Transactional/Commercial keywords (entity-verified, pure-intent only
// per CLAUDE.md's Keyword Rules) fill primary + as many supporting slots as
// the real data supports; any remaining supporting slots are padded with
// the product's existing hand-written keywords (kept in their original
// order) rather than fabricating new ones or leaving the array short of 5.
// Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

// { slug: { primary: realKeyword, realSupporting: [...], padFromExisting: n } }
const RESEARCH = {
  'bell-moto-10-spherical': {
    primary: 'bell moto 10 spherical solid motocross helmet',
    realSupporting: ['bell moto 10 spherical helmet', 'bell moto 10 spherical mcgrath replica helmet'],
  },
  'fox-racing-v3-rs-carbon': {
    primary: 'helmet fox v3',
    realSupporting: ['v3 fox helmet', 'v3 helmet fox'],
  },
  'alpinestars-tech-7-boots': {
    primary: 'alpinestar tech 7 enduro boots',
    realSupporting: ['alpinestars tech 7 size 10', 'alpinestars tech 7 size 11', 'alpine tech 7 boots'],
  },
  '100-percent-armega-goggles': {
    primary: '100 goggles armega',
    realSupporting: ['armega 100 goggles', '100 armega motocross goggles'],
  },
  'surron-talaria-60v-spare-battery': {
    primary: '60v surron battery',
    realSupporting: ['surron battery 60v 40ah', 'surron 60v battery'],
  },
  'anker-140w-power-bank': {
    primary: 'anker power bank 24000mah 140w 3 port black',
    realSupporting: [],
  },
  'hiplok-d1000': {
    primary: 'hiplok d1000 unisex shackle lock',
    realSupporting: [],
  },
  'thule-easyfold-xt-2-hitch-rack': {
    primary: 'thule easyfold xt 2 bike hitch rack',
    realSupporting: [],
  },
  'garmin-edge-mtb': {
    primary: 'garmin edge mtb price',
    realSupporting: ['garmin edge mtb mount', 'garmin edge mtb review', 'garmin edge mtb rugged gps bike computer', 'garmin edge mount mtb'],
  },
  'universal-48v-2a-smart-charger': {
    primary: '48v ebike charger',
    realSupporting: ['ebike charger 48v', 'ebike battery charger 48v', '48v battery charger ebike', 'ebike 48v charger', 'charger for ebike 48v'],
  },
};

const auditLog = [];
let applied = 0;

for (const [slug, r] of Object.entries(RESEARCH)) {
  const p = products.find((x) => x.slug === slug);
  if (!p) { console.log(`MISSING: ${slug}`); continue; }

  const oldPrimary = p.primaryKeyword;
  const oldSupporting = [...p.supportingKeywords];

  p.primaryKeyword = r.primary;

  const padNeeded = 5 - r.realSupporting.length;
  const padCandidates = oldSupporting.filter((k) => !r.realSupporting.includes(k) && k.toLowerCase() !== r.primary.toLowerCase());
  const padded = padCandidates.slice(0, padNeeded);
  const newSupporting = [...r.realSupporting, ...padded];

  const dupes = newSupporting.filter((k, i) => newSupporting.indexOf(k) !== i);
  if (dupes.length) { console.log(`ABORTED ${slug}: duplicate supportingKeywords`, dupes); continue; }
  if (newSupporting.length !== 5) { console.log(`ABORTED ${slug}: supportingKeywords count is ${newSupporting.length}, not 5`); continue; }

  p.supportingKeywords = newSupporting;
  applied++;

  auditLog.push({
    slug,
    primary: { old: oldPrimary, new: r.primary, source: 'semrush-live-2026-11-23' },
    supporting: newSupporting.map((k) => ({ keyword: k, source: r.realSupporting.includes(k) ? 'semrush-live-2026-11-23' : 'hand-written-pending-verification' })),
  });
}

const primaries = products.map((p) => p.primaryKeyword.toLowerCase());
const dupePrimaries = primaries.filter((p, i) => primaries.indexOf(p) !== i);
if (dupePrimaries.length) console.log('WARNING duplicate primaryKeyword values sitewide:', [...new Set(dupePrimaries)]);

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');

const auditPath = path.resolve('docs/gear-keyword-audit-2026-11.md');
let md = `# Gear-accessories keyword research audit — 2026-11-23\n\n`;
md += `Live Semrush Keyword Magic Tool research (browser-driven) against the new T-priority keyword rule. ` +
      `10 of 40 gear-accessories products had usable real Transactional/Commercial data; the other 29 had ` +
      `zero pure-intent matches even after retrying with corrected real product names and broader generic ` +
      `terms, and were left untouched pending a proper CSV export.\n\n` +
      `Each entry below shows which keyword came from real Semrush data vs. which slots were padded with the ` +
      `product's existing hand-written keywords (pending future verification) because real data ran out before 5.\n\n`;
for (const a of auditLog) {
  md += `## ${a.slug}\n\n`;
  md += `- **primaryKeyword**: \`${a.primary.old}\` -> \`${a.primary.new}\` (${a.primary.source})\n`;
  md += `- **supportingKeywords**:\n`;
  for (const s of a.supporting) md += `  - \`${s.keyword}\` — ${s.source}\n`;
  md += `\n`;
}
fs.writeFileSync(auditPath, md);

console.log(`Applied to ${applied}/${Object.keys(RESEARCH).length} products.`);
console.log(`Audit log written to ${path.relative(process.cwd(), auditPath)}`);
