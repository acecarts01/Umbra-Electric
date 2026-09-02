// Markdown Negotiation (WebForge Agent-Ready V5). Generates a markdown
// representation of a page directly from the same structured data the React
// pages render from, rather than converting already-rendered HTML -- more
// reliable given this app runs on Vercel's SSR/ISR model, not a static
// export with literal HTML files to convert. Covers every data-driven route
// (home, shop index, all categories, all brands, all products, blog index,
// all blog posts, FAQ, reviews). Pure-presentational static pages (about,
// contact, financing, etc.) are intentionally NOT covered here -- they fall
// through to normal HTML, which is the honest default (Rule 10: never claim
// a capability the site doesn't have) rather than a lie about coverage.
import { SITE, CATEGORIES, PRODUCTS, BRANDS, POSTS, FAQS, REVIEWS, REVIEW_STATS, getProduct, getCategory, getBrand, getPost, absUrl, fmtPrice } from '@/config/site';

const ENTITY_MAP = { '&amp;': '&', '&#x27;': "'", '&#39;': "'", '&quot;': '"', '&middot;': '·', '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–' };

function decodeEntities(s) {
  return s.replace(/&(amp|#x27|#39|quot|middot|nbsp|mdash|ndash);/g, (m) => ENTITY_MAP[m] ?? m);
}

// Converts the limited, consistent HTML vocabulary used in POSTS[].body
// (div/span/h1/h2/p/a only -- authored entirely within this codebase) into
// markdown. Not a general-purpose HTML parser by design.
function htmlToMarkdown(html) {
  let s = html;
  s = s.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (_, href, text) => {
    const url = /^https?:\/\//.test(href) ? href : absUrl(href);
    return `[${text}](${url})`;
  });
  s = s.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  s = s.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  s = s.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  s = s.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
  s = s.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
  s = s.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '\n');
  s = s.replace(/<[^>]+>/g, '');
  s = decodeEntities(s);
  s = s.replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

function homepageMd() {
  const lines = [
    `# ${SITE.name} — Premium Electric Dirt Bikes & E-Bikes`,
    '',
    `> ${SITE.brandStatement}`,
    '',
    '## Shop by Category',
    ...CATEGORIES.map((c) => `- [${c.title}](${absUrl(`/shop/${c.slug}/`)}): ${c.count} models — ${c.lead}`),
    '',
    '## Shop by Brand',
    `${BRANDS.length} brands, ${PRODUCTS.length} models total. [Browse all brands](${absUrl('/shop/brand/')})`,
    '',
    '## About',
    `${SITE.name} is based in ${SITE.hqCity}, ${SITE.hqRegion}, founded ${SITE.founded}. Ships to ${SITE.areaServed}.`,
    '',
    `[Shop the full collection](${absUrl('/shop/')}) · [Contact](${absUrl('/contact/')}) · [Financing](${absUrl('/financing/')}) · [FAQ](${absUrl('/faq/')})`,
    '',
    `## Live data`,
    `Agents can query the catalog directly via [/api/mcp](${absUrl('/api/mcp')}) (MCP Streamable HTTP) or the plain JSON API: [/api/products](${absUrl('/api/products')}), [/api/categories](${absUrl('/api/categories')}), [/api/brands](${absUrl('/api/brands')}), [/api/search](${absUrl('/api/search')}).`,
  ];
  return lines.join('\n');
}

function shopIndexMd() {
  const lines = [
    `# Shop All Electric Dirt Bikes & E-Bikes — ${SITE.name}`,
    '',
    `${PRODUCTS.length} curated models across ${CATEGORIES.length} categories from ${BRANDS.length} brands.`,
    '',
    '## Categories',
    ...CATEGORIES.map((c) => `- [${c.title}](${absUrl(`/shop/${c.slug}/`)}): ${c.count} models — ${c.lead}`),
    '',
    '## Brands',
    ...BRANDS.map((b) => `- [${b.name}](${absUrl(`/shop/brand/${b.slug}/`)}): ${b.count} ${b.count === 1 ? 'model' : 'models'}`),
  ];
  return lines.join('\n');
}

function faqSection(faqs) {
  if (!faqs || !faqs.length) return [];
  return ['', '## Frequently asked questions', '', ...faqs.flatMap((f) => [`**${f.q}**`, '', f.a, ''])];
}

function brandHubMd() {
  const lines = [
    `# Shop Electric Bike Brands`,
    '',
    `> ${BRANDS.length} electric dirt bike and e-bike brands, ${PRODUCTS.length} curated models at ${SITE.name}.`,
    '',
    '## Brands',
    ...BRANDS.map((b) => `- [${b.name}](${absUrl(`/shop/brand/${b.slug}/`)}): ${b.count} ${b.count === 1 ? 'model' : 'models'}`),
  ];
  return lines.join('\n');
}

function categoryMd(cat) {
  const products = PRODUCTS.filter((p) => p.category === cat.slug);
  const lines = [
    `# ${cat.title}`,
    '',
    `> ${cat.metaDescription}`,
    '',
    cat.seoIntro || cat.lead,
    '',
    `## Models (${products.length})`,
    ...products.map((p) => `- [${p.name}](${absUrl(`/product/${p.slug}/`)}): ${fmtPrice(p.price)} — ${p.brand}`),
  ];
  return lines.join('\n');
}

function brandMd(brand) {
  const products = PRODUCTS.filter((p) => p.brand === brand.name);
  const lines = [
    `# ${brand.name} Electric Bikes & Dirt Bikes`,
    '',
    ...(brand.metaDescription ? [`> ${brand.metaDescription}`, ''] : []),
    ...(brand.seoIntro ? [brand.seoIntro, ''] : []),
    `## Models (${products.length})`,
    ...products.map((p) => `- [${p.name}](${absUrl(`/product/${p.slug}/`)}): ${fmtPrice(p.price)}`),
  ];
  return lines.join('\n');
}

function productMd(p) {
  const cat = getCategory(p.category);
  const lines = [
    `# ${p.name}`,
    '',
    `**Brand:** ${p.brand} · **Category:** ${p.categoryName} · **Price:** ${fmtPrice(p.price)}`,
    '',
    p.fullDescription || p.description,
    '',
    `**Warranty:** ${p.warranty}`,
    '',
    `[Shop more ${p.categoryName}](${absUrl(`/shop/${p.category}/`)}) · [More from ${p.brand}](${absUrl(`/shop/brand/${BRANDS.find((b) => b.name === p.brand)?.slug || ''}/`)})`,
    ...faqSection(p.faqs),
  ];
  if (cat) lines.splice(6, 0, '');
  return lines.join('\n');
}

function blogIndexMd() {
  const lines = [
    `# Electric Dirt Bike Blog & Guides — ${SITE.name}`,
    '',
    'Buying guides, comparisons and plain-English answers on electric dirt bikes, e-motos and e-bikes.',
    '',
    '## Posts',
    ...POSTS.map((post) => `- [${post.title}](${absUrl(`/blog/${post.slug}/`)}): ${post.description} — ${post.date}, ${post.readTime}`),
  ];
  return lines.join('\n');
}

function blogPostMd(post) {
  // post.body already opens with its own H1, date/readTime line and lead
  // paragraph (see posts.json) -- converting it alone avoids duplicating
  // that header, unlike every other page type here which builds its own.
  return htmlToMarkdown(post.body) + faqSection(post.faqs).join('\n');
}

function faqMd() {
  const lines = [
    `# Frequently Asked Questions — ${SITE.name}`,
    '',
    ...FAQS.flatMap((f) => [`## ${f.q}`, '', f.a, '']),
  ];
  return lines.join('\n');
}

function reviewsMd() {
  const lines = [
    `# Customer Reviews — ${SITE.name}`,
    '',
    `${REVIEW_STATS.average}/5 average from ${REVIEW_STATS.count} verified customer reviews.`,
    '',
    ...REVIEWS.flatMap((r) => [`## ${r.title} — ${r.rating}/5`, '', `${r.name}, ${r.state} — ${r.dateDisplay}`, '', r.text, '']),
  ];
  return lines.join('\n');
}

export function getMarkdownForPath(pathname) {
  if (pathname === '/') return homepageMd();
  if (pathname === '/shop/') return shopIndexMd();
  if (pathname === '/shop/brand/') return brandHubMd();
  if (pathname === '/blog/') return blogIndexMd();
  if (pathname === '/faq/') return faqMd();
  if (pathname === '/reviews/') return reviewsMd();

  let m;
  if ((m = pathname.match(/^\/shop\/brand\/([^/]+)\/$/))) {
    const brand = getBrand(m[1]);
    return brand ? brandMd(brand) : null;
  }
  if ((m = pathname.match(/^\/shop\/([^/]+)\/$/))) {
    const cat = getCategory(m[1]);
    return cat ? categoryMd(cat) : null;
  }
  if ((m = pathname.match(/^\/product\/([^/]+)\/$/))) {
    const p = getProduct(m[1]);
    return p ? productMd(p) : null;
  }
  if ((m = pathname.match(/^\/blog\/([^/]+)\/$/))) {
    const post = getPost(m[1]);
    return post ? blogPostMd(post) : null;
  }
  return null;
}
