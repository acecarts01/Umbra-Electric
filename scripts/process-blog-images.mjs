// Process the 3 remaining unnamed client-supplied stock photos into blog
// card images for the homepage "Guides & insights" section. Same
// never-upscale discipline as process-hero-images.mjs. Output already
// committed under public/images/blog/ -- this script does not run as part
// of the build. Source photos were never committed; point SRC at wherever
// they live if you need to re-run this.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'C:\\Users\\USER\\AppData\\Local\\Temp\\claude\\C--VERCEL-PROJECTS-Umbra-Electric\\9809eeb5-0f55-4218-8ad2-2fca590c7faa\\scratchpad\\hero-images-source';
const OUT = path.resolve('public/images/blog');
fs.mkdirSync(OUT, { recursive: true });

// Homepage shows POSTS.slice(0,3) -- these 3 slugs, matched to source photo
// mood: street-legal (dramatic silhouette), bike-classes (scenic overlook,
// evokes "which class/trail"), kids-guide (friendly casual park riding).
const MAP = {
  'are-electric-dirt-bikes-street-legal': 'istockphoto-1168532082-612x612.jpg',
  'electric-bike-classes-explained': 'istockphoto-1232568015-612x612.jpg',
  'electric-dirt-bikes-for-kids-guide': 'istockphoto-2169945553-612x612.jpg',
};

// .bcard .ph is aspect-ratio:16/10. Cards render narrow (~380-420px) in a
// 3-up grid, so native ~612px width comfortably covers 2x DPR without
// upscaling -- crop straight to 16:10 at native resolution.
function maxCoverSize(meta, aspectW, aspectH) {
  const targetRatio = aspectW / aspectH;
  const srcRatio = meta.width / meta.height;
  if (srcRatio > targetRatio) {
    const h = meta.height;
    const w = Math.round(h * targetRatio);
    return { w, h };
  }
  const w = meta.width;
  const h = Math.round(w / targetRatio);
  return { w, h };
}

for (const [slug, file] of Object.entries(MAP)) {
  const srcPath = path.join(SRC, file);
  const meta = await sharp(srcPath).metadata();
  const { w, h } = maxCoverSize(meta, 16, 10);
  const outPath = path.join(OUT, `${slug}.webp`);
  await sharp(srcPath)
    .resize(w, h, { fit: 'cover', position: 'attention' })
    .webp({ quality: 86 })
    .toFile(outPath);
  console.log(`${slug}.webp <- ${file} (${meta.width}x${meta.height} -> ${w}x${h})`);
}
