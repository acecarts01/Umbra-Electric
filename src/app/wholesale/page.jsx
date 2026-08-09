import Breadcrumbs from '@/components/Breadcrumbs';
import WholesaleForm from '@/components/WholesaleForm';
import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Wholesale Application',
  description: `Apply for a ${SITE.name} wholesale account. Competitive pricing, flexible minimums and fast fulfilment for dealers and retailers.`,
  alternates: { canonical: absUrl('/wholesale/') },
};

export default function WholesalePage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Wholesale' }]} />
      <section className="form-section">
        <div className="container">
          <span className="eyebrow">Trade</span>
          <h1>Wholesale Application</h1>
          <p className="lead">
            Apply for a {SITE.name} wholesale account. Competitive pricing, flexible minimums and fast fulfilment for dealers and retailers.
            We review all applications within 48 hours.
          </p>
          <WholesaleForm />
        </div>
      </section>
    </>
  );
}
