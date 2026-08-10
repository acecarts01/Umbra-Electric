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
    description: `Shop ${brand.count} ${brand.name} electric dirt bikes and e-bikes at ${SITE.name}. Curated models, financing and worldwide shipping.`,
    alternates: { canonical: absUrl(`/shop/brand/${brand.slug}/`) },
  };
}

export default async function BrandPage({ params }) {
  const { brand: brandSlug } = await params;
  const brand = getBrand(brandSlug);
  if (!brand) notFound();
  const products = PRODUCTS.filter((p) => p.brand === brand.name);

  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absUrl('/shop/') },
      { '@type': 'ListItem', position: 3, name: brand.name, item: absUrl(`/shop/brand/${brand.slug}/`) },
    ],
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${brand.name} — ${SITE.name}`,
    url: absUrl(`/shop/brand/${brand.slug}/`),
    about: { '@type': 'Brand', name: brand.name },
    numberOfItems: products.length,
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <JsonLd data={collectionLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: brand.name }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Brand</span>
          <h1>{brand.name}</h1>
          <p className="lead">
            {products.length} {products.length === 1 ? 'model' : 'models'} from {brand.name} at {SITE.name}.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductGrid products={products} />
        </div>
      </section>
    </>
  );
}
