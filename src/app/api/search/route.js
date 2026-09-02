import { NextResponse } from 'next/server';
import { SITE, PRODUCTS, POSTS, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) return NextResponse.json({ query: q, products: [], posts: [] }, { headers: HEADERS });

  const needle = q.toLowerCase();

  const products = PRODUCTS.filter((p) => `${p.name} ${p.brand} ${p.description}`.toLowerCase().includes(needle))
    .slice(0, 20)
    .map((p) => ({ slug: p.slug, name: p.name, brand: p.brand, price: p.price, currency: SITE.currency, url: absUrl(`/product/${p.slug}/`) }));

  const posts = POSTS.filter((post) => `${post.title} ${post.description} ${post.tag}`.toLowerCase().includes(needle))
    .slice(0, 10)
    .map((post) => ({ slug: post.slug, title: post.title, description: post.description, url: absUrl(`/blog/${post.slug}/`) }));

  return NextResponse.json({ query: q, products, posts }, { headers: HEADERS });
}
