// Processes the 40 client-supplied gear/accessories photos (26 existing
// products that were missing images + 14 new products) into the standard
// white 4:3 1600x1200 product-frame treatment used across the rest of the
// catalog: trim -> enlarge-to-fill white canvas -> sharpen if upscaled ->
// adaptive-quality WebP + AVIF, written once (Windows EINVAL-safe retry).
// Source: "ELECTRIC DIRT BIKES PRODUCT IMAGES/" (already named to slug).
// Output: public/images/products/<slug>.webp + <slug>.avif (+ -2 for a
// second angle where the client supplied one). Not part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve('ELECTRIC DIRT BIKES PRODUCT IMAGES');
const OUT = path.resolve('public/images/products');
fs.mkdirSync(OUT, { recursive: true });

// slug -> [primary file, ...extra angle files]
const MAP = {
  'bell-moto-10-spherical': ['bell-moto-10-spherical.jfif'],
  'fox-racing-v3-rs-carbon': ['fox-racing-v3-rs-carbon.webp'],
  'alpinestars-tech-7-boots': ['alpinestars-tech-7-boots.jfif'],
  'leatt-3df-50-chest-protector': ['leatt-3df-50-chest-protector.webp'],
  '100-percent-armega-goggles': ['100-percent-armega-goggles.jpg'],
  'klim-dakar-gloves': ['klim-dakar-gloves.jpeg'],
  'uswe-raw-12-hydration-pack': ['uswe-raw-12-hydration-pack.jpg'],
  'fly-racing-kinetic-youth-helmet': ['fly-racing-kinetic-youth-helmet.jfif'],
  'leatt-youth-3df-chest-protector': ['leatt-youth-3df-chest-protector.webp'],
  'poc-pocito-joint-vpd-air-set': ['poc-pocito-joint-vpd-air-set.avif'],
  '7idp-transition-elbow-pads': ['7idp-transition-elbow-pads.webp'],
  'poc-tectal-race-mips': ['poc-tectal-race-mips.avif'],
  'fox-racing-flexair-gloves': ['fox-racing-flexair-gloves.webp', 'fox-racing-flexair-gloves 1.webp'],
  'garmin-edge-mtb': ['garmin-edge-mtb.webp', 'garmin-edge-mtb 1.webp'],
  'peak-design-out-front-mount': ['peak-design-out-front-mount.webp', 'peak-design-out-front-mount 1.jpg'],
  'kryptonite-ny-fahgettaboudit-chain': ['kryptonite-ny-fahgettaboudit-chain.jpg'],
  'hiplok-d1000': ['hiplok-d1000.jpg'],
  'quad-lock-out-front-mount': ['quad-lock-out-front-mount.jpg'],
  'niterider-lumina-1200': ['niterider-lumina-1200.webp'],
  'topeak-mtx-trunk-bag-rack': ['topeak-mtx-trunk-bag-rack.webp'],
  'garmin-edge-power-mount-charging-pack': ['garmin-edge-power-mount-charging-pack.jpg'],
  'santa-cruz-reserve-30-wheelset': ['santa-cruz-reserve-30-wheelset.webp'],
  'dt-swiss-h1900-spline-emtb-wheelset': ['dt-swiss-h1900-spline-emtb-wheelset.webp'],
  'stans-notubes-flow-mk4-wheelset': ['stans-notubes-flow-mk4-wheelset.jpg'],
  'reserve-27-5-carbon-gravel-wheelset': ['reserve-27-5-carbon-gravel-wheelset.webp'],
  'thule-easyfold-xt-2-hitch-rack': ['thule-easyfold-xt-2-hitch-rack.png'],
  'rockymounts-backstage-swing-away-hitch-rack': ['rockymounts-backstage-swing-away-hitch-rack.webp', 'rockymounts-backstage-swing-away-hitch-rack 1.jpg'],
  'surron-talaria-60v-spare-battery': ['surron-talaria-60v-spare-battery.webp', 'surron-talaria-60v-spare-battery 1.webp'],
  'specialized-levo-range-extender-battery': ['specialized-levo-range-extender-battery.webp'],
  'giant-energypak-range-extender': ['giant-energypak-range-extender.webp'],
  'universal-48v-commuter-ebike-battery': ['universal-48v-commuter-ebike-battery.webp'],
  'ecoflow-portable-power-station': ['ecoflow-portable-power-station.webp'],
  'anker-140w-power-bank': ['anker-140w-power-bank.webp'],
  'bosch-powertube-750wh-battery': ['bosch-powertube-750wh-battery.jpg'],
  'shimano-steps-bt-e8036-630wh-battery': ['shimano-steps-bt-e8036-630wh-battery.jpg', 'shimano-steps-bt-e8036-630wh-battery 1.jfif'],
  'bafang-52v-17-5ah-battery-pack': ['bafang-52v-17-5ah-battery-pack.webp'],
  'rad-power-bikes-radrover-spare-battery': ['rad-power-bikes-radrover-spare-battery.avif'],
  'bosch-fast-charger-6a': ['bosch-fast-charger-6a.webp'],
  'shimano-steps-smart-charger-ec-e6000': ['shimano-steps-smart-charger-ec-e6000.jpg'],
  'universal-48v-2a-smart-charger': ['universal-48v-2a-smart-charger.webp'],
};

