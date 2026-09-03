import { SITE, CATEGORIES, PRODUCTS, POSTS, BRANDS, absUrl } from '@/config/site';

// Never list a noindex'd route here (cart, order, tracking all set
// `robots: { index: false }` in their own metadata) -- a sitemap entry for a
// noindex page trips GSC's "Submitted URL marked noindex" warning.
const STATIC_PAGES = [
  '', 'shop', 'shop/brand', 'premium', 'compare',
  'about', 'blog', 'contact', 'wholesale', 'faq', 'reviews',
  'shipping', 'refund', 'privacy', 'terms',
];

export default function sitemap() {
  const now = new Date().toISOString();

  const staticEntries = STATIC_PAGES.map((p) => ({
    url: absUrl(p ? `/${p}/` : '/'),
    lastModified: now,
    changeFrequency: p === '' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  const categoryEntries = CATEGORIES.map((c) => ({
    url: absUrl(`/shop/${c.slug}/`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const brandEntries = BRANDS.map((b) => ({
    url: absUrl(`/shop/brand/${b.slug}/`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const productEntries = PRODUCTS.map((p) => ({
    url: absUrl(`/product/${p.slug}/`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const postEntries = POSTS.map((post) => ({
    url: absUrl(`/blog/${post.slug}/`),
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...brandEntries, ...productEntries, ...postEntries];
}
