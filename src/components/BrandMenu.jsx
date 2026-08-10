'use client';
import { useEffect, useRef, useState } from 'react';
import { BRANDS } from '@/config/site';

export default function BrandMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="brand-dropdown" ref={ref}>
      <button
        type="button"
        className="brand-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        Shop by Brand <span className={`caret${open ? ' up' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="brand-dropdown-panel" role="menu">
          {BRANDS.map((b) => (
            <a key={b.slug} className="brand-pill" href={`/shop/brand/${b.slug}/`} role="menuitem" onClick={() => setOpen(false)}>
              {b.name} <span className="brand-count">{b.count}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
