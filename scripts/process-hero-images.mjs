// Process the client-supplied category + hero source photos into optimized,
// correctly-cropped WebP files -- NEVER upscaled past their native resolution.
//
// Output already committed under public/images/categories/ and
// public/images/hero/ -- this script does not run as part of the build.
// Source photos were never committed (too large, unprocessed); point SRC at
// wherever they live if you need to re-run this.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:\\Users\\USER\\AppData\\Local\\Temp\\claude\\C--VERCEL-PROJECTS-Umbra-Electric\\9809eeb5-0f55-4218-8ad2-2fca590c7faa\\scratchpad\\hero-images-source';
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

// The 4 best of the "unnamed" stock photos for the homepage hero slider, by
// BOTH composition and native resolution. Excluded: pexels-rileyfranzke
// (gas-powered Honda motorcycle -- wrong product category) and all three
// istockphoto-*-612x612.jpg files -- gorgeous compositions, but only
// 612px wide natively, far too small to blow up to a full-bleed hero banner
// without visible softness/blur. A 4th high-resolution shot was pulled in
// from the category folder (different crop, different context) to keep a
// 4-slide rotation without sacrificing sharpness.
const HERO_FILES = [
  'pexels-cottonbro-5803139.jpg',
  'pexels-robertkso-37134601.jpg',
  'pexels-shaun-rodriguez-1663903-11035342.jpg',
  'kids and youth electric dirt bikes.jpg',
];

// Largest box of the target aspect ratio that fits inside the native image
// with NO enlargement (scale <= 1 always), optionally capped by a ceiling.
function maxCoverSize(meta, aspectW, aspectH, ceilingW) {
  const desired = aspectW / aspectH;
  const native = meta.width / meta.height;
  let w, h;
  if (native > desired) {
    h = meta.height;
    w = Math.round(h * desired);
  } else {
    w = meta.width;
    h = Math.round(w / desired);
  }
  if (w > ceilingW) {
    w = ceilingW;
    h = Math.round(w / desired);
  }
  return { width: w, height: h };
}

// Source files are re-encoded fresh by next/image at request time (per
// viewport, per format), so these stored sources should favor fidelity over
// file size -- a soft/over-compressed source only compounds through that
// second encode. Quality floor is high; budget is generous.
async function writeUnderBudget(pipeline, outPath, budgetKB, startQuality) {
  let quality = startQuality;
  let buf;
  do {
    buf = await pipeline.clone().webp({ quality }).toBuffer();
    quality -= 4;
  } while (buf.length / 1024 > budgetKB && quality > 80);
  fs.writeFileSync(outPath, buf);
  return { bytes: buf.length, quality: quality + 4 };
}

async function main() {
  fs.mkdirSync(CAT_OUT, { recursive: true });
  fs.mkdirSync(HERO_OUT, { recursive: true });

  console.log('--- Category tiles/banners (4:3, native-crop, no upscale, cap 3840w) ---');
  for (const [file, slug] of Object.entries(CATEGORY_MAP)) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) { console.log('MISSING', file); continue; }
    const img = sharp(src).rotate();
    const meta = await img.metadata();
    const { width, height } = maxCoverSize(meta, 4, 3, 3840);
    const pipeline = img.resize(width, height, { fit: 'cover', position: 'attention', withoutEnlargement: true });
    const out = path.join(CAT_OUT, `${slug}.webp`);
    const { bytes, quality } = await writeUnderBudget(pipeline, out, 900, 92);
    console.log(slug, `${width}x${height}`, (bytes / 1024).toFixed(0) + 'KB', `q${quality}`);
  }

  console.log('--- Hero slides (16:9, native-crop, no upscale, cap 3840w) ---');
  for (let i = 0; i < HERO_FILES.length; i++) {
    const src = path.join(SRC, HERO_FILES[i]);
    if (!fs.existsSync(src)) { console.log('MISSING', HERO_FILES[i]); continue; }
    const img = sharp(src).rotate();
    const meta = await img.metadata();
    const { width, height } = maxCoverSize(meta, 16, 9, 3840);
    const pipeline = img.resize(width, height, { fit: 'cover', position: 'attention', withoutEnlargement: true });
    const out = path.join(HERO_OUT, `hero-${i + 1}.webp`);
    const { bytes, quality } = await writeUnderBudget(pipeline, out, 1100, 92);
    console.log(`hero-${i + 1}`, HERO_FILES[i], `${width}x${height}`, (bytes / 1024).toFixed(0) + 'KB', `q${quality}`);
  }

  console.log('done');
}

main();
