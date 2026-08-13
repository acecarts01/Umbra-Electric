'use client';
import { useEffect, useRef, useState } from 'react';
import { BRANDS } from '@/config/site';

export default function BrandMenu() {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [maxH, setMaxH] = useState(420);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Being an absolutely-positioned overlay, this panel covers whatever
    // sits below the trigger in normal flow regardless of how much
    // viewport space is technically left (e.g. the trust bar sits right
    // under "Shop by brand" on the homepage with no gap) -- so "is there
    // room in the viewport" isn't the right question. Prefer opening
    // upward whenever there's reasonably usable space above the sticky
    // nav; only fall back to downward when the trigger is too close to
    // the top of the viewport for that to work.
    function position() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const navEl = document.querySelector('.nav');
      const topBound = (navEl ? navEl.getBoundingClientRect().bottom : 0) + 8;
      const bottomMargin = 16;
      const spaceBelow = window.innerHeight - rect.bottom - bottomMargin;
      const spaceAbove = rect.top - topBound;
      const preferUp = spaceAbove >= 160;
      setOpenUp(preferUp);
      setMaxH(Math.max(180, Math.min(420, preferUp ? spaceAbove : spaceBelow)));
    }

    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open]);

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
        <div className={`brand-dropdown-panel${openUp ? ' up' : ''}`} role="menu" style={{ maxHeight: maxH }}>
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
