import { NextResponse } from 'next/server';
import { SITE, CATEGORIES, PRODUCTS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

// Live catalog behind .well-known/acp.json (WebForge Agent-Ready V3) -- the
// static declaration file points here instead of describing an HTML-only
// catalog, so an ACP-aware agent gets real, current JSON rather than a page
// it has to scrape.
export async function GET() {
  return NextResponse.json(
    {
      protocol: { name: 'acp', version: '0.1.0' },
      updated: new Date().toISOString(),
      categories: CATEGORIES.map((c) => ({
        slug: c.slug,
        title: c.title,
        count: PRODUCTS.filter((p) => p.category === c.slug).length,
        url: absUrl(`/shop/${c.slug}/`),
      })),
      products: PRODUCTS.map((p) => ({
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        category: p.category,
        price: p.price,
        currency: SITE.currency,
        url: absUrl(`/product/${p.slug}/`),
      })),
      ordering: 'human-assisted-email',
      ordering_secondary: 'human-assisted-whatsapp',
      contact: { email: SITE.email, order: absUrl('/order/'), whatsapp: `https://wa.me/${SITE.whatsapp}` },
    },
    { headers: HEADERS }
  );
}
