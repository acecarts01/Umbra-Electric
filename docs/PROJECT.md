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
- WhatsApp: +14482348667 (client-supplied 2026-09-02, live in `src/data/site.json` and confirmed working —
  see the "Forms" section below for the order-draft test)
- Region: Seattle, WA, USA · Ships United States, Europe & Worldwide
- Currency: USD

## Order Rules
- Min order: $500 · Free shipping over $2,000 · Flat ship $248
- Crypto discount: 10% (auto-applied in cart)

## Menu
Home · Shop · Premium · Finance · About · Blog · Contact (+ footer: Wholesale, FAQ, Compare, Track Order,
Finance Calculator, Legal)

## Catalog (128 products, 8 categories, 36 brands, 23 blog posts, ~36 pages)
- Adult Electric Dirt Bikes (31) · Kids & Youth Electric Dirt Bikes (8) · Electric Mountain Bikes (27)
- Electric Commuter & Urban Bikes (33) · Electric Road & Gravel Bikes (9) · Electric Fat Tire Bikes (6)
- Kids & Youth E-Bikes (8) · Folding E-Bikes (6)
- Price range: $399–$14,000
- `/shop/brand/` — brand hub page (added 2026-09-02) listing all 36 brands; fixes an orphan-page gap where
  the 36 individual `/shop/brand/[brand]/` pages were previously reachable only through a client-side-only
  BrandMenu dropdown that renders empty in server/static HTML (closed by default) and via sitemap.xml —
  neither counts as a real inbound link for crawl-discovery purposes. Nav, Footer and homepage now also link
  to it directly.

## Forms
- Provider: Web3Forms (exact CORS method: FormData + Accept-only header, in `src/components/WebForm.jsx`)
- Web3Forms API key: set via the `NEXT_PUBLIC_WEB3FORMS_KEY` env var (2026-09-02 — moved out of
  `src/data/site.json`, which no longer holds it). Local dev reads it from `.env.local` (gitignored, real
  key already there); production must have it set in Vercel Project Settings → Environment Variables — this
  step happens in the Vercel dashboard, outside this repo, and needs to be done before the live site's forms
  will actually send. `.env.example` documents the variable name for reference.

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
- Live MCP/API layer: markdown negotiation (`src/proxy.js` + `src/lib/agentMarkdown.js`) shipped 2026-08-xx
  ("Implement Markdown Negotiation for AI agents" commit). The MCP server + JSON API + live ACP/UCP shipped
  2026-09-02 — see "Live MCP/API layer" section below.

## Live MCP/API layer (2026-09-02)

Vercel-only capability layer on top of the static declaration files (A–N) — see WebForge's "Agent-Ready — the
LIVE layer". Everything here is read-only plus order-**draft**: no endpoint accepts payment or personal data,
and `create_order_draft` only returns a pre-filled WhatsApp link + totals for a human to review.

- `/api/mcp` — MCP server, Streamable HTTP transport (JSON-RPC 2.0 over POST only, no SSE — a catalog this
  size answers fast enough that streaming adds nothing). Methods: `initialize`, `tools/list`, `tools/call`.
  Tools: `search_products`, `get_product`, `list_categories`, `get_policies`, `get_wholesale_info`,
  `create_order_draft`.
- `/api/products` (`?category=`, `?q=`, `?limit=`), `/api/products/[slug]`, `/api/categories`, `/api/brands`,
  `/api/search` (`?q=`, products + posts) — plain JSON, `Access-Control-Allow-Origin: *`.
- `/api/acp/catalog`, `/api/ucp/services` — live JSON behind `.well-known/acp.json` / `.well-known/ucp`,
  which now point at these routes instead of describing an HTML-only catalog.
- **Single source of truth for tools, by construction, not convention:** `src/data/mcp-tools.json` holds every
  tool's `name`/`description`/`inputSchema`. Both `/api/mcp`'s live `tools/list` response AND
  `scripts/gen-agent-files.mjs`'s `server-card.json` generation read this exact file — they cannot drift apart
  because there is only one file to edit. `src/lib/mcpExecutors.js` holds the actual tool logic.
