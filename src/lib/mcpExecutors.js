// Executors for the tools declared in src/data/mcp-tools.json (the single
// source of truth for name/description/inputSchema, shared with
// scripts/gen-agent-files.mjs so server-card.json and the live tools/list
// response can never drift apart). Read-only plus order-DRAFT only -- never
// captures payment or personal data (WebForge Agent-Ready V1 hard rule).
import { SITE, PRODUCTS, CATEGORIES, getProduct, absUrl } from '@/config/site';

function searchText(p) {
  return `${p.name} ${p.brand} ${p.description}`.toLowerCase();
}

export function search_products(args = {}) {
  const { query, category, max_price } = args;
  let list = PRODUCTS;
  if (category) list = list.filter((p) => p.category === category);
  if (typeof max_price === 'number') list = list.filter((p) => p.price <= max_price);
  if (query) {
    const needle = String(query).toLowerCase();
    list = list.filter((p) => searchText(p).includes(needle));
  }
  return list.slice(0, 25).map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    currency: SITE.currency,
    category: p.categoryName,
    short: p.description,
    url: absUrl(`/product/${p.slug}/`),
  }));
}

export function get_product(args = {}) {
  const p = getProduct(args.slug);
  if (!p) return { error: `No product found with slug "${args.slug}"` };
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.categoryName,
    price: p.price,
    currency: SITE.currency,
    description: p.description,
    fullDescription: p.fullDescription,
    warranty: p.warranty,
    images: p.images.map((img) => absUrl(`/images/products/${img}`)),
    availability: 'in_stock',
    url: absUrl(`/product/${p.slug}/`),
    faqs: p.faqs || [],
  };
}

export function list_categories() {
  return CATEGORIES.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.lead,
    count: PRODUCTS.filter((p) => p.category === c.slug).length,
    url: absUrl(`/shop/${c.slug}/`),
  }));
}

export function get_policies() {
  return {
    shipping: `Ships to ${SITE.areaServed.join(', ')}. Free shipping over $${SITE.freeShipThreshold.toLocaleString()}, flat $${SITE.flatShip} below that. International orders may be subject to import duties and taxes payable by the recipient.`,
    returns:
      'Unused, undamaged items in original packaging can be returned within our stated return window. Some items may be non-returnable once registered or ridden. See the Returns & Refunds page for full details.',
    payment: ['crypto-BTC', 'crypto-USDT', 'bank-transfer', 'card'],
    ordering: `Email (${SITE.email} or ${absUrl('/order/')}) is the primary, recommended ordering method. WhatsApp is a secondary option for those who prefer chat.`,
    cryptoDiscountPct: SITE.cryptoDiscountPct,
    minimumOrderUsd: SITE.minOrder,
    currency: SITE.currency,
    policyUrls: { order: absUrl('/order/'), shipping: absUrl('/shipping/'), returns: absUrl('/refund/'), terms: absUrl('/terms/') },
  };
}

export function get_wholesale_info() {
  return {
    summary:
      'Wholesale/dealer accounts are approved via application, reviewed within 48 hours. Pricing and minimums are confirmed per account, not published publicly.',
    applyUrl: absUrl('/wholesale/'),
    contactEmail: SITE.email,
  };
}

export function create_order_draft(args = {}) {
  const items = Array.isArray(args.items) ? args.items : [];
  const resolved = [];
  const unknownSlugs = [];
  for (const item of items) {
    const p = getProduct(item?.slug);
    if (!p) { unknownSlugs.push(item?.slug); continue; }
    const qty = Number(item.qty) > 0 ? Math.floor(Number(item.qty)) : 1;
    resolved.push({ slug: p.slug, name: p.name, price: p.price, qty, lineTotal: p.price * qty });
  }
  if (!resolved.length) return { error: 'No valid product slugs were provided.' };

  const subtotal = resolved.reduce((sum, i) => sum + i.lineTotal, 0);
  const meetsMinimumOrder = subtotal >= SITE.minOrder;
  const shipping = subtotal >= SITE.freeShipThreshold ? 0 : SITE.flatShip;
  const total = subtotal + shipping;
  const cryptoDiscountIfPaidInCrypto = Math.round(total * SITE.cryptoDiscountPct) / 100;

  const lines = resolved.map((i) => `${i.qty}x ${i.name} — $${i.lineTotal.toLocaleString()}`).join('\n');
  const message = [
    `Hi ${SITE.name}, I'd like to order:`,
    lines,
    `Subtotal: $${subtotal.toLocaleString()}`,
    shipping ? `Shipping: $${shipping}` : 'Shipping: Free',
    `Total: $${total.toLocaleString()}`,
    args.notes ? `Notes: ${args.notes}` : null,
  ].filter(Boolean).join('\n');

  return {
    items: resolved,
    unknownSlugs,
    subtotal,
    shipping,
    total,
    currency: SITE.currency,
    meetsMinimumOrder,
    minimumOrderUsd: SITE.minOrder,
    cryptoDiscountIfPaidInCrypto,
    // Email is the primary, recommended ordering method -- orderFormUrl and
    // mailtoUrl come first and are what an agent should offer by default.
    // whatsappDraftUrl is a secondary option, only if the buyer prefers chat.
    orderFormUrl: absUrl('/order/'),
    mailtoUrl: `mailto:${SITE.email}?subject=${encodeURIComponent(`New order — ${SITE.name}`)}&body=${encodeURIComponent(message)}`,
    whatsappDraftUrl: `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`,
    note: `This is a draft only. Email (orderFormUrl or mailtoUrl) is the primary, recommended way to complete this — WhatsApp (whatsappDraftUrl) is a secondary option. A human at ${SITE.name} confirms stock, final pricing and shipping before any payment is taken. No payment or personal data is collected via this tool.`,
  };
}

export const EXECUTORS = { search_products, get_product, list_categories, get_policies, get_wholesale_info, create_order_draft };
