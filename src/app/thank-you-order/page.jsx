import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Order Received',
  alternates: { canonical: absUrl('/thank-you-order/') },
  robots: { index: false, follow: true },
};

export default function ThankYouOrderPage() {
  return (
    <section className="thankyou-section">
      <div className="container thankyou-container">
        <div className="thankyou-icon" aria-hidden="true">✓</div>
        <h1>Order Received</h1>
        <p>Thanks for your order at {SITE.name}. We&apos;ll confirm stock, final pricing and shipping by email — usually within a few hours.</p>
        <p>No payment has been taken. We&apos;ll follow up with next steps before anything is charged.</p>
        <div className="thankyou-actions">
          <a className="btn-primary" href="/shop/">Continue shopping</a>
          <a className="btn-secondary" href="/contact/">Contact us</a>
        </div>
      </div>
    </section>
  );
}
