'use client';
import { useEffect, useState } from 'react';

const SLIDES = [
  { text: 'Crypto payments save 10% at checkout', linkHref: '/financing/', linkText: 'Financing available →' },
  { text: 'Free shipping on orders over $2,000 · Ships United States, Europe & Worldwide' },
  { text: 'Minimum order $500 · Authorized premium dealer' },
  { text: 'Order by email', linkHref: '/order/', linkText: 'Place an order →', suffix: '· we confirm before payment' },
];

export default function Announce() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((prev) => (prev + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="announce" aria-label="Announcements">
      {SLIDES.map((s, idx) => (
        <span key={idx} className={`slide${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
          {s.text}
          {s.linkHref && (
            <>
              {' · '}
              <a href={s.linkHref}>{s.linkText}</a>
            </>
          )}
          {s.suffix ? ` ${s.suffix}` : ''}
        </span>
      ))}
    </div>
  );
}
