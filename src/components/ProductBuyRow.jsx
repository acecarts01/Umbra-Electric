'use client';
import { useState } from 'react';
import { addToCart } from '@/lib/cart';

export default function ProductBuyRow({ slug, name, price }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(slug, name, price, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
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
  );
}
