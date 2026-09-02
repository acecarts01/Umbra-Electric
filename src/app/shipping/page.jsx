import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE, absUrl, fmtPrice } from '@/config/site';

export const metadata = {
  title: 'Electric Bike Shipping — USA, Europe & Worldwide',
  description: `${SITE.name} electric bike shipping rates, processing times and delivery information for the United States, Europe and worldwide.`,
  alternates: { canonical: absUrl('/shipping/') },
};

export default function ShippingPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Shipping Policy', href: '/shipping/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Electric Bike Shipping Policy</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>{SITE.name} offers electric bike shipping across the United States, with worldwide shipping to Europe and beyond.</p>
          <h2>Processing</h2>
          <p>
            In-stock models are prepared for dispatch promptly after your order is confirmed. Premium or made-to-order machines may require
            additional lead time; we confirm timing when your order is placed.
          </p>
          <h2>Rates</h2>
          <p>
            Free shipping applies on orders over {fmtPrice(SITE.freeShipThreshold)}. A flat {fmtPrice(SITE.flatShip)} shipping fee applies to
            orders below that threshold. Minimum order is {fmtPrice(SITE.minOrder)}.
          </p>
          <h2>Delivery</h2>
          <p>
            Delivery timeframes vary by model, configuration and destination. Larger machines ship freight and may require a delivery
            appointment. International orders may be subject to import duties and taxes payable by the recipient.
          </p>
          <h2>Tracking</h2>
          <p>
            Once dispatched, we provide tracking details by email. You can also request an update any time via our{' '}
            <a href="/tracking/">tracking page</a>, by emailing {SITE.email}, or on WhatsApp.
          </p>
        </div>
      </section>
    </>
  );
}
