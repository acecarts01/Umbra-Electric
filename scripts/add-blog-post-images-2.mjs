// Crops 25 already-committed product photos (public/images/products/) into
// 16:10 blog card images for the 25 posts added in this pass. Source is the
// finished catalog photo, not a raw client folder -- these are all real
// product shots that already ship on the corresponding /product/ page, so
// there's no new imagery being introduced, just reused. Same never-upscale
// discipline as the other process-*-images.mjs scripts. Output committed
// under public/images/blog/; this script does not run as part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('public/images/products');
const OUT = path.resolve('public/images/blog');
fs.mkdirSync(OUT, { recursive: true });

// post slug -> source product photo filename (always the base/primary angle,
// no numeric suffix -- confirmed by visual inspection to be a clean side-on
// studio shot with the full bike in frame on every brand checked).
const MAP = {
  'sur-ron-light-bee-x-vs-ultra-bee': 'sur-ron-ultra-bee.webp',
  'sur-ron-ultra-bee-vs-storm-bee': 'sur-ron-storm-bee.webp',
  'talaria-sting-mx3-vs-sting-r-mx4': 'talaria-sting-r-mx4.webp',
  'talaria-sting-r-mx4-vs-komodo': 'talaria-sting-r-mx4.webp',
  'segway-xaber-300-vs-talaria': 'segway-xaber-300-black-diamond.webp',
  'stark-varg-vs-varg-ex': 'stark-varg-ex-street-legal-enduro.webp',
  'ktm-freeride-e-xc-vs-e-sm': 'ktm-freeride-e-xc-3.webp',
  'best-electric-dirt-bike-brands-compared': 'stark-varg-standard.webp',
  'electric-dirt-bike-weight-rider-fit-guide': 'talaria-sting-r-mx4.webp',
  'zero-xb-vs-xe': 'zero-xe-2026.webp',
  'zero-xe-vs-fx': 'zero-fx.webp',
  'yeti-160e-c2-vs-c3': 'yeti-160e-c3.webp',
  'santa-cruz-heckler-sl-vs-bullit': 'santa-cruz-heckler-sl-cc-x0-axs.webp',
  'santa-cruz-heckler-sl-vs-specialized-turbo-levo-sl': 'specialized-turbo-levo-sl-comp-carbon.webp',
  'pivot-shuttle-vs-yeti-160e': 'pivot-shuttle-lt-team-xtr.webp',
  'cannondale-moterra-neo-vs-trek-rail': 'cannondale-moterra-neo-carbon-1-2.webp',
  'trek-rail-7-vs-powerfly-fs-9-9': 'trek-rail-7.webp',
  'carbon-vs-alloy-electric-mountain-bikes': 'trek-powerfly-fs-9-9.webp',
  'specialized-turbo-creo-sl-comp-carbon-vs-expert-evo': 'specialized-turbo-creo-sl-expert-evo.webp',
  'rad-power-bikes-vs-aventon': 'rad-power-bikes-radcity-5-plus.webp',
  'serial-1-vs-trek-allant': 'serial-1-rush-cty-step-thru.webp',
  'electric-commuter-vs-folding-ebike': 'lectric-xp-3-0-2.webp',
  'electric-fat-tire-bikes-for-snow-and-sand': 'aventon-aventure-2-fat-tire.webp',
  'kids-electric-dirt-bike-buying-guide-by-age': 'ktm-sx-e-5-ages-4-10-4.webp',
  'electric-bike-financing-explained': 'yeti-160e-c3.webp',
};

// Per-slug crop position override -- 'attention' (entropy-based, the
// default) works well for the more evenly-framed eMTB/commuter photos, but
// a visual check found it crops the tall front fork/cockpit off dirt-bike
// side profiles (their busiest/most textured area reads as the wheels, so
// entropy shifts the keep-window down and loses the handlebars). Anchoring
// those to the top keeps the whole bike in frame, same fix the original
// add-blog-post-images.mjs already needed for sur-ron-vs-talaria-2026.
const POSITION_OVERRIDE = {
  'sur-ron-light-bee-x-vs-ultra-bee': 'top',
  'sur-ron-ultra-bee-vs-storm-bee': 'top',
  'talaria-sting-mx3-vs-sting-r-mx4': 'top',
  'talaria-sting-r-mx4-vs-komodo': 'top',
  'segway-xaber-300-vs-talaria': 'top',
  'stark-varg-vs-varg-ex': 'top',
  'ktm-freeride-e-xc-vs-e-sm': 'top',
  'best-electric-dirt-bike-brands-compared': 'top',
  'electric-dirt-bike-weight-rider-fit-guide': 'top',
  'zero-xb-vs-xe': 'top',
  'zero-xe-vs-fx': 'top',
  'kids-electric-dirt-bike-buying-guide-by-age': 'top',
  'ktm-freeride-e-xc-vs-e-sm': 'top',
  'talaria-sting-r-mx4-vs-komodo': 'top',
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
