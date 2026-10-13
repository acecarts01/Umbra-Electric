// Crops 20 already-committed product photos (public/images/products/) into
// 16:10 blog card images for the 20 posts added in
// add-blog-posts-2026-10-batch2.mjs. Same discipline as
// add-blog-post-images-3.mjs: reused real catalog photos, no new imagery
// introduced, no upscaling. Output committed under public/images/blog/;
// this script does not run as part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('public/images/products');
const OUT = path.resolve('public/images/blog');
fs.mkdirSync(OUT, { recursive: true });

const MAP = {
  'electric-dirt-bike-battery-warranty-and-degradation-explained': 'surron-talaria-60v-spare-battery.webp',
  'electric-dirt-bike-resale-value-what-actually-holds-up': 'stark-varg-standard.webp',
  'why-electric-dirt-bikes-are-quieter-and-why-that-matters': 'talaria-sting-r-mx4.webp',
  'how-much-weight-can-an-electric-dirt-bike-actually-carry': 'happyrun-g300-pro.webp',
  'off-road-gear-guide-what-actually-protects-you': 'alpinestars-tech-7-boots.webp',
  'electric-dirt-bike-insurance-what-riders-get-wrong': 'sur-ron-ultra-bee.webp',
  'street-legal-electric-motorcycles-vs-off-road-only-models': 'zero-fx.webp',
  'ebike-theft-prevention-the-locks-that-actually-work': 'kryptonite-ny-fahgettaboudit-chain.webp',
  'night-riding-lighting-guide-for-electric-bikes': 'niterider-lumina-1200.webp',
  'battery-replacement-and-upgrade-guide-for-electric-bikes': 'bafang-52v-17-5ah-battery-pack.webp',
  'off-grid-charging-how-to-charge-an-electric-bike-anywhere': 'ecoflow-portable-power-station.webp',
  'riding-gear-by-season-what-changes-and-what-doesnt': 'fox-racing-flexair-gloves.webp',
  'commuter-ebike-vs-electric-dirt-bike-which-one-actually-fits-you': 'aventon-soltera-2.webp',
  'youth-to-adult-crossover-bikes-when-your-kid-outgrows-the-starter-model': 'husqvarna-ee-5-youth-adult-crossover.webp',
  'gps-and-ride-tracking-for-electric-bikes-worth-it-or-not': 'garmin-edge-mtb.webp',
  'new-for-2026-whats-actually-different-on-this-years-models': 'talaria-komodo-new-2026.webp',
  'high-voltage-explained-what-72v-actually-means-for-riders': 'tork-base-model-72v-16-8kw.webp',
  'electric-dirt-bike-weight-capacity-and-suspension-setup': 'kayo-ec2i.webp',
  'entry-level-electric-dirt-bikes-what-separates-the-good-ones': 'emortal-rogue-mx-01.webp',
};

// Dirt-bike / motorcycle side-profile shots need 'top' anchoring (entropy-based
// 'attention' crops the cockpit/handlebars off) -- same fix documented in
// add-blog-post-images-2.mjs / -3.mjs. Gear/accessory product shots (gloves,
// boots, batteries, lights, lock, GPS unit) are fine with entropy-based
// 'attention' since they're centered studio shots, not wide side profiles.
const POSITION_OVERRIDE = {
  'electric-dirt-bike-resale-value-what-actually-holds-up': 'top',
  'why-electric-dirt-bikes-are-quieter-and-why-that-matters': 'top',
  'how-much-weight-can-an-electric-dirt-bike-actually-carry': 'top',
  'street-legal-electric-motorcycles-vs-off-road-only-models': 'top',
  'commuter-ebike-vs-electric-dirt-bike-which-one-actually-fits-you': 'top',
  'youth-to-adult-crossover-bikes-when-your-kid-outgrows-the-starter-model': 'top',
  'new-for-2026-whats-actually-different-on-this-years-models': 'top',
  'high-voltage-explained-what-72v-actually-means-for-riders': 'top',
  'electric-dirt-bike-weight-capacity-and-suspension-setup': 'top',
  'entry-level-electric-dirt-bikes-what-separates-the-good-ones': 'top',
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
