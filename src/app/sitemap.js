import { SITE, CATEGORIES, PRODUCTS, POSTS, BRANDS, absUrl } from '@/config/site';

const STATIC_PAGES = [
  '', 'shop', 'premium', 'financing', 'finance-calculator', 'compare', 'tracking',
  'about', 'blog', 'contact', 'wholesale', 'faq', 'cart', 'order', 'reviews',
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
