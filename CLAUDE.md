# Umbra Electric — project instructions

Next.js 16 (App Router) ecommerce site for Umbra Electric, deployed on Vercel via GitHub. Built with WebForge.

## Architecture

`src/data/site.json` is the single source of truth for domain, contact info and order rules — read by
`src/config/site.js` and by `scripts/gen-agent-files.mjs`. Product/category/blog/FAQ data lives in
`src/data/*.json`. Adding a product/category/post is one entry in the relevant JSON file — routes, sitemap,
schema and nav all regenerate from it. Never hand-edit generated output (`vercel.json`, `public/llms.txt`,
`public/.well-known/*`, `public/robots.txt`) — edit `src/data/site.json` and rerun `npm run build` (the
`prebuild` script regenerates them automatically).

## Order & Invoice System (Intake Section P)

Transactional order/invoice email system + `/admin/portal/` admin portal, added 2026-09-17. Vercel-only,
Postgres-backed (Neon, free tier, connected via Vercel Storage as `DATABASE_URL`).

- Customer places an order at `/order/` → `POST /api/orders/create` prices it server-side (never trusts a
  client-supplied price/ref), writes a row to Postgres, emails the customer a confirmation and the sales desk
  (`ORDER_NOTIFY_EMAIL`) a settlement-terminal link.
- Admin settles at `/admin/portal/orders/[ref]/` — a plain "Amount due now" field + free-text payment
  instructions per invoice (works for both full-payment and the 20% reservation-deposit flow without hardcoding
  either), which emails the customer an invoice linking to `/pay/[ref]/`. "Mark Paid" / "Mark Dispatched"
  advance status; every state-changing endpoint checks the live DB status first so a stale link can never
  regress an order backward.
- Customer/admin-facing invoice copy reads "Tax Invoice" (email heading/subject, pay page, settlement terminal,
  status labels) — Umbra Electric holds real business registration documents, so this is a legitimate tax
  invoice, not a generic payment request. Internal-only identifiers (`invoice_sent` status value, `order.invoice`
  field, `invoiceEmail()`) stay as-is; only user-visible strings changed.
- Admin login is a single shared passphrase (`ADMIN_PASSPHRASE` env var) → signed cookie, no user table.
- Order tokens are signed with `ORDER_SIGNING_SECRET` (HMAC, ≥16 chars) — the token proves an order's contents,
  the DB row proves its current status. `/admin/`, `/api/orders/`, `/api/admin/`, `/pay/` are disallowed in
  robots.txt and excluded from the sitemap.
- Email templates (`src/lib/email/*`) use the bulletproof `table()`/`td()`/`row()` primitives — every
  `<table>`/`<td>` must carry both `bgcolor` and `background-color`, checked by crosscheck items 36-43.
  Never hand-write a raw `<table>`/`<td>` in an email template.
- Contact/Wholesale forms still send via Web3Forms (`WebForm.jsx`) but also fire-and-forget log to
  `/api/enquiries/create` so the portal's Enquiries tab has data — never make that logging call block or
  affect the real Web3Forms send.
- If `SMTP_USER`/`SMTP_PASS` aren't set, emails write to `.email-outbox/` (gitignored) instead of failing the
  build — check there when testing locally without real SMTP configured.

## Rules

- `npm run build` must pass before every push. Run `npm run crosscheck` after building.
- Email is the primary order/contact channel sitewide (order form, mailto). WhatsApp is secondary — never let it
  appear before email in ordering or contact copy, in agent-facing files (llms.txt, auth.md, server-card.json,
  acp.json, ucp.json, webmcp.js, mcp-tools.json), or in FAQ/product/post copy. Live chat widget is separate and
  untouched by this rule.
- One `<h1>` per page. Meta descriptions ~150 chars. Titles ≤60.
- Product images live in `public/images/products/`, referenced by filename in `src/data/products.json`.
- Emails are never in plaintext inside JSON-LD or `<script>` tags — encoded/obscured in visible markup.
- Never commit `node_modules/`, `.next/`, `out/`.
- Off-road dirt-bike products (categories `adult-electric-dirt-bikes`, `kids-electric-dirt-bikes`) must keep
  the compliance warning on their product pages — see `DIRT_BIKE_CATEGORIES` in
  `src/app/product/[slug]/page.jsx`. Never remove it or imply street-legality.

