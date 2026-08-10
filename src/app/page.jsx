import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import BrandMenu from '@/components/BrandMenu';
import ProductCard from '@/components/ProductCard';
import FaqAccordion from '@/components/FaqAccordion';
import ReviewCard from '@/components/ReviewCard';
import JsonLd from '@/components/JsonLd';
import SmartImage from '@/components/SmartImage';
import { SITE, PRODUCTS, POSTS, FAQS, REVIEWS, REVIEW_STATS, getProduct, absUrl } from '@/config/site';

export const metadata = {
  title: `${SITE.name} — Premium Electric Dirt Bikes & E-Bikes`,
  description:
    'Premium electric dirt bikes, e-motos & e-bikes for adults and kids. Curated flagship brands, financing and worldwide shipping from Umbra Electric.',
  alternates: { canonical: absUrl('/') },
  openGraph: {
    type: 'website',
    title: `${SITE.name} — Premium Electric Dirt Bikes & E-Bikes`,
    description: 'Premium electric dirt bikes, e-motos & e-bikes for adults and kids. Curated flagship brands, financing and worldwide shipping.',
    url: absUrl('/'),
    siteName: SITE.name,
    locale: SITE.locale,
    images: [absUrl('/images/og-default.webp')],
  },
};

const FEATURED_SLUGS = [
  'stark-varg-standard', 'sur-ron-ultra-bee', 'talaria-komodo-new-2026', 'specialized-turbo-levo-sl-comp-carbon',
  'santa-cruz-heckler-sl-cc-x0-axs', 'zero-fx', 'altis-sigma', 'aventon-level-3',
  'ktm-freeride-e-xc', 'yeti-160e-t2', 'lectric-xp-3-0', 'e-ride-pro-ss-2-0',
];

