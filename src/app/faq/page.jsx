import Breadcrumbs from '@/components/Breadcrumbs';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import { FAQS, absUrl } from '@/config/site';

export const metadata = {
  title: 'FAQ — Electric Dirt Bikes & E-Bikes',
  description: 'Answers to common questions about electric dirt bikes and e-bikes: ordering, financing, shipping, returns and more at Umbra Electric.',
  alternates: { canonical: absUrl('/faq/') },
};

export default function FaqPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <JsonLd data={faqLd} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Answers</span>
          <h1>Frequently Asked Questions</h1>
          <p className="lead">Everything you need to know about ordering electric dirt bikes and e-bikes from Umbra Electric.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <FaqAccordion faqs={FAQS} />
          <div className="center" style={{ marginTop: '2rem' }}>
            <a className="btn-primary" href="/shop/">
              Shop the collection
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
