import SmartImage from './SmartImage';
import { CATEGORIES, PRODUCTS } from '@/config/site';

const HERO_IMAGE_OVERRIDES = {
  'adult-electric-dirt-bikes': 'sur-ron-storm-bee.webp',
  'kids-electric-dirt-bikes': 'ktm-sx-e-5-ages-4-10.webp',
  'electric-mountain-bikes': 'santa-cruz-heckler-sl-cc-x0-axs.webp',
  'electric-commuter-bikes': 'aventon-level-3.webp',
  'electric-road-gravel-bikes': 'specialized-turbo-creo-sl-expert-evo.webp',
  'electric-fat-tire-bikes': 'aventon-aventure-2-fat-tire.webp',
  'kids-electric-bikes': 'woom-up-5-ages-7-11-24.webp',
  'folding-electric-bikes': 'lectric-xp-3-0.webp',
};

export default function CategoryGrid() {
  return (
    <div className="cat-grid">
      {CATEGORIES.map((c) => {
        const count = PRODUCTS.filter((p) => p.category === c.slug).length;
        const img = HERO_IMAGE_OVERRIDES[c.slug] || PRODUCTS.find((p) => p.category === c.slug)?.images[0];
        return (
          <a key={c.slug} className="cat-tile" href={`/shop/${c.slug}/`}>
            <div className="cimg">
              <SmartImage src={img} alt={`${c.title} — Umbra Electric`} fill sizes="(max-width: 600px) 45vw, 260px" />
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
