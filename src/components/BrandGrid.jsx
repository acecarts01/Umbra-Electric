import SmartImage from './SmartImage';
import { BRANDS, PRODUCTS } from '@/config/site';

export default function BrandGrid() {
  return (
    <div className="cat-grid">
      {BRANDS.map((b) => {
        const repProduct = PRODUCTS.find((p) => p.brand === b.name);
        return (
          <a key={b.slug} className="cat-tile" href={`/shop/brand/${b.slug}/`}>
            <div className="cimg">
              {repProduct && (
                <SmartImage
                  src={`/images/products/${repProduct.images[0]}`}
                  alt={`${b.name} electric bikes — Umbra Electric`}
                  fill
                  fit="cover"
                  sizes="(max-width: 600px) 45vw, 260px"
                />
              )}
            </div>
            <div className="cbody">
              <h3>{b.name}</h3>
              <p>
                {b.count} {b.count === 1 ? 'model' : 'models'}
              </p>
              <span className="go">Explore →</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
