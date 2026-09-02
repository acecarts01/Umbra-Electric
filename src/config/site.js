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
  web3formsKey: siteData.web3formsKey, // ⚠ REQUIRED before forms send email — get a free key at web3forms.com
};

export const CHAT = {
  channels: [{ type: 'whatsapp', value: SITE.whatsapp }],
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
