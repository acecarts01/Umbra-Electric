import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Umbra Electric terms and conditions of sale.',
  alternates: { canonical: absUrl('/terms/') },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions', href: '/terms/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>These terms govern your use of the {SITE.name} website and your purchases.</p>
          <h2>Company</h2>
          <p>{SITE.name} is a premium electric mobility retailer headquartered in {SITE.hqPlace}, established in {SITE.founded}.</p>
          <h2>Pricing &amp; contract of sale</h2>
          <p>
            Prices are shown in USD and may change without notice. Availability and specifications are provided in good faith and may vary
            by configuration; we confirm final details before an order is fulfilled. A contract of sale forms only once we confirm your
            order.
          </p>
          <h2>Off-road use disclaimer</h2>
          <div className="compliance-warning">
            ⚠ Most electric dirt bikes and e-motos sold by {SITE.name} are off-highway vehicles designed for off-road, private-land use. They
            are not street-legal without appropriate registration, insurance and licensing where required. Always wear a helmet and proper
            safety gear, and check your state and local OHV laws before riding. You are responsible for lawful and safe operation.
          </div>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the State of Washington, United States.</p>
        </div>
      </section>
    </>
  );
}
