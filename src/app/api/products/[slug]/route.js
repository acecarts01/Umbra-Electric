import { NextResponse } from 'next/server';
import { SITE, getProduct, absUrl } from '@/config/site';

const HEADERS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET(_request, { params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: HEADERS });

  return NextResponse.json(
    {
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      categoryName: p.categoryName,
      price: p.price,
      currency: SITE.currency,
      description: p.description,
      fullDescription: p.fullDescription,
      warranty: p.warranty,
      images: p.images.map((img) => absUrl(`/images/products/${img}`)),
      faqs: p.faqs || [],
      url: absUrl(`/product/${p.slug}/`),
    },
    { headers: HEADERS }
  );
}
