'use client';
import { useRef, useState } from 'react';
import SmartImage from './SmartImage';
import { addToCart } from '@/lib/cart';
import { fmtPrice } from '@/config/site';

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const dialogRef = useRef(null);

  function handleAdd() {
    addToCart(product.slug, product.name, product.price, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    window.dispatchEvent(new Event('umbra-cart-open'));
  }

  return (
    <div className="pcard" data-cat={product.category} data-price={product.price} data-name={product.name} data-brand={product.brand}>
      <div className="imgwrap">
        {product.badge && <span className={`badge ${product.badge.replace(' ', '')}`}>{product.badge}</span>}
        <button className="qv" type="button" onClick={() => dialogRef.current?.showModal()}>
          Quick View
        </button>
        <a href={`/product/${product.slug}/`}>
          <SmartImage src={product.images[0]} alt={`${product.name} — ${product.brand} — Umbra Electric`} fill sizes="(max-width: 600px) 45vw, 260px" />
        </a>
      </div>
      <div className="body">
        <span className="brandtag">{product.brand}</span>
        <h3>
          <a href={`/product/${product.slug}/`}>{product.name}</a>
        </h3>
        <div className="price">{fmtPrice(product.price)}</div>
        <div className="actions">
          <div className="qty">
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <button className={`btn-primary${added ? ' added-pop' : ''}`} type="button" onClick={handleAdd}>
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
        </div>
      </div>
      <dialog ref={dialogRef} className="qv-dialog" aria-label={`Quick view — ${product.name}`}>
        <div style={{ background: 'var(--paper)', borderRadius: 'var(--r)', maxWidth: 640, padding: '1.6rem', position: 'relative' }}>
          <button
            className="icon-btn"
            aria-label="Close"
            type="button"
            style={{ position: 'absolute', top: '.8rem', right: '.8rem' }}
            onClick={() => dialogRef.current?.close()}
          >
            ×
          </button>
          <div className="split">
            <div style={{ background: '#f6f4ef', borderRadius: 'var(--r-sm)', padding: '1rem', position: 'relative', aspectRatio: '1/1' }}>
              <SmartImage src={product.images[0]} alt={product.name} fill />
            </div>
            <div>
              <span className="brandtag">{product.brand}</span>
              <h2>{product.name}</h2>
              <div className="price" style={{ fontFamily: 'var(--font-fraunces),serif', fontSize: '1.6rem', color: 'var(--bronze-d)' }}>
                {fmtPrice(product.price)}
              </div>
              <p className="muted">{product.description}</p>
              <div className="buyrow">
                <button className={`btn-primary${added ? ' added-pop' : ''}`} type="button" onClick={handleAdd}>
                  {added ? 'Added ✓' : 'Add to Cart'}
                </button>
                <a className="btn-secondary" href={`/product/${product.slug}/`}>
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