## Live placeholders (set before going live)

In `src/data/site.json` unless noted:
- `domain` — set to `www.umbraelectric.com` and confirmed connected/live in Vercel (verified 2026-09-03: the
  domain resolves, serves the current build, and is registered in Bing Webmaster Tools).
- `email` — set to `info@umbraelectric.com` (Zoho Mail).
- Web3Forms key — set via the `NEXT_PUBLIC_WEB3FORMS_KEY` Vercel environment variable, NOT in site.json
  (see `.env.example`). Until it's set (locally in `.env.local`, in prod in Vercel's dashboard), forms
  redirect to the thank-you page without sending.
- `whatsapp` — set to the real number. `phone` is still a placeholder.
- `gscCode`, `bingCode` — codes are set; confirm both properties are actually verified live in Search
  Console / Bing Webmaster Tools (a code being present doesn't guarantee verification happened there).
- After any batch content change (new products/posts/pages), re-run `node scripts/submit-indexnow.mjs` to
  notify IndexNow (Bing/Yandex) of the updated URL set — it's safe to re-run any time.
- Order System secrets (Vercel env vars, all three environments): `SMTP_HOST=smtp.zoho.com` (free-tier Zoho —
  if the plan is ever upgraded to paid, change to `smtppro.zoho.com` or every send fails with a
  password-shaped error), `SMTP_PORT=465`, `SMTP_SECURE=true`, `SMTP_USER=info@umbraelectric.com`,
  `SMTP_PASS` (Zoho app-specific password), `ORDER_NOTIFY_EMAIL=info@umbraelectric.com` (sales-desk inbox —
  the site's own official email, not a personal address), `ORDER_SIGNING_SECRET`, `ADMIN_PASSPHRASE`,
  `DATABASE_URL` (Neon Postgres, connected via Vercel Storage). See `.env.example` for the full list with
  descriptions.

## Brand facts (only these are true — never invent more)

Umbra Electric: founded 2022, Seattle WA. Ships United States, Europe, Worldwide. 128 curated models across
8 categories from ~100 brands, $399–$14,000. Min order $500, free shipping over $2,000, flat $248 under that,
10% crypto discount. No invented statistics, awards, press mentions, or named clients — the previous
build's intake explicitly withheld an unverifiable "Auto Dealers of the Year" claim; do not add it back
unless the client supplies a verifiable award name, year and issuing body.

Legal registration (added 2026-09-17, verified live against the Texas Comptroller's public Franchise Tax
Account Status search — `SITE.verifyUrl`): "Umbra Electric" is a trading name, not the legal entity — the
site is legally operated by **`SITE.legalEntityName`** ("Bikes & Backpacks, Inc."), a Texas corporation,
Texas Taxpayer Number `SITE.taxpayerNumber` (17601401049), SOS File Number `SITE.sosFileNumber` (0105432400),
active and in good standing since 1988-02-01. Never present "Umbra Electric" itself as the incorporated legal
entity in verification copy — always frame it as "Umbra Electric, operated by Bikes & Backpacks, Inc." The
verification facts are shown sitewide: `VerifyBar` (persistent top strip, every page), `Footer` (compact
line), `BusinessVerification` (full card — homepage + `/about/`), the Organization JSON-LD (`taxID`/
`identifier`), and every order-system email footer + the Tax Invoice/Receipt specifically. All of it must
keep pointing at the real, live government record — never a placeholder or invented number.

Financing was removed sitewide (2026-09-03) and replaced by a reservation system: any model can be reserved
with a 20% holding deposit (`SITE.reservationDepositPct`), remaining balance due before shipping; the 10%
crypto discount applies to the total before the deposit is calculated. Page: `/reservation/`, calculator:
`src/components/ReservationCalculator.jsx`. Never reintroduce "financing" as a payment/offer option — use
the reservation system instead.