- **`gen-agent-files.mjs` is target-aware** via `SITE.target === 'vercel'` (`isLive` flag): `server-card.json`,
  `api-catalog`, `acp.json` and `ucp` all declare the live endpoints only when `isLive` is true, falling back to
  the static-only declaration otherwise (this repo only ever deploys to Vercel, so `isLive` is always true in
  practice — the branch exists so the generator never lies about a capability the target can't honour).
- **Known limitation:** `crosscheck.mjs` verifies file presence, `mcp-tools.json` validity, and that
  `server-card.json`'s `tools[]` matches `mcp-tools.json` byte-for-byte — but does NOT boot a live server and
  make real HTTP requests against `/api/mcp` (WebForge's V6 spec technically calls for this). That was judged
  not worth the added fragility (port/process lifecycle management in a static analysis script) given the
  shared-source-of-truth design already makes the specific drift it would catch structurally impossible.
  If you want true live-request testing, it would run as a separate post-deploy check (like AUDIT F), not
  inside this script.

## SEO pass — Semrush keyword research + FAQs (2026-09-02)

Client supplied `New Umbra Keywords Research Cluster/` (~80 Semrush "all keywords" exports covering all 8
categories and 32 of 36 brands, plus long-tail single-topic files) — real Volume/Keyword Difficulty/Intent
data, a first for this project (all prior keyword work used hand-built, unverified term lists). Consolidated
via a one-off parser into `docs/semrush-keyword-pool.json` (9,917 deduped keywords, never published — same
handling as other strategy docs). 4 brands had no dedicated export (79Bike, EMORTAL, Electric Bike Company,
Specialized) — their keywords were derived from real product names + category/brand-pattern phrasing instead.

Every category (8), brand (36), product (128) and blog post (23) now carries structured `primaryKeyword` +
5 `supportingKeywords` fields in its JSON record (`categories.json`, `brands.json`, `products.json`,
`posts.json`), woven invisibly into `<title>`/meta description and each page's JSON-LD `keywords` property —
no visible keyword lists, no stuffing. Every product and post also carries exactly 5 fact-grounded FAQs
(`faqs: [{q,a}]`), rendered on-page via `FaqAccordion` plus a per-page `FAQPage` JSON-LD block. Dirt-bike
category FAQs (adult + kids) always include the mandatory off-road/not-street-legal compliance framing.
`scripts/crosscheck.mjs` now permanently enforces this coverage (fails the build if any product/post/
category/brand is missing its keyword or FAQ fields) so it can't silently regress.

Old `docs/keyword-cluster-map.md` (258 hand-picked terms, no volume data) is retained as historical context
but the Semrush pool now supersedes it as the primary keyword reference for this site.

## ⚠ PENDING before go-live
1. Real phone number → `src/data/site.json` (still the placeholder `+1 (000) 000-0000`; WhatsApp is set and
   is now the sitewide secondary contact channel — see "Email-primary ordering" below).
   `NEXT_PUBLIC_WEB3FORMS_KEY` is confirmed set in Vercel Production (2026-09-02) and verified working end to
   end (real test order accepted by Web3Forms). Bing code is set in `site.json` but unconfirmed live in Bing
   Webmaster Tools. **GSC: confirmed NOT actually verified** (2026-09-02 audit) — the account has zero verified
   properties in Search Console despite `gscCode` being present in `site.json`; the code being in the HTML
   never actually got submitted/verified as a property. Needs the property added and verified, then the
   sitemap submitted.
2. Confirm the Instagram/Facebook URLs in `src/data/site.json` are the real, live profiles.
3. Confirm/verify all prices with the client before the site is publicly promoted.
4. Award/partner claims: the source site's intake listed "Auto Dealers of the Year" with no verifiable name —
   this was correctly never published. Only add real, named awards/partners if supplied.

## Email-primary ordering (2026-09-02)

Audited every ordering/contact touchpoint sitewide (footer, homepage, about/shipping/tracking/contact pages,
FAQs, product/post FAQs, and the entire agent-facing layer — llms.txt, auth.md, server-card.json, acp.json,
ucp.json, `/api/acp/catalog`, `/api/ucp/services`, webmcp.js, mcp-tools.json, mcpExecutors.js) to make email
the primary ordering/contact channel everywhere, with WhatsApp explicitly secondary. `/tracking/` was the one
real gap found — it offered WhatsApp only, no email option at all; fixed to lead with a `mailto:` CTA.
`create_order_draft` (MCP) now returns `orderFormUrl` + `mailtoUrl` as primary alongside `whatsappDraftUrl` as
secondary. The live chat widget is untouched — this only affects WhatsApp vs. email framing.
See the rule in `CLAUDE.md` — this convention must hold for all future copy.

## Content-depth pass (2026-09-02)

Every product's `description`/`fullDescription` was templated boilerplate — nearly identical across all 128
products, a real thin/duplicate-content risk. Rewrote both fields for all 128 products (avg fullDescription
now 204 words, was ~2 templated sentences) with genuine differentiation: real price positioning computed from
the actual catalog, real named comparisons to other real products, real brand lineage pulled from `brands.json`
`seoIntro`, the product's own `highlight` where present — no invented specs. Blog posts were also thinner than
their own stated read time (232–352 words claiming "6-8 min read" — a real 6-8 min read is 1200+ words);
expanded all 23 to a genuinely deeper, honestly-labeled length (avg 289→565 words, `readTime` recomputed at
~225 wpm) by adding real new sections/depth, not padding — sourced from real catalog facts plus general
uncontroversial technical knowledge, never invented statistics or specs. Categories/brands were left alone —
already substantial (77-100 / 41-73 word intros) for pages that also carry a full product grid.
5. Connect the umbraelectric.com domain in Vercel's project settings (DNS/domain assignment is separate
   from setting `SITE.domain` — both are needed for the live site to resolve correctly). `SITE.domain` is
   currently `www.umbraelectric.com`.
