import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Message Received',
  alternates: { canonical: absUrl('/thank-you-contact/') },
  robots: { index: false, follow: true },
};

export default function ThankYouContactPage() {
  return (
    <section className="thankyou-section">
      <div className="container thankyou-container">
        <div className="thankyou-icon" aria-hidden="true">✓</div>
        <h1>Message Received</h1>
        <p>Thanks for reaching out to {SITE.name}. We&apos;ve received your message and will get back to you within 24 hours.</p>
        <p>In the meantime, browse the collection or check our FAQ for quick answers.</p>
        <div className="thankyou-actions">
          <a className="btn-primary" href="/shop/">Continue shopping</a>
          <a className="btn-secondary" href="/contact/">Contact us</a>
        </div>
      </div>
    </section>
  );
}
