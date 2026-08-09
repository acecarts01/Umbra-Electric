import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import { SITE, PRODUCTS, absUrl } from '@/config/site';

export const metadata = {
  title: 'Shop All Electric Dirt Bikes & E-Bikes',
  description: `Browse all ${PRODUCTS.length} premium electric dirt bikes, e-motos and e-bikes at ${SITE.name}. Financing and worldwide shipping.`,
  alternates: { canonical: absUrl('/shop/') },
};

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;
  const q = sp?.q || '';
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absUrl('/shop/') },
    ],
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>All Electric Dirt Bikes &amp; E-Bikes</h1>
          <p className="lead">{PRODUCTS.length} curated models across 8 categories. Premium brands, financing and worldwide shipping.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductGrid products={PRODUCTS} searchQuery={q} />
        </div>
      </section>
    </>
  );
}
