# PROJECT.md — Umbra Electric

Last updated: 2026-08-09
Migrated from Cloudflare Pages (WebForge v5 static build) to Vercel/Next.js (WebForge v9.1) by Claude.

## Identity
- Domain: umbraelectric.com
- Site Name: Umbra Electric
- Tagline: Silent Power. Refined.
- Primary Color: #A9793F (bronze) · Ink #141210 · Ivory #F5F1E9
- Logo: /images/logo.svg (eclipse "umbra" mark) + /images/logo.webp
- Favicon: /images/favicon.svg
- Year Founded: 2022

## Brand Entity Statement
Umbra Electric is a Seattle-based premium electric mobility retailer established in 2022, curating high-end
electric dirt bikes, e-motos and e-bikes for adults and kids. Umbra Electric ships across the United States,
Europe and worldwide, specializing in flagship off-road and trail machines from the brands that define the
category. What sets Umbra apart is ruthless curation — only bikes worth owning.

## Contact & Region
- Email: info@umbraelectric.com (Zoho Mail)
- Phone: +1 (000) 000-0000 ⚠ PLACEHOLDER
- WhatsApp: 10000000000 ⚠ PLACEHOLDER (digits only)
- Region: Seattle, WA, USA · Ships United States, Europe & Worldwide
- Currency: USD

## Order Rules
- Min order: $500 · Free shipping over $2,000 · Flat ship $248
- Crypto discount: 10% (auto-applied in cart)

## Menu
Home · Shop · Premium · Finance · About · Blog · Contact (+ footer: Wholesale, FAQ, Compare, Track Order,
Finance Calculator, Legal)

## Catalog (128 products, 8 categories, 6 blog posts, ~34 pages)
- Adult Electric Dirt Bikes (31) · Kids & Youth Electric Dirt Bikes (8) · Electric Mountain Bikes (27)
- Electric Commuter & Urban Bikes (33) · Electric Road & Gravel Bikes (9) · Electric Fat Tire Bikes (6)
- Kids & Youth E-Bikes (8) · Folding E-Bikes (6)
- Price range: $399–$14,000

## Forms
- Provider: Web3Forms (exact CORS method: FormData + Accept-only header, in `src/components/WebForm.jsx`)
- Web3Forms API key: pending — set `web3formsKey` in `src/data/site.json`

## Hosting
- Platform: Vercel · Deployment: GitHub push → auto-deploy
- Repo: https://github.com/acecarts01/Umbra-Electric
- GSC verified: No — code pending
- Bing verified: No — code pending
- IndexNow key: a7f3c9e21b6d48f5a0c8e4b2d9f16a3c

## Backend
- Backend enabled: No (pure static-content Next.js site, no CMS)

## Migration notes
- Source: Cloudflare Pages static export (`umbra-electric-deploy (1).zip`, the more recent of two zips found
  in Downloads — 628 files vs. 362, includes full multi-image galleries for all 111 multi-image products).
- All product/category/blog/FAQ content, pricing, descriptions and images were extracted programmatically
  from the old HTML (JSON-LD Product blocks, category pages, spec tables) and ported verbatim — no content
  was rewritten or fabricated.
- Rebuilt as Next.js 16 App Router: 128 products + 6 posts + 8 categories now render from
  `generateStaticParams()` off three JSON data files instead of 428 hand-built HTML files.
- Agent-ready file set (llms.txt, auth.md, 8 `.well-known/*` files, webmcp.js) regenerated for the Vercel
  target via `scripts/gen-agent-files.mjs`.
- Live MCP/API layer (Pass 2 — `/api/mcp`, `/api/products`, markdown negotiation middleware) was not built in
  this pass; the site ships the static declaration layer only. Can be added later without touching content.

## ⚠ PENDING before go-live
1. Get a Web3Forms access key (web3forms.com) → `src/data/site.json` → `web3formsKey`. Until set, the
   contact/order/wholesale forms redirect straight to the thank-you page WITHOUT sending email.
2. Real phone and WhatsApp number → `src/data/site.json`.
3. GSC + Bing verification codes → `src/data/site.json` → `gscCode` / `bingCode`.
4. Confirm the Instagram/Facebook URLs in `src/data/site.json` are the real, live profiles.
5. Confirm/verify all prices with the client before the site is publicly promoted.
6. Award/partner claims: the source site's intake listed "Auto Dealers of the Year" with no verifiable name —
   this was correctly never published. Only add real, named awards/partners if supplied.
7. Connect the umbraelectric.com domain in Vercel's project settings (DNS/domain assignment is separate
   from setting `SITE.domain` — both are needed for the live site to resolve correctly).
