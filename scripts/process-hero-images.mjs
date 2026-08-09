// One-off: process the client-supplied category + hero source photos into
// optimized, correctly-cropped WebP files (output already committed under
// public/images/categories/ and public/images/hero/ — this script does not
// run as part of the build). The original source photos were never
// committed (too large, unprocessed) and have been moved out of the repo;
// point SRC at wherever they live if you need to re-run this.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('hero images downloaded');
const CAT_OUT = path.resolve('public/images/categories');
const HERO_OUT = path.resolve('public/images/hero');

const CATEGORY_MAP = {
  'adult electric dirt bikes.jpg': 'adult-electric-dirt-bikes',
  'kids and youth electric dirt bikes.jpg': 'kids-electric-dirt-bikes',
  'electric mountain bikes.jpg': 'electric-mountain-bikes',
  'electric commuter and urban bikes.jpg': 'electric-commuter-bikes',
  'electric road and gravel bikes.jpg': 'electric-road-gravel-bikes',
  'electric fat tire bikes.jpg': 'electric-fat-tire-bikes',
  'kids and youth e bikes.jpg': 'kids-electric-bikes',
  'folding e bikes.jpg': 'folding-electric-bikes',
};

// The 4 best of the "unnamed" stock photos for the homepage hero slider.
// Excluded: pexels-rileyfranzke-33701503.jpg (gas-powered Honda motorcycle —
// wrong product category for an electric-only store) and the two weaker/
// less premium candidates (shaun-rodriguez muddy crowd race, the plain park
// lifestyle shot) in favor of the four most premium, on-brand images.
const HERO_FILES = [
  'pexels-cottonbro-5803139.jpg',
  'pexels-robertkso-37134601.jpg',
  'istockphoto-1232568015-612x612.jpg',
  'istockphoto-1168532082-612x612.jpg',
];

async function writeUnderBudget(pipeline, outPath, budgetKB, startQuality) {
  let quality = startQuality;
  let buf;
  do {
    buf = await pipeline.clone().webp({ quality }).toBuffer();
    quality -= 8;
  } while (buf.length / 1024 > budgetKB && quality > 35);
  fs.writeFileSync(outPath, buf);
  return buf.length;
}

async function main() {
  fs.mkdirSync(CAT_OUT, { recursive: true });
  fs.mkdirSync(HERO_OUT, { recursive: true });

  console.log('--- Category tiles (4:3 cover, 1600x1200) ---');
  for (const [file, slug] of Object.entries(CATEGORY_MAP)) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log('MISSING', file); continue; }
    const pipeline = sharp(src).rotate().resize(1600, 1200, { fit: 'cover', position: 'attention' }).sharpen({ sigma: 0.5 });
    const out = path.join(CAT_OUT, `${slug}.webp`);
    const bytes = await writeUnderBudget(pipeline, out, 180, 84);
    console.log(slug, (bytes / 1024).toFixed(0) + 'KB');
  }

  console.log('--- Hero slides (16:9 cover, 2400x1350) ---');
  for (let i = 0; i < HERO_FILES.length; i++) {
    const src = path.join(SRC, HERO_FILES[i]);
    if (!fs.existsSync(src)) { console.log('MISSING', HERO_FILES[i]); continue; }
    const pipeline = sharp(src).rotate().resize(2400, 1350, { fit: 'cover', position: 'attention' }).sharpen({ sigma: 0.5 });
    const out = path.join(HERO_OUT, `hero-${i + 1}.webp`);
    const bytes = await writeUnderBudget(pipeline, out, 280, 84);
    console.log(`hero-${i + 1}`, HERO_FILES[i], (bytes / 1024).toFixed(0) + 'KB');
  }

  console.log('done');
}

main();
