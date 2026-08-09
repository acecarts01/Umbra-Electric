import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Application Received',
  alternates: { canonical: absUrl('/thank-you-wholesale/') },
  robots: { index: false, follow: true },
};

export default function ThankYouWholesalePage() {
  return (
    <section className="thankyou-section">
      <div className="container thankyou-container">
        <div className="thankyou-icon" aria-hidden="true">✓</div>
        <h1>Application Received</h1>
        <p>Thanks for applying for a {SITE.name} wholesale account. We review all applications within 48 hours and will follow up by email.</p>
        <div className="thankyou-actions">
          <a className="btn-primary" href="/shop/">Browse the collection</a>
          <a className="btn-secondary" href="/contact/">Contact us</a>
        </div>
      </div>
    </section>
  );
}
