import Breadcrumbs from '@/components/Breadcrumbs';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Returns & Refunds',
  description: 'Umbra Electric returns and refunds policy.',
  alternates: { canonical: absUrl('/refund/') },
};

export default function RefundPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Returns & Refunds' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Returns &amp; Refunds</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>We want you to be confident in your purchase. If something isn&apos;t right, here&apos;s how returns work.</p>
          <h2>Return window</h2>
          <p>Unused, undamaged items in original packaging may be returned within 14 days of delivery. Contact us first to initiate a return and receive instructions.</p>
          <h2>Condition</h2>
          <p>Items must be in original, resalable condition. Bikes that have been registered, ridden, modified or damaged may not be eligible for return. Original packaging and included accessories are required.</p>
          <h2>Refund timeline</h2>
          <p>Approved refunds are processed to the original payment method after we receive and inspect the returned item. Timing depends on your payment provider.</p>
          <h2>Non-returnable items</h2>
          <p>
            Custom or made-to-order configurations, registered vehicles, and certain parts may be non-returnable. Return shipping costs may
            apply. Contact <a href="/contact/">our team</a> with any questions.
          </p>
        </div>
      </section>
    </>
  );
}
