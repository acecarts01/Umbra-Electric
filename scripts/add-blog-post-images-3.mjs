// Crops 15 already-committed product photos (public/images/products/) into
// 16:10 blog card images for the 15 posts added in add-blog-posts-2026-11.mjs.
// Same discipline as add-blog-post-images-2.mjs: reused real catalog photos,
// no new imagery introduced, no upscaling. Output committed under
// public/images/blog/; this script does not run as part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('public/images/products');
const OUT = path.resolve('public/images/blog');
fs.mkdirSync(OUT, { recursive: true });

const MAP = {
  'best-electric-dirt-bikes-under-5000': 'emortal-rogue-mx-01.webp',
  'best-premium-electric-dirt-bikes-over-10000': 'stark-varg-standard.webp',
  'best-electric-mountain-bikes-under-8000': 'giant-trance-x-eplus-elite.webp',
  'best-electric-gravel-road-bikes-under-6000': 'cannondale-topstone-neo-carbon-3.webp',
  'best-electric-commuter-bikes-under-2000': 'ride1up-turris.webp',
  'best-step-through-electric-bikes-for-comfort': 'aventon-pace-500-3-step-through.webp',
  'best-fat-tire-electric-bikes-under-2000': 'lectric-xp-3-0-fat-tire.webp',
  'best-folding-electric-bikes-under-1500': 'lectric-xp-lite-2-0.webp',
  'best-sur-ron-talaria-alternatives-under-5000': '79bike-falcon-pro.webp',
  'how-the-reservation-deposit-works': 'zero-fx.webp',
  'how-to-buy-an-electric-dirt-bike-online-ordering-guide': 'talaria-sting-r-mx4.webp',
  'best-kids-electric-dirt-bikes-under-2000': 'razor-mx350-ages-7plus.webp',
  'best-kids-electric-bikes-under-1500': 'aventon-sinch-jr-kids-folding.webp',
  'best-electric-dirt-bikes-for-farm-ranch-trail-work': 'emortal-rogue-mx-01-fat-tire-off-road.webp',
  'stark-varg-vs-ktm-freeride-e-xc': 'ktm-freeride-e-xc.webp',
};

// Dirt-bike side-profile photos need 'top' anchoring (entropy-based 'attention'
// crops the cockpit/handlebars off) -- same fix documented in add-blog-post-images-2.mjs.
const POSITION_OVERRIDE = {
  'best-electric-dirt-bikes-under-5000': 'top',
  'best-premium-electric-dirt-bikes-over-10000': 'top',
  'best-sur-ron-talaria-alternatives-under-5000': 'top',
  'how-the-reservation-deposit-works': 'top',
  'how-to-buy-an-electric-dirt-bike-online-ordering-guide': 'top',
  'best-kids-electric-dirt-bikes-under-2000': 'top',
  'best-electric-dirt-bikes-for-farm-ranch-trail-work': 'top',
  'stark-varg-vs-ktm-freeride-e-xc': 'top',
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
