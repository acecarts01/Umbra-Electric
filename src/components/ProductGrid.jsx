'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from './ProductCard';

const PAGE_SIZE = 10;

export default function ProductGrid({ products, showSort = true, searchQuery = '' }) {
  const [sort, setSort] = useState('pop');
  const [page, setPage] = useState(1);
  const topRef = useRef(null);

  const sorted = useMemo(() => {
    let list = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => (p.name + ' ' + p.brand).toLowerCase().includes(q));
    }
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    else if (sort === 'high') list.sort((a, b) => b.price - a.price);
    else if (sort === 'new') list.sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0));
    else list.sort((a, b) => (b.badge === 'Popular' ? 1 : 0) - (a.badge === 'Popular' ? 1 : 0));
    return list;
  }, [products, sort, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [sort, searchQuery, products]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function goToPage(n) {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div>
      <div ref={topRef} />
      {showSort && (
        <div className="shop-top">
          <p className="muted" id="shop-search-note">
            {searchQuery ? `Showing results for "${searchQuery}"` : `${sorted.length} models`}
          </p>
          <select id="sortsel" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="pop">Most popular</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="new">Newest</option>
          </select>
        </div>
      )}
      <div className="prod-grid">
        {pageItems.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {sorted.length === 0 && <p className="muted">No models match your search.</p>}
      {pageCount > 1 && (
        <nav className="pagination" aria-label="Product pages">
          <button type="button" className="btn-ghost" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
            ← Prev
          </button>
          <div className="pagination-pages">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`pagination-page${n === safePage ? ' on' : ''}`}
                aria-current={n === safePage ? 'page' : undefined}
                onClick={() => goToPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost" disabled={safePage === pageCount} onClick={() => goToPage(safePage + 1)}>
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
