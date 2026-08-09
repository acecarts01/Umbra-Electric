import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import { SITE, CATEGORIES, PRODUCTS, getCategory, absUrl } from '@/config/site';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

export async function generateMetadata({ params }) {
  const { cat: catSlug } = await params;
  const cat = getCategory(catSlug);
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.metaDescription,
    alternates: { canonical: absUrl(`/shop/${cat.slug}/`) },
  };
}

export default async function CategoryPage({ params }) {
  const { cat: catSlug } = await params;
  const cat = getCategory(catSlug);
  if (!cat) notFound();
  const products = PRODUCTS.filter((p) => p.category === cat.slug);

  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absUrl('/shop/') },
      { '@type': 'ListItem', position: 3, name: cat.title, item: absUrl(`/shop/${cat.slug}/`) },
    ],
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.title} — ${SITE.name}`,
    url: absUrl(`/shop/${cat.slug}/`),
    about: cat.title,
    numberOfItems: products.length,
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <JsonLd data={collectionLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: cat.title }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Category</span>
          <h1>{cat.title}</h1>
          <p className="lead">{cat.lead}</p>
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
