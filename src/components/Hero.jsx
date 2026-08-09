'use client';
import { useEffect, useState } from 'react';
import SmartImage from './SmartImage';
import { fmtPrice } from '@/config/site';

export default function Hero({ slides }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((prev) => (prev + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="hero">
      <div className="hero-in">
        {slides.map((s, idx) => (
          <div key={s.slug} style={{ display: idx === i ? 'contents' : 'none' }}>
            <div>
              <span className="eyebrow">{idx === 0 ? 'Silent Power. Refined.' : 'Featured'}</span>
              {idx === 0 ? <h1>{s.headline}</h1> : <div className="h1">{s.headline}</div>}
              <p className="hero-description">{s.description}</p>
              <div className="hero-cta">
                <a className="btn-primary" href="/shop/">
                  Shop the Collection
                </a>
                <a className="btn-secondary" href="/premium/">
                  Premium / Collectors
                </a>
              </div>
            </div>
            <div className="hero-frame">
              <span className="hero-tag">Premium</span>
              <SmartImage src={s.image} alt={`${s.headline} — premium electric dirt bike — Umbra Electric`} width={600} height={600} priority={idx === 0} />
              <div className="cap">
                <span>
                  {s.brand} · {s.headline}
                </span>
                <b>{fmtPrice(s.price)}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((s, idx) => (
          <button key={s.slug} type="button" className={idx === i ? 'on' : ''} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} />
        ))}
      </div>
    </section>
  );
}
