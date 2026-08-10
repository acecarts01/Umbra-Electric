import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGrid from '@/components/ProductGrid';
import { SITE, PRODUCTS, absUrl, fmtPrice } from '@/config/site';

const PREMIUM_THRESHOLD = 5699;

export const metadata = {
  title: 'Premium Electric Dirt Bikes & Collector E-Bikes',
  description: `Shop premium electric dirt bikes and high performance e-bikes at ${SITE.name}. Race-level power, carbon frames and the premium electric bike brands that define the category.`,
  alternates: { canonical: absUrl('/premium/') },
};

export default function PremiumPage() {
  const premium = PRODUCTS.filter((p) => p.price >= PREMIUM_THRESHOLD);
  const prices = premium.map((p) => p.price);

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Premium / Collectors', href: '/premium/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">The flagship tier</span>
          <h1>Premium Electric Dirt Bikes &amp; Collector E-Bikes</h1>
          <p className="lead">
            Our most exceptional machines — {premium.length} flagship, high performance electric dirt bikes and e-bikes from{' '}
            {fmtPrice(Math.min(...prices))} to {fmtPrice(Math.max(...prices))}, sourced from the premium electric bike brands that define
            the category. Race-level power, carbon frames and true collector-grade builds.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductGrid products={premium} showSort={false} />
        </div>
      </section>
    </>
  );
}
