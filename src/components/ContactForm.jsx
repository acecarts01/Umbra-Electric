'use client';
import WebForm from './WebForm';

export default function ContactForm() {
  return (
    <WebForm subject="New Contact Message — Umbra Electric" fromName="Umbra Electric Website" thankYouUrl="/thank-you-contact/">
      {({ replyEmail, setReplyEmail }) => (
        <>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="c-name">Full Name *</label>
              <input id="c-name" name="name" required placeholder="Your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="c-email">Email Address *</label>
              <input
                type="email"
                id="c-email"
                name="email"
                required
                placeholder="Your email address"
                value={replyEmail}
                onChange={(e) => setReplyEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="c-phone">Phone</label>
              <input type="tel" id="c-phone" name="phone" placeholder="+1 (555) 000-0000" />
            </div>
            <div className="form-group">
              <label htmlFor="c-subject">Subject *</label>
              <select id="c-subject" name="subject_type" required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                <option>Order Enquiry</option>
                <option>Product Question</option>
                <option>Shipping Question</option>
                <option>Returns &amp; Refunds</option>
                <option>Wholesale Enquiry</option>
                <option>Financing</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="c-message">Message *</label>
            <textarea id="c-message" name="message" required rows={6} placeholder="How can we help?" />
          </div>
        </>
      )}
    </WebForm>
  );
}
