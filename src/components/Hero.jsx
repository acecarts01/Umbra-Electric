'use client';
import { useEffect, useState } from 'react';
import SmartImage from './SmartImage';

const SLIDES = [
  {
    image: '/images/hero/hero-1.webp',
    alt: 'Riders fist-bumping on their electric dirt bikes at a desert quarry — Umbra Electric',
    eyebrow: 'Silent Power. Refined.',
    headline: 'Premium Electric Dirt Bikes & E-Bikes',
    description:
      "Umbra Electric curates the world's finest electric dirt bikes, e-motos and e-bikes for adults and kids — flagship machines, expert guidance, worldwide shipping.",
  },
  {
    image: '/images/hero/hero-2.webp',
    alt: 'Rider commuting on a premium electric fat-tire bike along the coast — Umbra Electric',
    eyebrow: 'Every Ride',
    headline: 'Effortless Range, Everyday Riding',
    description:
      'From coastal commutes to weekend errands, our e-bike lineup is built for daily range, comfort and near-silent power.',
  },
  {
    image: '/images/hero/hero-3.webp',
    alt: 'Riders racing electric dirt bikes through mud on a competition track — Umbra Electric',
    eyebrow: 'Adrenaline',
    headline: 'Race-Bred Power',
    description:
      'Built for the track and the trail — instant torque, precise handling and the aftermarket depth serious riders demand.',
  },
  {
    image: '/images/hero/hero-4.webp',
    alt: 'Young rider cornering a youth electric dirt bike on a dirt track — Umbra Electric',
    eyebrow: 'Ruthless Curation',
    headline: 'Only Bikes Worth Owning',
    description:
      "128 curated models across 8 categories from the brands that define the category. If we wouldn't ride it, we don't carry it.",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((prev) => (prev + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      {SLIDES.map((s, idx) => (
        <div key={s.image} className={`hero-bg${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
          <SmartImage src={s.image} alt={s.alt} fill fit="cover" priority={idx === 0} sizes="100vw" />
        </div>
      ))}
      <div className="hero-scrim" />
      <div className="hero-in">
        {SLIDES.map((s, idx) => (
          <div key={s.headline} className="hero-content" style={{ display: idx === i ? 'block' : 'none' }}>
            <span className="eyebrow">{s.eyebrow}</span>
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
        ))}
      </div>
      <div className="hero-dots">
        {SLIDES.map((s, idx) => (
          <button key={s.image} type="button" className={idx === i ? 'on' : ''} aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} />
        ))}
      </div>
    </section>
  );
}
