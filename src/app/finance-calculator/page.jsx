import Breadcrumbs from '@/components/Breadcrumbs';
import FinanceCalculator from '@/components/FinanceCalculator';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Finance Calculator',
  description: 'Estimate a simple 4-payment plan for any bike price at Umbra Electric.',
  alternates: { canonical: absUrl('/finance-calculator/') },
};

export default function FinanceCalculatorPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Finance Calculator' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Tools</span>
          <h1>Finance Calculator</h1>
          <p className="lead">Estimate a simple 4-payment plan for any bike price.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <FinanceCalculator />
        </div>
      </section>
    </>
  );
}
