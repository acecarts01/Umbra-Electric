'use client';
import WebForm from './WebForm';

export default function WholesaleForm() {
  return (
    <WebForm subject="New Wholesale Application — Umbra Electric" fromName="Umbra Electric Wholesale" thankYouUrl="/thank-you-wholesale/">
      {({ replyEmail, setReplyEmail }) => (
        <>
          <h2 className="form-section-title">Business Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="w-business">Business Name *</label>
              <input id="w-business" name="business_name" required />
            </div>
            <div className="form-group">
              <label htmlFor="w-type">Business Type *</label>
              <select id="w-type" name="business_type" required defaultValue="">
                <option value="" disabled>
                  Select...
                </option>
                <option>Retail Store</option>
                <option>Online Store</option>
                <option>Bike Shop</option>
                <option>Powersports Dealer</option>
                <option>Distributor</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <h2 className="form-section-title">Contact</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="w-name">Contact Name *</label>
              <input id="w-name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="w-email">Email *</label>
              <input type="email" id="w-email" name="email" required value={replyEmail} onChange={(e) => setReplyEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="w-phone">Phone *</label>
              <input type="tel" id="w-phone" name="phone" required />
            </div>
            <div className="form-group">
              <label htmlFor="w-location">City, State / Country *</label>
              <input id="w-location" name="location" required />
            </div>
          </div>
          <h2 className="form-section-title">Order Interest</h2>
          <div className="form-group">
            <label htmlFor="w-products">Products of Interest *</label>
            <textarea id="w-products" name="products_interest" required rows={3} />
          </div>
          <div className="form-group">
            <label htmlFor="w-volume">Estimated Monthly Volume *</label>
            <select id="w-volume" name="monthly_volume" required defaultValue="">
              <option value="" disabled>
                Select...
              </option>
              <option>Under $5,000</option>
              <option>$5,000 – $25,000</option>
              <option>$25,000 – $100,000</option>
              <option>$100,000+</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="w-message">Additional Info</label>
            <textarea id="w-message" name="message" rows={3} />
          </div>
        </>
      )}
    </WebForm>
  );
}
