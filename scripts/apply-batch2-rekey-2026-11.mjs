// Applies live Semrush Keyword Magic Tool research, recovered from the
// pre-compaction session transcript (fork extraction, 2026-11-23), to 11
// products: 5 with clean verbatim 6-keyword sets, 6 that needed their
// supporting-keyword shorthand reconstructed back to full phrases. Where
// real data fell short of 5 supporting slots (after excluding
// entity-contaminated or unverifiable candidates), the remaining slots are
// padded with the product's existing hand-written keywords, kept in their
// original order, per the same pattern as apply-gear-keyword-research-2026-11.mjs.
// Not part of the build, run manually.
import fs from 'fs';
import path from 'path';

const PRODUCTS_PATH = path.resolve('src/data/products.json');
const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf8'));

// { slug: { primary, realSupporting: [...] } } -- realSupporting already
// excludes anything flagged entity-contaminated/unverifiable in the extraction.
const RESEARCH = {
  'aventon-aventure-2-fat-tire': {
    primary: 'aventon aventure 2 price',
    realSupporting: ['aventon aventure 2 review', 'aventon aventure 2 reviews', 'aventon aventure 2 step over ebike', 'aventon aventure.2 reviews', 'aventon aventure 2 accessories'],
  },
  'aventon-level-3': {
    primary: 'aventon level 3 price',
    realSupporting: ['aventon level 3 review', 'aventon level 3 e bike review', 'aventon level 3 accessories', 'aventon level 3 commuter ebike reviews', 'aventon level 3 ebike reviews'],
  },
  'razor-mx500-ages-13plus': {
    primary: 'razor mx500 price',
    realSupporting: ['razor mx500 upgrade kit', 'razor mx500 charger', 'razor mx500 plastics', 'used razor mx500', 'razor mx500 battery charger'],
  },
  'razor-mx650-ages-14plus': {
    // Pure Commercial primary -- documented zero-Transactional exception (CLAUDE.md Keyword Rules):
    // real data checked, no pure-Transactional keyword exists for this product.
    primary: 'razor mx650 upgrade kit',
    realSupporting: ['razor mx650 frame', 'modded razor mx650', 'razor mx650 72v upgrade kit', 'razor mx650 mods', 'razor mx650 plastics'],
  },
  'e-ride-pro-sr': {
    primary: 'e ride pro sr price',
    // Dropped 'e-ride pro sr price' (hyphenation near-duplicate of the primary) -- padded below.
    realSupporting: ['e ride pro sr top speed', 'e ride pro sr for sale', 'e ride pro sr electric dirt bike', 'e ride pro sr electric bike'],
  },
  'aventon-pace-500-3': {
    primary: 'aventon pace 500.3 price',
    // Dropped 'aventon pace 500.3 st' -- entity-contaminated, belongs to the separate
    // aventon-pace-500-3-step-through product. Padded below.
    realSupporting: ['aventon pace 500.3 review', 'aventon pace 500.3 reviews', 'aventon pace 500.3 battery', 'aventon pace 500.3 accessories'],
  },
  'lectric-xp-3-0': {
    primary: 'lectric xp 3.0 for sale',
    realSupporting: ['lectric xp 3.0 electric bike', 'lectric xp 3.0 price', 'lectric xp 3.0 top speed', 'lectric xp 3.0 review', 'lectric xp 3.0 specs'],
  },
  'happyrun-g300-pro': {
    primary: 'happyrun g300 pro price',
    // Dropped the generic spec phrase (no brand/model name, unverifiable entity match)
    // and the 5th candidate (truncated/unusable in the original notes). Padded below.
    realSupporting: ['happyrun g300 pro review', 'happyrun g300 pro reviews', 'happyrun 6500w electric dirt bike g300 pro'],
  },
  '79bike-falcon-pro': {
    primary: '79bike falcon pro price',
    realSupporting: ['79bike falcon pro top speed', '79bike falcon pro upgrades', '79bike falcon pro parts', '79bike falcon pro review', '79bike falcon pro reviews'],
  },
  'altis-sigma': {
    primary: 'altis sigma for sale',
    realSupporting: ['altis sigma electric dirt bike', 'altis sigma price', 'altis sigma e bike', 'altis sigma ebike', 'altis sigma parts'],
  },
  'bonnell-775-mx': {
    primary: 'bonnell 775 mx price',
    realSupporting: ['bonnell 775 mx for sale', 'bonnell 775 mx top speed', 'bonnell 775 mx review', 'bonnell 775 mx conversion kit', 'bonnell 775 mx medium'],
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

const auditPath = path.resolve('docs/batch2-keyword-audit-2026-11.md');
let md = `# Batch 2 keyword rekey audit — 2026-11-23\n\n`;
md += `Live Semrush Keyword Magic Tool research, recovered from the pre-compaction session transcript ` +
      `(fork extraction) and reconstructed where my own notes had abbreviated the brand/model prefix. ` +
      `11 products: 5 with clean verbatim 6-keyword sets, 6 reconstructed. Entity-contaminated or ` +
      `unverifiable candidates identified during extraction were dropped rather than used, with the ` +
      `resulting gap padded from each product's existing hand-written keywords.\n\n`;
for (const a of auditLog) {
  md += `## ${a.slug}\n\n`;
  md += `- **primaryKeyword**: \`${a.primary.old}\` -> \`${a.primary.new}\` (${a.primary.source})\n`;
  md += `- **supportingKeywords**:\n`;
  for (const s of a.supporting) md += `  - \`${s.keyword}\` — ${s.source}\n`;
  md += `\n`;
}
md += `## Notes\n\n`;
md += `- **razor-mx650-ages-14plus**: primary \`razor mx650 upgrade kit\` is pure Commercial — documented ` +
      `zero-Transactional exception per CLAUDE.md Keyword Rules (checked, no pure-Transactional keyword ` +
      `exists in the real data for this product).\n`;
md += `- **e-ride-pro-sr**: dropped \`e-ride pro sr price\` (hyphenation near-duplicate of the primary ` +
      `\`e ride pro sr price\`); padded with 1 existing hand-written keyword.\n`;
md += `- **aventon-pace-500-3**: dropped \`aventon pace 500.3 st\` — real volume belongs to the separate ` +
      `aventon-pace-500-3-step-through product, not this base model; padded with 1 existing hand-written keyword.\n`;
md += `- **happyrun-g300-pro**: dropped a generic spec phrase with no brand/model name (unverifiable entity ` +
      `match) and a 5th candidate that was truncated/unusable in the original notes; padded with 2 existing ` +
      `hand-written keywords.\n`;
fs.writeFileSync(auditPath, md);

console.log(`Applied to ${applied}/${Object.keys(RESEARCH).length} products.`);
console.log(`Audit log written to ${path.relative(process.cwd(), auditPath)}`);
