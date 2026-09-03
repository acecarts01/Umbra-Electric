'use client';
import { useMemo } from 'react';
import WebForm from './WebForm';
import { useCart, clearCart } from '@/lib/cart';
import { SITE } from '@/config/site';

export default function OrderForm() {
  const cart = useCart();

  const cartSummary = useMemo(() => {
    if (!cart.length) return '';
    const sub = cart.reduce((a, i) => a + i.price * i.q, 0);
    const disc = Math.round((sub * SITE.cryptoDiscountPct) / 100);
    const ship = sub >= SITE.freeShipThreshold ? 0 : SITE.flatShip;
    return (
      cart.map((i) => `${i.q}x ${i.name} ($${i.price})`).join('\n') +
      `\nSubtotal: $${sub} | Crypto -$${disc} | Ship: ${ship ? '$' + ship : 'FREE'}`
    );
  }, [cart]);

  return (
    <WebForm
      subject="New Order — Umbra Electric"
      fromName="Umbra Electric Order System"
      thankYouUrl="/thank-you-order/"
      onSuccess={clearCart}
    >
      {({ replyEmail, setReplyEmail }) => (
        <>
          <h2 className="form-section-title">Your Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="o-name">Full Name *</label>
              <input id="o-name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="o-email">Email *</label>
              <input type="email" id="o-email" name="email" required value={replyEmail} onChange={(e) => setReplyEmail(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="o-phone">Phone *</label>
            <input type="tel" id="o-phone" name="phone" required />
          </div>
          <h2 className="form-section-title">Shipping Address</h2>
          <div className="form-group">
            <label htmlFor="o-address">Street Address *</label>
            <input id="o-address" name="address" required />
          </div>
          <div className="form-row three">
            <div className="form-group">
              <label htmlFor="o-city">City *</label>
              <input id="o-city" name="city" required />
            </div>
            <div className="form-group">
              <label htmlFor="o-state">State *</label>
              <input id="o-state" name="state" required />
            </div>
            <div className="form-group">
              <label htmlFor="o-zip">ZIP *</label>
              <input id="o-zip" name="zip" required />
            </div>
          </div>
          <h2 className="form-section-title">Order Details</h2>
          <div className="form-group">
            <label htmlFor="o-items">Products / Items *</label>
            <textarea
              id="o-items"
              name="order_items"
              required
              rows={4}
              defaultValue={cartSummary}
              placeholder="Your cart is attached automatically. Add any variant/color notes here."
            />
          </div>
          <input type="hidden" name="cart_contents" value={cartSummary} readOnly />
          <h2 className="form-section-title">Payment</h2>
          <div className="form-group">
            <label htmlFor="o-pay">Payment Method *</label>
            <select id="o-pay" name="payment_method" required defaultValue="">
              <option value="" disabled>
                Select...
              </option>
              <option>Crypto — BTC / USDT (10% discount)</option>
              <option>Bank Transfer</option>
              <option>Credit / Debit Card</option>
              <option>Apple Pay</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="o-notes">Special Instructions</label>
            <textarea id="o-notes" name="notes" rows={3} />
          </div>
        </>
      )}
    </WebForm>
  );
}
