# Umbra Electric — project instructions

Next.js 16 (App Router) ecommerce site for Umbra Electric, deployed on Vercel via GitHub. Built with WebForge.

## Architecture

`src/data/site.json` is the single source of truth for domain, contact info and order rules — read by
`src/config/site.js` and by `scripts/gen-agent-files.mjs`. Product/category/blog/FAQ data lives in
`src/data/*.json`. Adding a product/category/post is one entry in the relevant JSON file — routes, sitemap,
schema and nav all regenerate from it. Never hand-edit generated output (`vercel.json`, `public/llms.txt`,
`public/.well-known/*`, `public/robots.txt`) — edit `src/data/site.json` and rerun `npm run build` (the
`prebuild` script regenerates them automatically).

## Rules

- `npm run build` must pass before every push. Run `npm run crosscheck` after building.
- One `<h1>` per page. Meta descriptions ~150 chars. Titles ≤60.
- Product images live in `public/images/products/`, referenced by filename in `src/data/products.json`.
- Emails are never in plaintext inside JSON-LD or `<script>` tags — encoded/obscured in visible markup.
- Never commit `node_modules/`, `.next/`, `out/`.
- Off-road dirt-bike products (categories `adult-electric-dirt-bikes`, `kids-electric-dirt-bikes`) must keep
  the compliance warning on their product pages — see `DIRT_BIKE_CATEGORIES` in
  `src/app/product/[slug]/page.jsx`. Never remove it or imply street-legality.

## Live placeholders (set before going live)

All in `src/data/site.json`:
- `domain` — set to `umbraelectric.com`. Still needs to be connected as a custom domain in Vercel's project
  settings (separate step from this config value).
- `email` — set to `info@umbraelectric.com` (Zoho Mail).
- `web3formsKey` — currently pending. Until set, the contact/order/wholesale forms skip sending and go
  straight to the thank-you page (no email is delivered). Get a free key at web3forms.com.
- `phone`, `whatsapp` — currently placeholders.
- `gscCode`, `bingCode` — Search Console / Bing verification codes, currently pending.

## Brand facts (only these are true — never invent more)

Umbra Electric: founded 2022, Seattle WA. Ships United States, Europe, Worldwide. 128 curated models across
8 categories from ~100 brands, $399–$14,000. Min order $500, free shipping over $2,000, flat $248 under that,
10% crypto discount. No invented statistics, awards, press mentions, or named clients — the previous
build's intake explicitly withheld an unverifiable "Auto Dealers of the Year" claim; do not add it back
unless the client supplies a verifiable award name, year and issuing body.
