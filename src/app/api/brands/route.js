import { NextResponse } from 'next/server';
import { BRANDS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET() {
  const brands = BRANDS.map((b) => ({ slug: b.slug, name: b.name, count: b.count, url: absUrl(`/shop/brand/${b.slug}/`) }));
  return NextResponse.json({ count: brands.length, brands }, { headers: HEADERS });
}
