import { SITE } from '@/config/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <a className="brand" href="/">
            <svg width="26" height="26" viewBox="0 0 32 32" role="img" aria-label={SITE.name}>
              <defs>
                <mask id="umbra-eclipse-footer">
                  <rect width="32" height="32" fill="#fff" />
                  <circle cx="20.5" cy="12.5" r="10" fill="#000" />
                </mask>
              </defs>
              <circle cx="15" cy="16" r="11.5" fill="#A9793F" mask="url(#umbra-eclipse-footer)" />
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
