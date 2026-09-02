import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import Gallery from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import ProductBuyRow from '@/components/ProductBuyRow';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { SITE, PRODUCTS, getProduct, getCategory, relatedProducts, absUrl, fmtPrice } from '@/config/site';

const DIRT_BIKE_CATEGORIES = ['adult-electric-dirt-bikes', 'kids-electric-dirt-bikes'];

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

// Adaptive: appends a transactional keyword ("for sale" / "price") to the
// product-title tag only when it fits the 60-char budget alongside the
// layout's " — Umbra Electric" template suffix -- some product names alone
// are already 40 chars, leaving no room to spare.
function productTitleTag(name) {
  const titleSuffixLen = SITE.name.length + 3; // " — " + site name
  const budget = 60 - titleSuffixLen;
  for (const candidate of [`${name} For Sale`, `${name} Price`]) {
    if (candidate.length <= budget) return candidate;
  }
  return name;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const titleTag = productTitleTag(p.name);
  const title = `${titleTag} — ${SITE.name}`;
  const description = `${p.name} for sale — ${fmtPrice(p.price)}. ${p.categoryName} from ${p.brand} at ${SITE.name}, with financing.`;
  return {
    title: titleTag,
    description,
    alternates: { canonical: absUrl(`/product/${p.slug}/`) },
    openGraph: { type: 'website', title, description, url: absUrl(`/product/${p.slug}/`), images: [absUrl(`/images/products/${p.images[0]}`)] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const related = relatedProducts(p, 4);
  const isDirtBike = DIRT_BIKE_CATEGORIES.includes(p.category);
  const waMessage = `Hi ${SITE.name}, I am interested in the ${p.name} (${fmtPrice(p.price)}).`;

  const keywords = p.primaryKeyword ? [p.primaryKeyword, ...(p.supportingKeywords || [])] : null;

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: p.images.map((img) => absUrl(`/images/products/${img}`)),
    sku: p.sku,
    brand: { '@type': 'Brand', name: p.brand },
    category: p.categoryName,
    ...(keywords ? { keywords: keywords.join(', ') } : {}),
    offers: {
      '@type': 'Offer',
      url: absUrl(`/product/${p.slug}/`),
      priceCurrency: SITE.currency,
      price: String(p.price),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: SITE.name },
    },
  };

  const faqLd =
    p.faqs && p.faqs.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: p.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
        }
      : null;

  return (
    <>
      <JsonLd data={productLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop/' },
          { label: cat?.title || p.categoryName, href: `/shop/${p.category}/` },
          { label: p.name, href: `/product/${p.slug}/` },
        ]}
      />
      <section className="section">
        <div className="container">
          <div className="pd">
            <Gallery images={p.images} name={p.name} />
            <div>
              <span className="brandtag" style={{ fontFamily: 'var(--font-inter),sans-serif', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', fontSize: '.75rem' }}>
                {p.brand}
              </span>
              <h1>{p.name}</h1>
              <div className="price">{fmtPrice(p.price)}</div>
              <p className="instock">✓ In stock · Ships United States, Europe &amp; Worldwide</p>
              <p className="muted">{p.fullDescription}</p>
              <ProductBuyRow slug={p.slug} name={p.name} price={p.price} />
              <a className="btn-secondary btn-block" href="/order/" style={{ marginBottom: '.6rem' }}>
                Order by Email
              </a>
              <a className="btn-ghost btn-block" href="/financing/">
                Financing available →
              </a>
              <p className="buyrow-note">
                Ordering by email is our primary, recommended method — we confirm stock, final pricing and shipping before any payment. Prefer
                chat?{' '}
                <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener">
                  Message us on WhatsApp
                </a>
                .
              </p>
              {isDirtBike && (
                <div className="compliance-warning">
                  ⚠ Off-Road Use Only: This vehicle is designed for off-road, private-land use. It is not street-legal without appropriate
                  registration, insurance and licensing where required. Always wear a helmet and proper safety gear, and check your state and
                  local OHV laws before riding.
                </div>
              )}
            </div>
          </div>

          <div className="tabs">
            <h2>Specifications</h2>
            <table className="spec-table">
              <tbody>
                <tr><td>Brand</td><td>{p.brand}</td></tr>
                <tr><td>Category</td><td>{p.categoryName}</td></tr>
                <tr><td>Model</td><td>{p.name}</td></tr>
                {p.highlight && <tr><td>Highlight</td><td>{p.highlight}</td></tr>}
                <tr><td>Condition</td><td>New</td></tr>
                <tr><td>Drivetrain</td><td>Electric</td></tr>
                <tr><td>Availability</td><td>In stock — ships worldwide</td></tr>
                <tr><td>Warranty</td><td>{p.warranty}</td></tr>
                <tr><td>Shipping</td><td>Free over {fmtPrice(SITE.freeShipThreshold)}</td></tr>
              </tbody>
            </table>
            <p className="muted" style={{ fontSize: '.85rem', marginTop: '1rem' }}>
              Specifications are indicative and provided in good faith; they may vary by production batch and configuration. Confirm final
              specs, pricing and availability with {SITE.name} before ordering.
            </p>
          </div>

          {related.length > 0 && (
            <div className="tabs">
              <h2>Related models</h2>
              <div className="prod-grid">
                {related.map((r) => (
                  <ProductCard key={r.slug} product={r} />
                ))}
              </div>
            </div>
          )}

          {p.faqs && p.faqs.length > 0 && (
            <div className="tabs">
              <h2>Frequently asked questions</h2>
              <FaqAccordion faqs={p.faqs} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
