'use client';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, showSort = true, searchQuery = '' }) {
  const [sort, setSort] = useState('pop');

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

  return (
    <div>
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
        {sorted.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {sorted.length === 0 && <p className="muted">No models match your search.</p>}
    </div>
  );
}
