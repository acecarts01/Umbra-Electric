import { BRANDS } from '@/config/site';

export default function BrandMenu({ compact = false }) {
  return (
    <div className={`brand-menu${compact ? ' brand-menu-compact' : ''}`}>
      {BRANDS.map((b) => (
        <a key={b.slug} className="brand-pill" href={`/shop/brand/${b.slug}/`}>
          {b.name} <span className="brand-count">{b.count}</span>
        </a>
      ))}
    </div>
  );
}
