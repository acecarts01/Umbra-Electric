'use client';
import { useState } from 'react';
import { addToCart, readCart } from '@/lib/cart';

export default function ProductBuyRow({ slug, name, price }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(slug, name, price, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    window.dispatchEvent(new Event('umbra-cart-open'));
  }

  // "Order by Email" is the primary checkout path, so it must guarantee this
  // product is actually in the cart before the order form loads -- otherwise
  // a buyer who clicks straight through without hitting "Add to Cart" first
  // lands on /order/ with an empty cart, and the order email we receive has
  // no item in it at all.
  function handleOrderByEmail() {
    if (!readCart().some((i) => i.slug === slug)) {
      addToCart(slug, name, price, qty);
    }
    window.location.href = '/order/';
  }

  return (
    <>
      <div className="buyrow">
        <div className="qty">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            -
          </button>
          <span>{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
            +
          </button>
        </div>
        <button className="btn-primary" type="button" onClick={handleAdd}>
          {added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
      <button className="btn-secondary btn-block" type="button" onClick={handleOrderByEmail} style={{ marginBottom: '.6rem' }}>
        Order by Email
      </button>
    </>
  );
}
