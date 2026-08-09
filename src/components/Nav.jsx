'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE, CATEGORIES } from '@/config/site';
import { useCartCount } from '@/lib/cart';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const count = useCartCount();
  const router = useRouter();

  function onSearch(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/shop/?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="nav">
      <div className="nav-in">
        <a className="brand" href="/">
          <svg width="26" height="26" viewBox="0 0 32 32" role="img" aria-label={SITE.name}>
            <defs>
              <mask id="umbra-eclipse-nav">
                <rect width="32" height="32" fill="#fff" />
                <circle cx="20.5" cy="12.5" r="10" fill="#000" />
              </mask>
            </defs>
            <circle cx="15" cy="16" r="11.5" fill="#A9793F" mask="url(#umbra-eclipse-nav)" />
          </svg>
          <span>{SITE.name.toUpperCase()}</span>
        </a>
        <nav className={`nav-links${menuOpen ? ' open' : ''}`} aria-label="Primary">
          <a href="/">Home</a>
          <div className="has-mega">
            <a href="/shop/">Shop ▾</a>
            <div className="mega">
              {CATEGORIES.map((c) => (
                <a key={c.slug} href={`/shop/${c.slug}/`}>
                  {c.title}
                </a>
              ))}
            </div>
          </div>
          <a href="/premium/">Premium</a>
          <a href="/financing/">Finance</a>
          <a href="/about/">About</a>
          <a href="/blog/">Blog</a>
          <a href="/contact/">Contact</a>
        </nav>
        <div className="nav-actions">
          <button className="icon-btn search-toggle" aria-label="Search" onClick={() => setSearchOpen((v) => !v)} type="button">
            🔍
          </button>
          <a className="icon-btn" href="/cart/" aria-label="Cart">
            🛒<span className="cart-count" style={{ display: count ? 'flex' : 'none' }}>{count}</span>
          </a>
          <button className="icon-btn hamburger" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)} type="button">
            ☰
          </button>
        </div>
      </div>
      <div className={`searchbar${searchOpen ? ' on' : ''}`}>
        <form onSubmit={onSearch}>
          <input
            type="search"
            name="q"
            placeholder="Search electric dirt bikes, e-bikes, brands..."
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn-primary" type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
