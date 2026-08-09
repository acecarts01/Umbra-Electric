# Umbra Electric

Premium electric dirt bikes, e-motos and e-bikes for adults and kids. Next.js 16 (App Router), deployed on
Vercel via GitHub.

Migrated from a Cloudflare Pages static build to the Vercel/Next.js WebForge workflow. All 128 products, 8
categories, 6 blog posts and every static page were ported over with their original content, pricing and
images.

## Stack

- Next.js 16 (App Router), React 19
- Plain CSS (no framework) — design system in `src/app/globals.css`
- Web3Forms for contact/order/wholesale forms (client-side, no server secrets)
- Cart via `localStorage`, no backend

## Commands

```bash
npm install       # install dependencies
npm run dev        # local dev server
npm run build       # production build (also regenerates agent-ready files via prebuild)
npm run start       # serve the production build locally
npm run crosscheck    # pre-ship checks (images, JSON validity, forms, agent-ready files)
```

## Deploy (Vercel)

1. Push this repo to GitHub (already connected — see below).
2. In Vercel: **Add New → Project → Import** the GitHub repo. Framework Preset: **Next.js**.
3. Deploy. `vercel.json` supplies security headers, the agent-ready `Link` header, and the www→apex redirect.

## Before going live

See the "Live placeholders" section in `CLAUDE.md` — domain, Web3Forms key, email, phone, WhatsApp number,
and GSC/Bing verification codes are all currently pending values and need to be set in
`src/data/site.json` before this is a fully live storefront.

## Content data

- `src/data/products.json` — 128 products (name, brand, category, price, description, images)
- `src/data/categories.json` — 8 shop categories
- `src/data/posts.json` — 6 blog posts (full body HTML)
- `src/data/faqs.json` — 10 FAQ entries
- `src/data/site.json` — brand/contact/order-rule config (the single source of truth)

Add a product or post by adding one entry to the relevant JSON file — pages, sitemap, JSON-LD and nav all
derive from it automatically.
