// One-off: parse the new Semrush export batch (New Semrush Keywords/*.csv),
// merge duplicate re-exports per product, strip freebie/sponsorship terms,
// apply keyword-engine Phase 1 filters (niche relevance, intent-sensitive
// volume floor, KD ceiling, dedup), and score/sort per product so a human
// can hand-pick primary + secondaries for the remap proposal. Read-only --
// writes a JSON report, does not touch products.json. Not part of the build.
import fs from 'fs';
import path from 'path';

const DIR = path.resolve('New Semrush Keywords');
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.csv'));

// crude CSV parser handling quoted fields with embedded commas
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// filename prefix -> product grouping key
const GROUP_MAP = [
  [/^KTM-Freeride-E-XC/i, 'ktm-freeride-e-xc'],
  [/^Santa-Cruz-Heckler-Carbon/i, 'santa-cruz-heckler-family-carbon'],
  [/^Santa-Cruz-Heckler/i, 'santa-cruz-heckler-family'],
  [/^specialized-turbo-levo-sl/i, 'specialized-turbo-levo-sl-family'],
  [/^Stark-Varg-EX/i, 'stark-varg-ex'],
  [/^Stark-Varg/i, 'stark-varg-standard'],
  [/^Sur-ron-Light-Bee|^Sur-Ron-Light-Bee-X/i, 'sur-ron-light-bee-x'],
  [/^SurRon-Storm-Bee/i, 'sur-ron-storm-bee'],
  [/^Talaria-Komodo/i, 'talaria-komodo-new-2026'],
  [/^Talaria-Sting-R-MX4/i, 'talaria-sting-r-mx4'],
  [/^Trek-Rail/i, 'trek-rail-family'],
  [/^Yeti-160E/i, 'yeti-160e-family'],
  [/^Zero-FX/i, 'zero-fx'],
  [/^Zero-Xb|^Zero-XB/i, 'zero-xb-2026'],
  [/^Zero-XE/i, 'zero-xe-2026'],
  [/^e-bike-conversion-kit/i, 'e-bike-conversion-kit-GENERAL'],
];

function groupFor(filename) {
  for (const [re, key] of GROUP_MAP) if (re.test(filename)) return key;
  return 'UNMATCHED:' + filename;
}

// freebie / sponsorship / partnership exclusion filter
const FREEBIE_RE = /\bfree\b|giveaway|sponsor|sponsorship|partnership|collab|ambassador|donate|donation|charity|win a\b|affiliate program|influencer|promo code|free bike|free ebike/i;

const groups = {};
for (const f of files) {
  const text = fs.readFileSync(path.join(DIR, f), 'utf8');
  const rows = parseCSV(text).filter((r) => r.length >= 4 && r[0] && r[0] !== 'Keyword');
  const key = groupFor(f);
  if (!groups[key]) groups[key] = [];
  for (const r of rows) {
    const [Keyword, Intent, Volume, KD, CPC] = r;
    groups[key].push({
      keyword: Keyword.trim().toLowerCase(),
      intent: Intent.trim(),
      volume: parseInt(Volume, 10) || 0,
      kd: parseInt(KD, 10) || 0,
      cpc: parseFloat(CPC) || 0,
      src: f,
    });
  }
}

const report = {};
for (const [key, rows] of Object.entries(groups)) {
  // dedup by keyword, keep highest-volume instance
  const byKw = new Map();
  for (const r of rows) {
    const existing = byKw.get(r.keyword);
    if (!existing || r.volume > existing.volume) byKw.set(r.keyword, r);
  }
  let deduped = [...byKw.values()];
  const totalBeforeFilter = deduped.length;

  // strip freebie/sponsorship terms
  const freebieHits = deduped.filter((r) => FREEBIE_RE.test(r.keyword));
  deduped = deduped.filter((r) => !FREEBIE_RE.test(r.keyword));

  // keep only Transactional + Commercial for product pages (per user instruction)
  const tc = deduped.filter((r) => /transactional|commercial/i.test(r.intent));
  const dropped_intent = deduped.filter((r) => !/transactional|commercial/i.test(r.intent));

  // intent-sensitive volume floor: Transactional 20+, Commercial 50+
  const passesFloor = tc.filter((r) => {
    if (/transactional/i.test(r.intent)) return r.volume >= 20;
    if (/commercial/i.test(r.intent)) return r.volume >= 50;
    return false;
  });
  const belowFloor = tc.filter((r) => !passesFloor.includes(r));

  // KD ceiling: drop 55+, 35-54 = supporting only
  const primaryPool = passesFloor.filter((r) => r.kd < 35);
  const supportingPool = passesFloor.filter((r) => r.kd >= 35 && r.kd < 55);
  const droppedKD = passesFloor.filter((r) => r.kd >= 55);

  primaryPool.sort((a, b) => b.volume - a.volume || a.kd - b.kd);
  supportingPool.sort((a, b) => b.volume - a.volume || a.kd - b.kd);

  report[key] = {
    totalRaw: rows.length,
    totalDeduped: totalBeforeFilter,
    freebieStripped: freebieHits.map((r) => r.keyword),
    droppedNonTC: dropped_intent.length,
    belowVolumeFloor: belowFloor.length,
    droppedKD55plus: droppedKD.length,
    primaryPool: primaryPool.map((r) => ({ kw: r.keyword, intent: r.intent, vol: r.volume, kd: r.kd, cpc: r.cpc })),
    supportingPool: supportingPool.map((r) => ({ kw: r.keyword, intent: r.intent, vol: r.volume, kd: r.kd, cpc: r.cpc })),
  };
}

const OUT = path.resolve('docs/semrush-export-2026-10-processed.json');
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log('Wrote', OUT);
for (const [key, r] of Object.entries(report)) {
  console.log(`\n=== ${key} ===`);
  console.log(`raw:${r.totalRaw} deduped:${r.totalDeduped} freebie-stripped:${r.freebieStripped.length} non-T/C dropped:${r.droppedNonTC} below-floor:${r.belowVolumeFloor} KD55+:${r.droppedKD55plus}`);
  console.log(`PRIMARY POOL (KD<35, top 10 by volume):`);
  r.primaryPool.slice(0, 10).forEach((k) => console.log(`  ${k.vol.toString().padStart(6)} vol | KD${k.kd.toString().padStart(3)} | ${k.intent.padEnd(13)} | ${k.kw}`));
  if (r.freebieStripped.length) console.log(`  [stripped: ${r.freebieStripped.join(', ')}]`);
}
