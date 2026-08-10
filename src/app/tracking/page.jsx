import Breadcrumbs from '@/components/Breadcrumbs';
import TrackingTool from '@/components/TrackingTool';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Track Your Order',
  description: "Enter your order number and we'll pull up its status. For the fastest update, message us on WhatsApp.",
  alternates: { canonical: absUrl('/tracking/') },
  robots: { index: false, follow: true },
};

export default function TrackingPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Track Order', href: '/tracking/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Support</span>
          <h1>Track Your Order</h1>
          <p className="lead">Enter your order number and we&apos;ll pull up its status. For the fastest update, message us on WhatsApp.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 620 }}>
          <TrackingTool />
        </div>
      </section>
    </>
  );
}
