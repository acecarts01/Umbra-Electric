import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import { SITE, PRODUCTS, absUrl } from '@/config/site';

export const metadata = {
  title: 'About Umbra Electric — Seattle-Based Electric Bike Retailer',
  description: `${SITE.brandStatement.slice(0, 150)}...`,
  alternates: { canonical: absUrl('/about/') },
};

export default function AboutPage() {
  const brandCount = new Set(PRODUCTS.map((p) => p.brand)).size;

  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: absUrl('/about/'),
    mainEntity: { '@type': 'Organization', name: SITE.name, description: SITE.brandStatement, foundingDate: SITE.founded },
  };

  return (
    <>
      <JsonLd data={aboutLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }]} />
      <section className="photo-banner" style={{ '--pos-d': '50% 50%', '--pos-m': '50% 50%' }}>
        <SmartImage src="/images/hero/hero-1.webp" alt={`The ${SITE.name} team — Umbra Electric`} fill fit="cover" priority sizes="100vw" />
        <div className="photo-banner-scrim" />
        <div className="container photo-banner-in">
          <span className="eyebrow">Our story</span>
          <h1>About {SITE.name}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p className="about-intro">{SITE.brandStatement}</p>
          <h2>Why we started</h2>
          <p>
            {SITE.name} was founded in {SITE.founded} in {SITE.hqPlace.split(',')[0]}, out of frustration with how electric dirt bikes and
            e-bikes were being sold. The category was booming, but most stores stocked everything and stood behind nothing. We wanted the
            opposite: a tightly curated shop where every machine is chosen on merit, and where buyers get honest guidance instead of a wall of
            options.
          </p>
          <h2>What we stand for</h2>
          <p>
            The name says it. An <em>umbra</em> is the darkest, most complete part of a shadow — total, uncompromising. That&apos;s our
            standard for the catalog. We carry {PRODUCTS.length} models across 8 categories from {brandCount} premium brands, spanning
            flagship electric dirt bikes and e-motos, premium electric mountain bikes, and refined commuter, road, fat-tire, folding and
            youth e-bikes.
          </p>
          <h2>How we&apos;re different</h2>
          <div className="grid-2" style={{ margin: '1.2rem 0' }}>
            <div className="card-soft">
              <h3>Ruthless curation</h3>
              <p className="muted">We don&apos;t list bikes we wouldn&apos;t ride. Every model earns its place on build quality and ride feel.</p>
            </div>
            <div className="card-soft">
              <h3>Two clear worlds</h3>
              <p className="muted">Off-highway e-motos and pedal-assist e-bikes, kept distinct so you find the right machine fast.</p>
            </div>
            <div className="card-soft">
              <h3>Real guidance</h3>
              <p className="muted">Concierge help by email (WhatsApp too) and honest advice on street-legality before you order.</p>
            </div>
            <div className="card-soft">
              <h3>Worldwide delivery</h3>
              <p className="muted">
                We ship across the United States, Europe and worldwide, with free shipping over ${SITE.freeShipThreshold.toLocaleString()}.
              </p>
            </div>
          </div>
          <h2>Milestones</h2>
          <ul className="timeline">
            <li><b>2022</b><span>{SITE.name} founded in {SITE.hqPlace}.</span></li>
            <li><b>2023</b><span>Expanded into premium electric mountain, road and commuter e-bikes.</span></li>
            <li><b>2024</b><span>Began worldwide shipping across the U.S., Europe and beyond.</span></li>
            <li><b>2026</b><span>Curated catalog grows to {PRODUCTS.length} models from {brandCount} premium brands.</span></li>
          </ul>
          <h2>Product range</h2>
          <p>
            From race-level <a href="/product/stark-varg-standard/">electric motocross</a> to category-defining{' '}
            <a href="/shop/adult-electric-dirt-bikes/">e-motos</a>, carbon <a href="/shop/electric-mountain-bikes/">eMTBs</a>, and everyday{' '}
            <a href="/shop/electric-commuter-bikes/">commuter e-bikes</a> — plus <a href="/shop/kids-electric-dirt-bikes/">youth</a> models
            for the next generation of riders.
          </p>
          <h2>Where we ship &amp; how to reach us</h2>
          <p>
            We ship across the United States, Europe and worldwide. Questions before you buy? Reach us via the{' '}
            <a href="/contact/">contact page</a> or email — <a href={`https://wa.me/${SITE.whatsapp}`}>WhatsApp</a> works too — we typically
            respond within 24 hours.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <a className="btn-primary" href="/shop/">
              Explore the collection
            </a>{' '}
            <a className="btn-secondary" href="/contact/">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
