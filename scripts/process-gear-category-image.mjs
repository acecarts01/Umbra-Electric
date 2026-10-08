// Processes the client-selected Unsplash source photo (Trent Haaland, free
// license) into the gear-accessories category tile (4:3) and banner (2:1),
// same treatment as the other 8 categories in process-hero-images.mjs:
// native-crop, no upscale, cap 3840w, attention-based crop position.
// Source lives outside the repo (Downloads); this script does not run as
// part of the build.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:\\Users\\USER\\Downloads\\trent-haaland-fjcD7xDLyhk-unsplash.jpg';
const OUT = path.resolve('public/images/categories');
fs.mkdirSync(OUT, { recursive: true });

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

async function writeUnderBudget(pipeline, outPath, budgetKB, startQuality) {
  let quality = startQuality;
  let buf;
  do {
    buf = await pipeline.clone().webp({ quality }).toBuffer();
    quality -= 4;
  } while (buf.length / 1024 > budgetKB && quality > 40);
  fs.writeFileSync(outPath, buf);
  return { bytes: buf.length, quality: quality + 4 };
}

const img = sharp(SRC).rotate();
const meta = await img.metadata();
console.log('source:', meta.width + 'x' + meta.height);

// Tile: 4:3
{
  const { width, height } = maxCoverSize(meta, 4, 3, 3744);
  const pipeline = img.clone().resize(width, height, { fit: 'cover', position: 'attention', withoutEnlargement: true });
  const out = path.join(OUT, 'gear-accessories.webp');
  const { bytes, quality } = await writeUnderBudget(pipeline, out, 1800, 92);
  console.log('tile', `${width}x${height}`, (bytes / 1024).toFixed(0) + 'KB', `q${quality}`);
}

// Banner: 2:1
{
  const { width, height } = maxCoverSize(meta, 2, 1, 3744);
  const pipeline = img.clone().resize(width, height, { fit: 'cover', position: 'attention', withoutEnlargement: true });
  const out = path.join(OUT, 'gear-accessories-banner.webp');
  const { bytes, quality } = await writeUnderBudget(pipeline, out, 1800, 92);
  console.log('banner', `${width}x${height}`, (bytes / 1024).toFixed(0) + 'KB', `q${quality}`);
}
