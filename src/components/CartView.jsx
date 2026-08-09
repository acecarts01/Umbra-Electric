'use client';
import { useMemo } from 'react';
import SmartImage from './SmartImage';
import { useCart, incItem, decItem, removeItem } from '@/lib/cart';
import { SITE, fmtPrice } from '@/config/site';

export default function CartView() {
  const cart = useCart();

  const totals = useMemo(() => {
    const sub = cart.reduce((a, i) => a + i.price * i.q, 0);
    const disc = Math.round((sub * SITE.cryptoDiscountPct) / 100);
    const ship = sub >= SITE.freeShipThreshold ? 0 : SITE.flatShip;
    return { sub, disc, ship, total: sub - disc + ship };
  }, [cart]);

  const waMessage = `Hi ${SITE.name}, I would like to order:\n${cart.map((i) => `${i.q}x ${i.name}`).join('\n')}\nTotal approx $${totals.total}`;

  return (
    <div className="shop-wrap">
      <div>
        {!cart.length ? (
          <p className="muted">
            Your cart is empty. <a href="/shop/">Browse the collection →</a>
          </p>
        ) : (
          cart.map((item) => (
            <div className="cart-row" key={item.slug}>
              <div className="thumb">
                <SmartImage src={`${item.slug}.webp`} alt={item.name} fill sizes="80px" />
              </div>
              <div>
                <strong>{item.name}</strong>
              </div>
              <div className="qty">
                <button type="button" aria-label="Decrease" onClick={() => decItem(item.slug)}>
                  -
                </button>
                <span>{item.q}</span>
                <button type="button" aria-label="Increase" onClick={() => incItem(item.slug)}>
                  +
                </button>
              </div>
              <div>{fmtPrice(item.price * item.q)}</div>
              <button className="icon-btn" aria-label="Remove" type="button" onClick={() => removeItem(item.slug)}>
                ×
              </button>
            </div>
          ))
        )}
        {cart.length > 0 && totals.sub < SITE.minOrder && (
          <div className="warn" style={{ marginTop: '1rem' }}>
            Minimum order is {fmtPrice(SITE.minOrder)}. Add more to check out.
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <aside className="cart-summary">
          <h3 style={{ marginTop: 0 }}>Summary</h3>
          <div className="line">
            <span>Subtotal</span>
            <span>{fmtPrice(totals.sub)}</span>
          </div>
          <div className="line">
            <span>Crypto discount</span>
            <span>
              -{fmtPrice(totals.disc)} (crypto {SITE.cryptoDiscountPct}%)
            </span>
          </div>
          <div className="line">
            <span>Shipping</span>
            <span>{totals.ship ? fmtPrice(totals.ship) : 'FREE'}</span>
          </div>
          <div className="line total">
            <span>Total</span>
            <span>{fmtPrice(totals.total)}</span>
          </div>
          <a className="btn-primary btn-block" href="/order/" style={{ marginTop: '1rem' }}>
            Complete Order by Email
          </a>
          <a
            className="btn-secondary btn-block"
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage)}`}
            target="_blank"
            rel="noopener"
            style={{ marginTop: '.6rem' }}
          >
            Or order via WhatsApp
          </a>
          <p className="muted" style={{ fontSize: '.8rem', marginTop: '1rem' }}>
            Email ordering is our primary method — we confirm everything before payment. Crypto payments save {SITE.cryptoDiscountPct}%. Free
            shipping over {fmtPrice(SITE.freeShipThreshold)}.
          </p>
        </aside>
      )}
    </div>
  );
}
