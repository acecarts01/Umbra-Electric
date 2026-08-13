import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import { SITE, BRANDS, PRODUCTS, getBrand, absUrl } from '@/config/site';

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) return {};
  return {
    title: `${brand.name} Electric Bikes & Dirt Bikes`,
    description:
      brand.metaDescription ||
      `Shop ${brand.count} ${brand.name} electric dirt bikes and e-bikes at ${SITE.name}. Curated models, financing and worldwide shipping.`,
    alternates: { canonical: absUrl(`/shop/brand/${brand.slug}/`) },
  };
}

export default async function BrandPage({ params }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();
  const products = PRODUCTS.filter((p) => p.brand === brand.name);

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brand.name} — ${SITE.name}`,
    url: absUrl(`/shop/brand/${brand.slug}/`),
    ...(brand.metaDescription ? { description: brand.metaDescription } : {}),
    about: { '@type': 'Brand', name: brand.name },
    numberOfItems: products.length,
  };

  return (
    <>
      <JsonLd data={collectionLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: brand.name, href: `/shop/brand/${brand.slug}/` }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Brand</span>
          <h1>{brand.name}</h1>
          <p className="lead">
            {products.length} {products.length === 1 ? 'model' : 'models'} from {brand.name} at {SITE.name}.
          </p>
        </div>
      </section>
      {brand.seoIntro && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container prose">
            <p>{brand.seoIntro}</p>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
