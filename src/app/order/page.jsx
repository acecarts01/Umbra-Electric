import Breadcrumbs from '@/components/Breadcrumbs';
import OrderForm from '@/components/OrderForm';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Place an Order',
  description: 'Email is our primary, recommended way to order. We confirm availability, final pricing, payment and shipping before any payment.',
  alternates: { canonical: absUrl('/order/') },
  robots: { index: false, follow: true },
};

export default function OrderPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Order' }]} />
      <section className="form-section">
        <div className="container">
          <span className="eyebrow">Checkout</span>
          <h1>Place an Order</h1>
          <p className="lead">
            Email is our primary, recommended way to order. Fill this out and we&apos;ll confirm availability, final pricing, payment and
            shipping by email — usually within a few hours. Your cart items attach automatically; no payment is taken here.
          </p>
          <OrderForm />
        </div>
      </section>
    </>
  );
}
