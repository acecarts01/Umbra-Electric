import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import { SITE, CATEGORIES, PRODUCTS, getCategory, absUrl } from '@/config/site';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

// Hand-tuned per photo by simulating the actual object-fit:cover crop at
// both a standard 1920x1080 desktop and mobile, then checking the subject
// stays in frame -- see scripts/process-hero-images.mjs for how the master
// 2:1 banner crop itself was generated. Default (unlisted) is "50% 50%".
const BANNER_POSITION = {
  'adult-electric-dirt-bikes': '50% 10%',
  'kids-electric-dirt-bikes': '50% 0%',
  'electric-mountain-bikes': '50% 10%',
  'electric-commuter-bikes': '50% 10%',
  'electric-road-gravel-bikes': '50% 10%',
  'electric-fat-tire-bikes': '50% 10%',
  'kids-electric-bikes': '50% 70%',
  'folding-electric-bikes': '50% 40%',
};

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
      <section className="photo-banner" style={{ '--pos-d': BANNER_POSITION[cat.slug] || '50% 50%', '--pos-m': '50% 50%' }}>
        <SmartImage src={`/images/categories/${cat.slug}-banner.webp`} alt={`${cat.title} — ${SITE.name}`} fill fit="cover" priority sizes="100vw" />
        <div className="photo-banner-scrim" />
        <div className="container photo-banner-in">
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
