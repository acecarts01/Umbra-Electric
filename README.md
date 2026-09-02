# Umbra Electric

Premium electric dirt bikes, e-motos and e-bikes for adults and kids. Next.js 16 (App Router), deployed on
Vercel via GitHub.

Migrated from a Cloudflare Pages static build to the Vercel/Next.js WebForge workflow. 128 products, 8
categories, 36 brands, 23 blog posts and every static page.

## Stack

- Next.js 16 (App Router), React 19
- Plain CSS (no framework) — design system in `src/app/globals.css`
- Web3Forms for contact/order/wholesale forms (client-side; key comes from the `NEXT_PUBLIC_WEB3FORMS_KEY`
  env var, see `.env.example`)
- Live MCP/JSON API (`/api/mcp`, `/api/products`, `/api/categories`, `/api/brands`, `/api/search`) for AI
  agents — read-only plus order-draft, never payment
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

See the "Live placeholders" section in `CLAUDE.md`. Remaining: real phone number in `src/data/site.json`,
and `NEXT_PUBLIC_WEB3FORMS_KEY` set in Vercel's Project Settings → Environment Variables (it's already in
`.env.local` for local dev, but that's never deployed).

## Content data

- `src/data/products.json` — 128 products (name, brand, category, price, description, images, keywords, FAQs)
- `src/data/categories.json` — 8 shop categories · `src/data/brands.json` — 36 brand pages
- `src/data/posts.json` — 23 blog posts (full body HTML, keywords, FAQs)
- `src/data/faqs.json` — site-wide FAQ entries (homepage + `/faq/`)
- `src/data/site.json` — brand/contact/order-rule config (the single source of truth)
- `src/data/mcp-tools.json` — MCP tool definitions, shared by `/api/mcp` and `server-card.json`

Add a product or post by adding one entry to the relevant JSON file — pages, sitemap, JSON-LD and nav all
derive from it automatically.
