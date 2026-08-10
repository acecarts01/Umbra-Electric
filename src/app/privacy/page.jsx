import Breadcrumbs from '@/components/Breadcrumbs';
import { absUrl } from '@/config/site';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Umbra Electric privacy policy — what information we collect and how we use it.',
  alternates: { canonical: absUrl('/privacy/') },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/privacy/' }]} />
      <section className="phead">
        <div className="container">
          <span className="eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>This policy explains what information Umbra Electric collects and how we use it.</p>
          <h2>Information we collect</h2>
          <p>We collect information you provide when you contact us or place an order — such as name, email, phone, and shipping address — and basic technical data from your visit.</p>
          <h2>How we use it</h2>
          <p>We use your information to process orders, provide support, arrange shipping and respond to enquiries. We do not sell your personal information.</p>
          <h2>Third parties</h2>
          <p>We share information only as needed with service providers who help us operate — for example, form processing, payment and shipping partners — and as required by law.</p>
          <h2>Your choices &amp; California rights</h2>
          <p>
            You may request access to or deletion of your personal information. California residents have additional rights under the CCPA.
            Contact <a href="/contact/">us</a> to make a request.
          </p>
          <h2>Retention</h2>
          <p>We retain information as long as needed to provide our services and meet legal obligations.</p>
        </div>
      </section>
    </>
  );
}
