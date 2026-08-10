import Breadcrumbs from '@/components/Breadcrumbs';
import CartView from '@/components/CartView';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Shopping Cart',
  alternates: { canonical: absUrl('/cart/') },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Your cart</span>
          <h1>Shopping Cart</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