const CANVAS_W = 1600, CANVAS_H = 1200, FILL = 0.9;

async function writeOnce(buf, outPath) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      fs.writeFileSync(outPath, buf);
      return;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
    }
  }
}

async function adaptiveEncode(pipeline, format, outPath) {
  const isWebp = format === 'webp';
  let q = isWebp ? 88 : 62;
  const floor = 40;
  let buf;
  while (true) {
    buf = isWebp
      ? await pipeline.clone().webp({ quality: q }).toBuffer()
      : await pipeline.clone().avif({ quality: q }).toBuffer();
    if (buf.length <= 145 * 1024 || q <= floor) break;
    q -= 8;
  }
  await writeOnce(buf, outPath);
  return buf.length;
}

async function processOne(srcPath, outSlug) {
  const raw = sharp(srcPath, { failOn: 'none' });
  const meta = await raw.metadata();

  // Trim uniform background border, guarded: only keep the trim if neither
  // dimension collapses below ~12% of the original (protects subjects that
  // reach an edge).
  let working = raw;
  let workingW = meta.width, workingH = meta.height;
  try {
    const trimmedBuf = await sharp(srcPath, { failOn: 'none' }).trim({ threshold: 12 }).toBuffer();
    const trimmedMeta = await sharp(trimmedBuf).metadata();
    const minW = meta.width * 0.12, minH = meta.height * 0.12;
    if (trimmedMeta.width >= minW && trimmedMeta.height >= minH) {
      working = sharp(trimmedBuf);
      workingW = trimmedMeta.width;
      workingH = trimmedMeta.height;
    }
  } catch {
    // trim failed (e.g. no uniform border) -- fall back to the untrimmed source
  }

  // Largest size at which the (trimmed) product fills ~90% of the canvas
  // without exceeding either canvas dimension -- enlarging small sources.
  const targetW = CANVAS_W * FILL, targetH = CANVAS_H * FILL;
  const scale = Math.min(targetW / workingW, targetH / workingH);
  const fitW = Math.round(workingW * scale);
  const fitH = Math.round(workingH * scale);

  let resized = working.resize(fitW, fitH, { kernel: 'lanczos3', fit: 'fill' });
  if (scale > 1.1) resized = resized.sharpen({ sigma: 1 });

  const composed = sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 4, background: '#ffffff' },
  }).composite([{ input: await resized.toBuffer(), gravity: 'center' }]);

  const webpBytes = await adaptiveEncode(composed, 'webp', path.join(OUT, `${outSlug}.webp`));
  const avifBytes = await adaptiveEncode(composed, 'avif', path.join(OUT, `${outSlug}.avif`));
  return { webpBytes, avifBytes, scale };
}

let ok = 0, fail = 0;
for (const [slug, files] of Object.entries(MAP)) {
  for (let i = 0; i < files.length; i++) {
    const srcPath = path.join(SRC, files[i]);
    const outSlug = i === 0 ? slug : `${slug}-${i + 1}`;
    if (!fs.existsSync(srcPath)) {
      console.log(`MISSING SOURCE: ${files[i]} (for ${slug})`);
      fail++;
      continue;
    }
    try {
      const { webpBytes, avifBytes, scale } = await processOne(srcPath, outSlug);
      console.log(`${outSlug}: ${files[i]} -> webp ${(webpBytes / 1024).toFixed(0)}KB, avif ${(avifBytes / 1024).toFixed(0)}KB (scale ${scale.toFixed(2)}x)`);
      ok++;
    } catch (e) {
      console.log(`FAILED: ${outSlug} <- ${files[i]}: ${e.message}`);
      fail++;
    }
  }
}
console.log(`\nDone: ${ok} images written, ${fail} failures.`);
