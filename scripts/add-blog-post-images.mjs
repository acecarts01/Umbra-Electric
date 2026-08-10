// Crops 12 client-supplied product photos (from "ELECTRIC DIRT BIKES PRODUCT
// IMAGES/") into 16:10 blog card images for the 12 new posts added by
// add-blog-posts.mjs. Same never-upscale discipline as the other
// process-*-images.mjs scripts. Output committed under public/images/blog/;
// this script does not run as part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('ELECTRIC DIRT BIKES PRODUCT IMAGES');
const OUT = path.resolve('public/images/blog');
fs.mkdirSync(OUT, { recursive: true });

// slug -> source product photo (base/primary angle, no numeric suffix).
// Picked for topical fit with each post; no two posts share a bike.
// Picked the highest-resolution available angle per model -- several base
// (no-suffix) filenames turned out to be thumbnail-sized (e.g. 200x200),
// so this maps to specific numbered variants where those are larger.
const MAP = {
  'essential-gear-for-electric-dirt-bike-riding': 'KTM Freeride E XC 1.webp',
  'electric-dirt-bike-maintenance-checklist': 'Sur-Ron Storm Bee.webp',
  'electric-dirt-bike-battery-care-guide': 'Stark Varg (Standard) 2.webp',
  'how-much-does-it-cost-to-charge-an-ebike': 'Aventon Level 3 2.webp',
  'how-to-finance-a-premium-electric-dirt-bike': 'Santa Cruz Heckler SL CC X0 AXS.webp',
  'how-to-transport-an-electric-dirt-bike': 'Zero FX.webp',
  'cold-weather-riding-tips-electric-bikes': 'Rad Power Bikes RadRover 6 Plus.webp',
  'choosing-the-right-size-electric-mountain-bike': 'Yeti 160E T2 1.webp',
  'fat-tire-vs-standard-ebike': 'Aventon Aventure.2 (Fat Tire).webp',
  'folding-ebike-buyers-guide': 'Lectric XP 3.0 Folding 1.webp',
  'e-bike-vs-electric-dirt-bike-difference': 'E Ride Pro SS 2.0.webp',
  'throttle-emotos-vs-pedal-assist-emtbs': 'Specialized Turbo Levo SL Comp Carbon.webp',
  // The 3 original posts that never got an image in the first pass.
  'electric-vs-gas-dirt-bikes-cost': '79Bike Falcon Pro.webp',
  'how-to-choose-premium-emtb': 'Santa Cruz Heckler Carbon CC X0 AXS.webp',
  'sur-ron-vs-talaria-2026': 'Sur-Ron Ultra Bee.png',
};

// Per-slug crop position override -- 'attention' (entropy-based, the
// default) sometimes centers on the busiest mechanical detail and crops
// off the bike's silhouette on a near-square source; these read better
// anchored toward the top so the cockpit/seat stays in frame.
const POSITION_OVERRIDE = {
  'sur-ron-vs-talaria-2026': 'top',
};

function maxCoverSize(meta, aspectW, aspectH) {
  const targetRatio = aspectW / aspectH;
  const srcRatio = meta.width / meta.height;
  if (srcRatio > targetRatio) {
    const h = meta.height;
    return { w: Math.round(h * targetRatio), h };
  }
  const w = meta.width;
  return { w, h: Math.round(w / targetRatio) };
}

for (const [slug, file] of Object.entries(MAP)) {
  const srcPath = path.join(SRC, file);
  const meta = await sharp(srcPath).metadata();
  const { w, h } = maxCoverSize(meta, 16, 10);
  const outPath = path.join(OUT, `${slug}.webp`);
  await sharp(srcPath)
    .resize(w, h, { fit: 'cover', position: POSITION_OVERRIDE[slug] || 'attention' })
    .flatten({ background: '#ffffff' })
    .webp({ quality: 88 })
    .toFile(outPath);
  console.log(`${slug}.webp <- ${file} (${meta.width}x${meta.height} -> ${w}x${h})`);
}
