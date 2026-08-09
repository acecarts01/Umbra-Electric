import SmartImage from './SmartImage';
import { CATEGORIES, PRODUCTS } from '@/config/site';

export default function CategoryGrid() {
  return (
    <div className="cat-grid">
      {CATEGORIES.map((c) => {
        const count = PRODUCTS.filter((p) => p.category === c.slug).length;
        return (
          <a key={c.slug} className="cat-tile" href={`/shop/${c.slug}/`}>
            <div className="cimg">
              <SmartImage
                src={`/images/categories/${c.slug}.webp`}
                alt={`${c.title} — Umbra Electric`}
                fill
                fit="cover"
                sizes="(max-width: 600px) 45vw, 260px"
              />
            </div>
            <div className="cbody">
              <h3>{c.title}</h3>
              <p>{count} models</p>
              <span className="go">Explore →</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
