import Breadcrumbs from '@/components/Breadcrumbs';
import BrandGrid from '@/components/BrandGrid';
import JsonLd from '@/components/JsonLd';
import { SITE, BRANDS, PRODUCTS, absUrl } from '@/config/site';

const PRIMARY_KEYWORD = 'electric bike brands';
const SUPPORTING_KEYWORDS = [
  'best electric dirt bike brands',
  'top electric bike brands USA',
  'premium electric bike brands',
  'electric dirt bike brands',
  'dirt bike brands',
];

export const metadata = {
  title: 'Shop Electric Bike Brands',
  description: `Browse all ${BRANDS.length} electric dirt bike and e-bike brands at ${SITE.name} — ${PRODUCTS.length} curated models across 8 categories, worldwide shipping.`,
  alternates: { canonical: absUrl('/shop/brand/') },
};

export default function BrandHubPage() {
  const crumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absUrl('/shop/') },
      { '@type': 'ListItem', position: 3, name: 'Shop by Brand', item: absUrl('/shop/brand/') },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shop Electric Bike Brands — Umbra Electric',
    url: absUrl('/shop/brand/'),
    description: metadata.description,
    keywords: [PRIMARY_KEYWORD, ...SUPPORTING_KEYWORDS].join(', '),
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: BRANDS.length,
      itemListElement: BRANDS.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        url: absUrl(`/shop/brand/${b.slug}/`),
      })),
    },
  };

  return (
    <>
      <JsonLd data={crumbLd} />
      <JsonLd data={collectionLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop/' }, { label: 'Shop by Brand', href: '/shop/brand/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Shop</span>
          <h1>Shop Electric Bike Brands</h1>
          <p className="lead">
            {BRANDS.length} electric dirt bike and e-bike brands, {PRODUCTS.length} curated models. Every brand at {SITE.name} is chosen for build
            quality — not just filled out for catalog size.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container prose">
          <p>
            From flagship electric dirt bike brands like Sur-Ron, Talaria, KTM and Stark Future to the eMTB names that define the category —
            Specialized, Trek, Santa Cruz, Yeti Cycles — and the commuter and folding e-bike brands riders trust every day, {SITE.name} curates
            across all of it rather than specializing in one niche. Looking for the best electric dirt bike brands or the top electric bike brands
            in the USA? Every brand page below breaks down the specific models we carry, real specs and pricing, and how each one compares to the
            premium electric bike brands riders already know.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <BrandGrid />
        </div>
      </section>
    </>
  );
}
