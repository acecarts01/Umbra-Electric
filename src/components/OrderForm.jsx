'use client';
import { useMemo, useState } from 'react';
import { useCart, clearCart } from '@/lib/cart';
import { SITE, fmtPrice } from '@/config/site';

export default function OrderForm() {
  const cart = useCart();
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('');
  const [orderType, setOrderType] = useState('full');
  const [paymentMethod, setPaymentMethod] = useState('crypto');

  const cartTotal = useMemo(() => cart.reduce((a, i) => a + i.price * i.q, 0), [cart]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cart.length) {
      setStatus('error');
      setErrorMsg('Your cart is empty — add a product before ordering.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      address: fd.get('address'),
      city: fd.get('city'),
      state: fd.get('state'),
      zip: fd.get('zip'),
      items: cart.map((i) => ({ slug: i.slug, qty: i.q })),
      paymentMethod,
      orderType,
      notes: fd.get('notes'),
    };

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Something went wrong.');
      clearCart();
      window.location.href = `/thank-you-order/?ref=${encodeURIComponent(data.ref)}`;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again or email us.');
    }
  }

  return (
    <form className="web-form" noValidate onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
      <h2 className="form-section-title">Your Details</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="o-name">Full Name *</label>
          <input id="o-name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="o-email">Email *</label>
          <input type="email" id="o-email" name="email" required />
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

      <h2 className="form-section-title">Your Cart</h2>
      {!cart.length ? (
        <p className="muted">
          Your cart is empty. <a href="/shop/">Browse the collection →</a>
        </p>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          {cart.map((i) => (
            <div key={i.slug} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.92rem', padding: '.3rem 0' }}>
              <span>{i.q}x {i.name}</span>
              <span>{fmtPrice(i.price * i.q)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: '.5rem', marginTop: '.3rem' }}>
            <span>Subtotal</span>
            <span>{fmtPrice(cartTotal)}</span>
          </div>
        </div>
      )}

      <h2 className="form-section-title">Payment</h2>
      <div className="form-group">
        <label htmlFor="o-order-type">Order Type *</label>
        <select id="o-order-type" name="order_type" required value={orderType} onChange={(e) => setOrderType(e.target.value)}>
          <option value="full">Full payment</option>
          <option value="deposit">Reserve with a {SITE.reservationDepositPct}% deposit — balance due before shipping</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="o-pay">Preferred Payment Method *</label>
        <select id="o-pay" name="payment_method" required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="crypto">Crypto — BTC / USDT ({SITE.cryptoDiscountPct}% discount)</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="o-notes">Special Instructions</label>
        <textarea id="o-notes" name="notes" rows={3} />
      </div>

      <p className="buyrow-note" style={{ marginBottom: '1rem' }}>
        No payment is taken here. We confirm stock, final pricing and shipping by email, then send an official tax invoice with payment instructions.
      </p>
      <button type="submit" className="btn-primary" disabled={status === 'sending'}>
        {status === 'sending' ? 'Submitting...' : 'Place Order'}
      </button>
      {status === 'error' && (
        <div className="form-error">
          {errorMsg} You can also email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message us on WhatsApp.
        </div>
      )}
    </form>
  );
}
