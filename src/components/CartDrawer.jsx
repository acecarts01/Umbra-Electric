'use client';
import { useEffect, useRef } from 'react';
import SmartImage from './SmartImage';
import { useCart, incItem, decItem, removeItem, clearCart } from '@/lib/cart';
import { fmtPrice } from '@/config/site';

// Sitewide cart popup -- mounted once in the root layout. Opens whenever any
// "Add to Cart" button fires the umbra-cart-open event (ProductBuyRow on the
// product page, ProductCard on every grid/quick-view), so a buyer always
// sees confirmation of what just happened and can act on it immediately
// (adjust quantity, remove an item, empty the cart, or go straight to
// checkout) without hunting for the cart page.
export default function CartDrawer() {
  const cart = useCart();
  const dialogRef = useRef(null);

  useEffect(() => {
    function open() {
      dialogRef.current?.showModal();
    }
    window.addEventListener('umbra-cart-open', open);
    return () => window.removeEventListener('umbra-cart-open', open);
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  function handleEmpty() {
    if (!cart.length) return;
    if (window.confirm('Empty your cart? This removes every item.')) clearCart();
  }

  const sub = cart.reduce((a, i) => a + i.price * i.q, 0);

  return (
    <dialog ref={dialogRef} className="cart-drawer" aria-label="Cart">
      <div className="cart-drawer-head">
        <h2>Your Cart</h2>
        <button className="icon-btn" aria-label="Close cart" type="button" onClick={close}>
          ×
        </button>
      </div>

      <div className="cart-drawer-body">
        {!cart.length ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div className="cart-drawer-row" key={item.slug}>
              <div className="thumb">
                <SmartImage src={`${item.slug}.webp`} alt={item.name} fill sizes="56px" />
              </div>
              <div className="info">
                <strong>{item.name}</strong>
                <span className="muted">{fmtPrice(item.price)}</span>
              </div>
              <div className="qty">
                <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => decItem(item.slug)}>
                  -
                </button>
                <span>{item.q}</span>
                <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => incItem(item.slug)}>
                  +
                </button>
              </div>
              <button className="icon-btn" aria-label={`Remove ${item.name}`} type="button" onClick={() => removeItem(item.slug)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {!!cart.length && (
        <div className="cart-drawer-foot">
          <div className="cart-summary-line">
            <span>Subtotal</span>
            <span>{fmtPrice(sub)}</span>
          </div>
          <a className="btn-primary btn-block" href="/order/" onClick={close}>
            Checkout by Email
          </a>
          <a className="btn-ghost btn-block" href="/cart/" onClick={close}>
            View full cart
          </a>
          <button className="btn-secondary btn-block" type="button" onClick={handleEmpty}>
            Empty Cart
          </button>
        </div>
      )}
    </dialog>
  );
}
