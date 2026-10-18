// Generates a static QR-code SVG for every wallet in SITE.cryptoWallets
// (src/data/site.json). Runs as part of `prebuild` -- same reasoning as
// gen-agent-files.mjs: payment addresses are data, the QR is a deterministic
// rendering of that data, so it's generated at build time rather than
// client-side (no QR library shipped to the browser, works with JS
// disabled, never drifts from the address actually on the page). Output is
// keyed by ticker+network so two wallets sharing a ticker (USDT TRC-20 vs
// ERC-20) get distinct files.
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import site from '../src/data/site.json' with { type: 'json' };

const OUT_DIR = path.resolve('public/images/crypto');
fs.mkdirSync(OUT_DIR, { recursive: true });

function slugFor(w) {
  return `${w.ticker}-${w.network}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const wallets = site.cryptoWallets || [];
let written = 0;
for (const w of wallets) {
  const slug = slugFor(w);
  const outPath = path.join(OUT_DIR, `${slug}.svg`);
  const svg = await QRCode.toString(w.address, {
    type: 'svg',
    margin: 1,
    color: { dark: '#14161c', light: '#ffffff' },
  });
  fs.writeFileSync(outPath, svg);
  written++;
}
console.log(`Generated ${written} crypto QR codes in ${path.relative(process.cwd(), OUT_DIR)}/`);
