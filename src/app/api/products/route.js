import { NextResponse } from 'next/server';
import { SITE, PRODUCTS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q');
  const limit = Number(searchParams.get('limit'));

  let list = PRODUCTS;
  if (category) list = list.filter((p) => p.category === category);
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter((p) => `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(needle));
  }
  if (limit > 0) list = list.slice(0, limit);

  const products = list.map((p) => ({
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    categoryName: p.categoryName,
    price: p.price,
    currency: SITE.currency,
    description: p.description,
    image: absUrl(`/images/products/${p.images[0]}`),
    url: absUrl(`/product/${p.slug}/`),
  }));

  return NextResponse.json({ count: products.length, products }, { headers: HEADERS });
}
