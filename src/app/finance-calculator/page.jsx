import Breadcrumbs from '@/components/Breadcrumbs';
import FinanceCalculator from '@/components/FinanceCalculator';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Electric Bike Payment Plan Calculator',
  description: 'Estimate an electric bike payment plan before you buy. Enter any bike price to see a simple 4-payment financing breakdown at Umbra Electric.',
  alternates: { canonical: absUrl('/finance-calculator/') },
};

export default function FinanceCalculatorPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Finance Calculator', href: '/finance-calculator/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Tools</span>
          <h1>Finance Calculator</h1>
          <p className="lead">Estimate an electric bike payment plan — a simple 4-payment breakdown for any bike price.</p>
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
