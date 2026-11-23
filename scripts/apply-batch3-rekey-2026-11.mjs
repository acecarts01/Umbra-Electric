// Applies fresh live Semrush Keyword Magic Tool research (browser-driven,
// 2026-11-23 session, second pass against a fresh account link) to 13
// products that were previously partial or lost. Real data filled some or
// all of the 5 supporting slots; remaining slots padded with each product's
// existing hand-written keywords in original order. 9 other products
// (Pivot Shuttle LT/SL, Electric Bike Company Model S, Segway Muxi,
// Segway Xaber 300 both colorways, RFN Warrior Pro, Giant Reign E+ Pro,
// Giant Talon E+ Jr) were re-checked and confirmed to have zero usable real
// data -- left untouched, logged in the audit doc. Not part of the build,
// run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

const RESEARCH = {
  'ride1up-portola-folding': {
    primary: 'ride1up portola',
    realSupporting: ['ride1up portola electric bike', 'ride1up portola e-bike', 'ride1up portola reviews', 'ride1up portola review', 'ride1up portola vs lectric xp4'],
  },
  'ride1up-prodigy': {
    // Pure Commercial primary -- no pure-Transactional keyword exists for this product.
    // Entity note: real volume is on "Prodigy V2" (current-gen name); our catalog lists
    // the base "Ride1Up Prodigy" which is the same current model (V1 is discontinued).
    primary: 'ride1up prodigy v2 review',
    realSupporting: [],
  },
  'ride1up-lmt-d': {
    primary: 'ride1up lmtd v2',
    realSupporting: [],
  },
  'lectric-one': {
    primary: 'lectric one ebike for sale',
    realSupporting: ['lectric one reviews', 'lectric one long range ebike', 'lectric one review'],
  },
  'lectric-xp-lite-2-0': {
    // Pure Commercial primary -- checked, no pure-Transactional keyword exists (every
    // T-tagged row for this product is a compound "Informational, Transactional" label).
    primary: 'lectric xp lite 2.0 review',
    realSupporting: ['lectric xp lite 2.0 reviews', 'lectric xp lite 2.0 e bike', 'lectric xp lite 2.0 top speed', 'lectric ebikes xp lite 2.0'],
  },
  'e-ride-pro-ss-2-0': {
    primary: 'e ride pro ss 2.0 price',
    realSupporting: ['e ride pro ss 2.0 graphics kit', 'e ride pro ss 2.0 upgrades', 'e ride pro ss 2.0 electric bike'],
  },
  'segway-myon': {
    // Pure Commercial primary -- no pure-Transactional keyword exists for this product.
    primary: 'segway myon ebike review',
    realSupporting: ['segway myon review'],
  },
  'talaria-sting-mx3-xxx': {
    primary: 'talaria sting mx3 price',
    realSupporting: ['talaria sting mx3 top speed'],
  },
  'ktm-sx-e-5-ages-4-10': {
    primary: 'ktm sx-e 5 price',
    realSupporting: [],
  },
  'rad-power-bikes-radrover-6-plus': {
    primary: 'radrover 6 plus for sale',
    realSupporting: ['radrover 6 plus reviews', 'radrover 6 plus ebike', 'radrover 6 plus price', 'radrover 6 plus review'],
  },
  'specialized-turbo-kenevo-sl-expert': {
    primary: 'specialized turbo kenevo sl 2 expert',
    realSupporting: [],
  },
  'specialized-turbo-vado-sl-4-0': {
    primary: 'specialized turbo vado sl 4',
    realSupporting: [],
  },
  'specialized-turbo-vado-sl-5-0': {
    primary: 'specialized turbo vado sl 5',
    realSupporting: [],
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
    primary: { old: oldPrimary, new: r.primary, source: 'semrush-live-2026-11-23-pass2' },
    supporting: newSupporting.map((k) => ({ keyword: k, source: r.realSupporting.includes(k) ? 'semrush-live-2026-11-23-pass2' : 'hand-written-pending-verification' })),
  });
}

const primaries = products.map((p) => p.primaryKeyword.toLowerCase());
const dupePrimaries = primaries.filter((p, i) => primaries.indexOf(p) !== i);
if (dupePrimaries.length) console.log('WARNING duplicate primaryKeyword values sitewide:', [...new Set(dupePrimaries)]);

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');

const auditPath = path.resolve('docs/batch3-keyword-audit-2026-11.md');
let md = `# Batch 3 keyword rekey audit — 2026-11-23 (second live Semrush pass)\n\n`;
md += `Fresh live Semrush Keyword Magic Tool research against a new account link, covering the ` +
      `products that were previously lost (transcript extraction had no recoverable text) or partial ` +
      `(fewer than 5 real supporting keywords). 13 products got usable real data this pass; the ` +
      `remaining slots are padded with each product's existing hand-written keywords.\n\n`;
for (const a of auditLog) {
  md += `## ${a.slug}\n\n`;
  md += `- **primaryKeyword**: \`${a.primary.old}\` -> \`${a.primary.new}\` (${a.primary.source})\n`;
  md += `- **supportingKeywords**:\n`;
  for (const s of a.supporting) md += `  - \`${s.keyword}\` — ${s.source}\n`;
  md += `\n`;
}
md += `## Pure-Commercial-primary exceptions (CLAUDE.md Keyword Rules documented fallback)\n\n`;
md += `- **ride1up-prodigy**: no pure-Transactional keyword exists; real volume is concentrated on ` +
      `"Prodigy V2" (the current generation — V1 is discontinued, so this is the same product our ` +
      `catalog lists as the base "Ride1Up Prodigy").\n`;
md += `- **lectric-xp-lite-2-0**: no pure-Transactional keyword exists; every Transactional-tagged row ` +
      `for this product carries a compound "Informational, Transactional" label, which disqualifies it ` +
      `under the compound-intent rule.\n`;
md += `- **segway-myon**: no pure-Transactional keyword exists at all; only 2 pure-Commercial keywords ` +
      `found in the entire dataset (35 total keywords, most Informational or n/a).\n\n`;
md += `## Re-checked and confirmed zero real usable data (left untouched)\n\n`;
md += `pivot-shuttle-lt-team-xtr, pivot-shuttle-sl-pro-xt-xtr, electric-bike-company-model-s, ` +
      `segway-muxi-folding, segway-xaber-300-black-diamond, segway-xaber-300-shred-velvet, ` +
      `rfn-warrior-pro, giant-reign-eplus-pro, giant-talon-eplus-29-jr. Each was searched directly ` +
      `(and, where a narrower product-only search returned nothing, with a broader brand/model search ` +
      `too) and returned either 0 total keywords or only n/a-intent / zero-volume rows.\n`;
fs.writeFileSync(auditPath, md);

console.log(`Applied to ${applied}/${Object.keys(RESEARCH).length} products.`);
console.log(`Audit log written to ${path.relative(process.cwd(), auditPath)}`);
