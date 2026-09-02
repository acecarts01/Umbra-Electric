import siteData from '../data/site.json';
import productsRaw from '../data/products.json';
import categoriesRaw from '../data/categories.json';
import badges from '../data/badges.json';
import postsRaw from '../data/posts.json';
import faqsRaw from '../data/faqs.json';
import reviewsRaw from '../data/reviews.json';
import brandsSeo from '../data/brands.json';

// ============================================================
// SITE — single source of truth lives in src/data/site.json.
// Every domain-bearing file (robots, sitemap, llms.txt,
// .well-known/*, canonicals, OG, JSON-LD, vercel.json) is
// generated FROM that file by scripts/gen-agent-files.mjs.
// To connect a real domain: change "domain" in site.json, rebuild, push.
// ============================================================
export const SITE = siteData;

export const FORMS = {
  provider: 'web3forms',
  // Sourced from the NEXT_PUBLIC_WEB3FORMS_KEY Vercel environment variable
  // (Project Settings -> Environment Variables), not committed to the repo.
  // Web3Forms access keys are public-by-design (they sit in client-side
  // HTML on every form submit either way), so NEXT_PUBLIC_ exposure isn't a
  // leak -- the env var is about deploy hygiene (rotate the key or vary it
  // per environment without a code change), not secrecy. Locally, set it in
  // .env.local (gitignored; see .env.example). Empty/unset is treated by
  // WebForm.jsx as "key pending" — forms redirect to the thank-you page
  // without sending.
  web3formsKey: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '',
};

export const CHAT = {
  channels: [
    { type: 'email', value: SITE.email, primary: true },
    { type: 'whatsapp', value: SITE.whatsapp, primary: false },
  ],
};

export const CATEGORIES = categoriesRaw;

export const PRODUCTS = productsRaw.map((p) => ({
  ...p,
  badge: badges[p.name] || null,
}));

export const POSTS = postsRaw;
export const FAQS = faqsRaw;
export const REVIEWS = reviewsRaw;

export const REVIEW_STATS = {
  count: REVIEWS.length,
  average: Math.round((REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length) * 10) / 10,
};

export function brandSlug(name) {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const BRANDS = Array.from(new Set(PRODUCTS.map((p) => p.brand)))
  .map((name) => ({
    name,
    slug: brandSlug(name),
    count: PRODUCTS.filter((p) => p.brand === name).length,
    metaDescription: brandsSeo[name]?.metaDescription || null,
    seoIntro: brandsSeo[name]?.seoIntro || null,
    primaryKeyword: brandsSeo[name]?.primaryKeyword || null,
    supportingKeywords: brandsSeo[name]?.supportingKeywords || [],
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getBrand(slug) {
  return BRANDS.find((b) => b.slug === slug);
}

export function getPost(slug) {
  return POSTS.find((p) => p.slug === slug);
}

export function relatedProducts(product, count = 4) {
  return PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, count);
}

export function absUrl(path = '/') {
  return `https://${SITE.domain}${path}`;
}

export function fmtPrice(n) {
  return `$${Number(n).toLocaleString('en-US')}`;
}

// SITE.phone is still a placeholder (no real landline yet) -- SITE.whatsapp
// is the one confirmed-real, working contact number. Formats it human-
// readable (NANP grouping for US/Canada 11-digit numbers, else a bare
// +-prefixed international number) for display in place of the fake phone
// placeholder until a real `phone` is supplied.
export function fmtWhatsApp(digits) {
  const d = String(digits).replace(/\D/g, '');
  if (d.length === 11 && d[0] === '1') return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  return `+${d}`;
}

export const PHONE_PLACEHOLDER = '+1 (000) 000-0000';
