'use client';
import { useEffect, useState } from 'react';
import SmartImage from './SmartImage';

// Each slide's stored image is a gentle 3:2 master crop (see
// scripts/process-hero-images.mjs) so the actual per-viewport crop is a
// SECOND, independent object-fit:cover crop done by the browser -- full
// width kept on wide desktop (only height trimmed), full height kept on
// narrow mobile (only width trimmed). posDesktop/posMobile were hand-tuned
// per photo by simulating both crops and checking the subject stays in
// frame (not just centered) -- default center clips heads/riders on several
// of these depending on where they actually sit in the frame.
const SLIDES = [
  {
    image: '/images/hero/hero-1.webp',
    alt: 'Rider standing with an off-road electric motorcycle beside a river, mountains in the background — Umbra Electric',
    eyebrow: 'Silent Power. Refined.',
    headline: 'Premium Electric Dirt Bikes & E-Bikes',
    description:
      "Umbra Electric curates the world's finest electric dirt bikes, e-motos and e-bikes for adults and kids — flagship machines, expert guidance, worldwide shipping.",
    posDesktop: '65% 50%',
    posMobile: '70% 50%',
  },
  {
    image: '/images/hero/hero-2.webp',
    alt: 'Rider fastening her helmet on a folding electric fat-tire bike in a suburban driveway — Umbra Electric',
    eyebrow: 'Every Ride',
    headline: 'Effortless Range, Everyday Riding',
    description:
      'From coastal commutes to weekend errands, our e-bike lineup is built for daily range, comfort and near-silent power.',
    posDesktop: '50% 15%',
    posMobile: '50% 20%',
  },
  {
    image: '/images/hero/hero-3.webp',
    alt: 'Riders cornering hard on electric dirt bikes through a motocross track — Umbra Electric',
    eyebrow: 'Adrenaline',
    headline: 'Race-Bred Power',
    description:
      'Built for the track and the trail — instant torque, precise handling and the aftermarket depth serious riders demand.',
    posDesktop: '35% 30%',
    posMobile: '35% 50%',
  },
  {
    image: '/images/hero/hero-4.webp',
    alt: 'Two riders cruising side by side on electric bikes along a tree-lined street — Umbra Electric',
    eyebrow: 'Every Terrain',
    headline: 'Built For The Long Ride',
    description:
      'Lightweight electric road and gravel bikes for endurance, speed and long-distance riding — chosen for ride feel, not just spec sheets.',
    posDesktop: '50% 65%',
    posMobile: '50% 70%',
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
        <div
          key={s.image}
          className={`hero-bg${idx === i ? ' on' : ''}`}
          aria-hidden={idx !== i}
          style={{ '--pos-d': s.posDesktop, '--pos-m': s.posMobile }}
        >
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
