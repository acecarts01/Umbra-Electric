import Breadcrumbs from '@/components/Breadcrumbs';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Financing',
  description: 'Electric dirt bike financing at Umbra Electric. Finance your electric bike with a flexible payment plan and pay monthly instead of paying in full.',
  alternates: { canonical: absUrl('/financing/') },
};

export default function FinancingPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Financing', href: '/financing/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Financing</span>
          <h1>Electric Dirt Bike Financing</h1>
          <p className="lead">
            Premium machines deserve flexible payment. Finance your electric dirt bike or e-bike and pay monthly instead of paying in
            full, with a simple payment plan at checkout.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <h2>How electric dirt bike financing works</h2>
          <p>
            At checkout you can choose a financing or pay-later option instead of paying in full. Split your purchase into manageable
            payments and ride sooner. Use our <a href="/finance-calculator/">finance calculator</a> to estimate a simple 4-payment plan
            before you buy.
          </p>
          <h2>Payment options</h2>
          <ul>
            <li>
              <strong>Pay in 4</strong> — split your purchase into four interest-free installments (subject to status).
            </li>
            <li>
              <strong>Crypto</strong> — pay with BTC/USDT and save 10% instantly.
            </li>
            <li>
              <strong>Bank transfer &amp; card</strong> — standard secure payment methods.
            </li>
          </ul>
          <h2>Good to know</h2>
          <div className="warn">
            Pay-later plans split your purchase into equal installments. The first payment is taken at checkout; remaining payments follow on
            schedule. Subject to status and approval. Age 18+ required. Terms apply. Financing availability and providers may vary by region.
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <a className="btn-primary" href="/finance-calculator/">
              Open the finance calculator
            </a>{' '}
            <a className="btn-secondary" href="/shop/">
              Shop now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
