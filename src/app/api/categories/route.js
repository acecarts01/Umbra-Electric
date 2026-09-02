import { NextResponse } from 'next/server';
import { CATEGORIES, PRODUCTS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET() {
  const categories = CATEGORIES.map((c) => ({
    slug: c.slug,
    title: c.title,
    description: c.lead,
    count: PRODUCTS.filter((p) => p.category === c.slug).length,
    url: absUrl(`/shop/${c.slug}/`),
  }));

  return NextResponse.json({ count: categories.length, categories }, { headers: HEADERS });
}