export default function HomePage() {
  const featured = FEATURED_SLUGS.map(getProduct).filter(Boolean);
  const homeFaqs = FAQS.slice(0, 4);

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: absUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: absUrl('/shop/?q={search_term_string}') },
      'query-input': 'required name=search_term_string',
    },
  };
  const speakableLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: absUrl('/'),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.brand-statement', '.hero-description', '.about-intro'] },
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: homeFaqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <JsonLd data={websiteLd} />
      <JsonLd data={speakableLd} />
      <JsonLd data={faqLd} />
      <Hero />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Browse</span>
          <h2>Shop by category</h2>
          <div style={{ marginTop: '1.5rem' }}>
            <CategoryGrid />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <span className="eyebrow">Brands</span>
          <h2>Shop by brand</h2>
          <p className="muted" style={{ marginTop: '.4rem' }}>
            {PRODUCTS.length} models from ~100 premium brands — browse by name.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <BrandMenu />
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="trust-in">
          <div>
            <span className="ic" aria-hidden="true">🚚</span> Fast US &amp; worldwide shipping
          </div>
          <div>
            <span className="ic" aria-hidden="true">✓</span> Curated premium brands
          </div>
          <div>
            <span className="ic" aria-hidden="true">💬</span> WhatsApp concierge support
          </div>
          <div>
            <span className="ic" aria-hidden="true">₿</span> Crypto welcome · {SITE.cryptoDiscountPct}% off
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <span className="eyebrow">Handpicked</span>
          <h2>Featured machines</h2>
          <div className="prod-grid" style={{ marginTop: '1.5rem' }}>
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="center" style={{ marginTop: '2rem' }}>
            <a className="btn-secondary" href="/shop/">
              View all {PRODUCTS.length} models
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container prose">
          <span className="eyebrow">Why Umbra</span>
          <h2>The premium electric dirt bike destination</h2>
          <div className="stat-row">
            <div className="stat-card">
              <b>{PRODUCTS.length}</b>
              <span>Curated models</span>
            </div>
            <div className="stat-card">
              <b>8</b>
              <span>Categories</span>
            </div>
            <div className="stat-card">
              <b>~100</b>
              <span>Premium brands</span>
            </div>
            <div className="stat-card">
              <b>$399–$14K</b>
              <span>Price range</span>
            </div>
          </div>
          <p className="brand-statement">{SITE.brandStatement}</p>
          <p>
            The electric off-road world has exploded — and most stores try to sell everything to everyone. {SITE.name} takes the opposite
            approach. We curate only the machines worth owning: flagship{' '}
            <a href="/shop/adult-electric-dirt-bikes/">electric dirt bikes</a> and e-motos from Stark Future, Sur-Ron, Talaria and KTM,
            alongside premium <a href="/shop/electric-mountain-bikes/">electric mountain bikes</a> from Specialized, Santa Cruz and Yeti, and
            refined <a href="/shop/electric-commuter-bikes/">commuter e-bikes</a> for everyday riding.
          </p>
          <h3>Built for two kinds of rider</h3>
          <p>
            Our catalog is organized into two clear worlds. On the e-moto side sit throttle-driven, off-highway electric dirt bikes — instant
            torque, near-silent trails and minimal maintenance. On the pedal-assist side sit e-bikes across mountain, road, commuter, fat-tire
            and folding formats. Whether you want a race-ready <a href="/product/stark-varg-standard/">Stark Varg</a> or an everyday{' '}
            <a href="/shop/electric-commuter-bikes/">commuter</a>, each pick is chosen for build quality, ride feel and long-term ownership.
          </p>
          <h3>Guidance, financing and worldwide delivery</h3>
          <p>
            Big-ticket bikes deserve real guidance. We help you match a machine to your terrain, experience and budget, offer{' '}
            <a href="/financing/">financing</a> and a <a href="/finance-calculator/">payment calculator</a>, and ship across the United
            States, Europe and worldwide. Riders new to the category can start with our <a href="/blog/">guides</a> or use the{' '}
            <a href="/compare/">compare tool</a> to weigh models side by side.
          </p>
          <p>
            Most e-motos are off-highway vehicles — not street-legal without registration and licensing. We keep that front and center so
            you buy with clear expectations. Questions? Reach our team on <a href={`https://wa.me/${SITE.whatsapp}`}>WhatsApp</a> or the{' '}
            <a href="/contact/">contact page</a>.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Reviews</span>
          <h2>What riders are saying</h2>
          <div className="review-summary">
            <span className="avg">{REVIEW_STATS.average}</span>
            <span className="stars-lg">★★★★★</span>
            <span className="muted">based on {REVIEW_STATS.count} verified customer reviews</span>
          </div>
          <div className="review-grid" style={{ marginTop: '1.5rem' }}>
            {[REVIEWS[0], REVIEWS[8], REVIEWS[10]].map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <a className="btn-secondary" href="/reviews/">
              Read all {REVIEW_STATS.count} reviews
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <span className="eyebrow">Answers</span>
          <h2>Frequently asked questions</h2>
          <div style={{ marginTop: '1.5rem' }}>
            <FaqAccordion faqs={homeFaqs} />
          </div>
          <div className="center" style={{ marginTop: '1.5rem' }}>
            <a className="btn-secondary" href="/faq/">
              See all FAQs
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Learn</span>
          <h2>Guides &amp; insights</h2>
          <div className="blog-grid" style={{ marginTop: '1.5rem' }}>
            {POSTS.slice(0, 3).map((post) => (
              <article className="bcard" key={post.slug}>
                <a href={`/blog/${post.slug}/`}>
                  <div className="ph">
                    <SmartImage src={`/images/blog/${post.slug}.webp`} alt={post.title} fill fit="cover" sizes="(max-width:760px) 100vw, 33vw" />
                  </div>
                </a>
                <div className="b">
                  <span className="tag">{post.tag}</span>
                  <h3>
                    <a href={`/blog/${post.slug}/`}>{post.title}</a>
                  </h3>
                  <p className="muted" style={{ fontSize: '.9rem' }}>
                    {post.description}
                  </p>
                  <div className="meta">{post.readTime}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="news">
            <div>
              <h2 style={{ color: 'var(--ivory)', margin: 0 }}>Have a question before you buy?</h2>
              <p style={{ color: '#D8D1C4', margin: '.4rem 0 0' }}>Message our team on WhatsApp or send us a note.</p>
            </div>
            <a className="btn-primary" href="/contact/">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
