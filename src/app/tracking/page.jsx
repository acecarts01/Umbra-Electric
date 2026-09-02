import Breadcrumbs from '@/components/Breadcrumbs';
import TrackingTool from '@/components/TrackingTool';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Track Your Order',
  description: "Enter your order number and email us for a status update — WhatsApp is there too.",
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
          <p className="lead">Enter your order number and email us for a status update — WhatsApp is there too.</p>
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
