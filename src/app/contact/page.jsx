import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from '@/components/ContactForm';
import { SITE, absUrl } from '@/config/site';

export const metadata = {
  title: 'Contact Us',
  description: `Questions about a model, financing or shipping? Contact ${SITE.name} and we'll reply within 24 hours.`,
  alternates: { canonical: absUrl('/contact/') },
};

export default function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }]} />
      <section className="form-section">
        <div className="container">
          <span className="eyebrow">Get in touch</span>
          <h1>Contact {SITE.name}</h1>
          <p className="lead">Questions about a model, financing or shipping? Fill out the form and we&apos;ll reply within 24 hours.</p>
          <ContactForm />
          <div className="contact-cards">
            <div className="card-soft">
              <h3>Email</h3>
              <p className="muted">
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
            </div>
            <div className="card-soft">
              <h3>WhatsApp</h3>
              <p className="muted">
                <a href={`https://wa.me/${SITE.whatsapp}`}>Message us →</a>
              </p>
            </div>
            <div className="card-soft">
              <h3>Location</h3>
              <p className="muted">
                {SITE.hqPlace}
                <br />
                Ships United States, Europe &amp; Worldwide
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
