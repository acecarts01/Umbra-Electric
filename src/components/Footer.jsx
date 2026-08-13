import { SITE } from '@/config/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <a className="brand" href="/">
            <svg width="26" height="26" viewBox="0 0 32 32" role="img" aria-label={SITE.name}>
              <circle cx="16" cy="16" r="13.5" fill="none" stroke="#5B82D6" strokeWidth="2" />
              <path d="M18.5,4 L9,17.5 L14.2,17.5 L13,28 L23,14.5 L17.8,14.5 Z" fill="#5B82D6" />
            </svg>
            <span>{SITE.name.toUpperCase()}</span>
          </a>
          <p className="desc">
            {SITE.tagline} {SITE.name.split(' ')[0]} carries premium electric dirt bikes, e-motos and e-bikes for adults and kids — ruthlessly curated.
          </p>
          <p className="desc">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <br />
            {SITE.phone}
          </p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="/shop/adult-electric-dirt-bikes/">Adult Electric Dirt Bikes</a>
          <a href="/shop/kids-electric-dirt-bikes/">Kids &amp; Youth Electric Dirt Bikes</a>
          <a href="/shop/electric-mountain-bikes/">Electric Mountain Bikes</a>
          <a href="/shop/electric-commuter-bikes/">Electric Commuter &amp; Urban Bikes</a>
          <a href="/shop/electric-road-gravel-bikes/">Electric Road &amp; Gravel Bikes</a>
          <a href="/shop/electric-fat-tire-bikes/">Electric Fat Tire Bikes</a>
          <a href="/premium/">Premium / Collectors</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="/about/">About</a>
          <a href="/blog/">Blog &amp; Guides</a>
          <a href="/reviews/">Reviews</a>
          <a href="/wholesale/">Wholesale</a>
          <a href="/faq/">FAQ</a>
          <a href="/contact/">Contact</a>
          <a href="/compare/">Compare Tool</a>
          <a href="/tracking/">Track Order</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="/financing/">Financing</a>
          <a href="/finance-calculator/">Finance Calculator</a>
          <a href="/shipping/">Shipping</a>
          <a href="/refund/">Returns &amp; Refunds</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          &copy; {year} {SITE.name} · {SITE.domain} · All rights reserved.
        </span>
        <span className="disclaimer">
          Off-road vehicles are for private-land use and may not be street-legal without registration, insurance and licensing. Always wear
          safety gear and check local laws. Prices in USD; confirm current pricing and specifications before ordering.
        </span>
      </div>
    </footer>
  );
}
