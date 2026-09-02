import { NextResponse } from 'next/server';
import { SITE, CATEGORIES, PRODUCTS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

// Live services behind .well-known/ucp (WebForge Agent-Ready V3) -- same
// reasoning as /api/acp/catalog: the static UCP file points here instead of
// only describing HTML pages.
export async function GET() {
  return NextResponse.json(
    {
      ucp: '1.0',
      site: absUrl('/'),
      services: [
        {
          id: 'product-catalog',
          type: 'catalog',
          itemCount: PRODUCTS.length,
          categories: CATEGORIES.map((c) => c.slug),
          url: absUrl('/api/products'),
        },
        { id: 'search', type: 'search', url: absUrl('/api/search') },
        { id: 'mcp', type: 'agent', url: absUrl('/api/mcp') },
        { id: 'order-by-email', type: 'commerce', ordering: 'human-assisted-email', url: absUrl('/order/') },
        { id: 'order-via-whatsapp', type: 'commerce', ordering: 'human-assisted-whatsapp', url: `https://wa.me/${SITE.whatsapp}` },
      ],
      currency: SITE.currency,
      minimum_order_usd: SITE.minOrder,
    },
    { headers: HEADERS }
  );
}
