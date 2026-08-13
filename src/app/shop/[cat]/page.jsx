import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import { SITE, CATEGORIES, PRODUCTS, POSTS, getCategory, absUrl } from '@/config/site';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.slug }));
}

// Hand-tuned per photo by simulating the actual object-fit:cover crop at
// both a standard 1920x1080 desktop and mobile, then checking the subject
// stays in frame -- see scripts/process-hero-images.mjs for how the master
// 2:1 banner crop itself was generated. Default (unlisted) is "50% 50%".
const BANNER_POSITION = {
  'adult-electric-dirt-bikes': '50% 10%',
  'electric-road-gravel-bikes': '50% 10%',
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
  const relatedPosts = (cat.relatedPosts || []).map((slug) => POSTS.find((p) => p.slug === slug)).filter(Boolean);

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
      <JsonLd data={collectionLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: cat.title, href: `/shop/${cat.slug}/` }]} />
      <section className="photo-banner" style={{ '--pos-d': BANNER_POSITION[cat.slug] || '50% 50%', '--pos-m': '50% 50%' }}>
        <SmartImage src={`/images/categories/${cat.slug}-banner.webp`} alt={`${cat.title} — ${SITE.name}`} fill fit="cover" priority sizes="100vw" />
        <div className="photo-banner-scrim" />
        <div className="container photo-banner-in">
          <span className="eyebrow">Category</span>
          <h1>{cat.title}</h1>
          <p className="lead">{cat.lead}</p>
        </div>
      </section>
      {cat.seoIntro && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container prose">
            <p>{cat.seoIntro}</p>
            {relatedPosts.length > 0 && (
              <p className="muted" style={{ fontSize: '.9rem' }}>
                Learn more:{' '}
                {relatedPosts.map((post, i) => (
                  <span key={post.slug}>
                    {i > 0 && ' · '}
                    <a href={`/blog/${post.slug}/`}>{post.title}</a>
                  </span>
                ))}
              </p>
            )}
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
