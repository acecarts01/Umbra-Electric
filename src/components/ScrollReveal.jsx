'use client';
import { useEffect } from 'react';

// Mounted once in the root layout. Targets common structural elements
// sitewide so individual pages never need to remember to opt in. Navigation
// uses real <a href> tags (full page loads), so this effect naturally
// re-runs on every page -- no client router event wiring needed.
//
// :not(:first-of-type) skips each page's first <section> (hero / phead /
// cat-banner) -- that's above-the-fold, often the LCP element, and must
// never be hidden behind a JS-gated opacity transition.
//
// :not(:has(.blog-grid)) -- the blog index renders all posts unpaginated
// (unlike .prod-grid, which paginates at 10/page), so this wrapping
// <section> grows to tens of thousands of px tall as posts are added.
// Giving a `transform` (even at rest) to an element that tall forces the
// browser to composite it as one GPU layer, which exceeds the GPU's max
// texture size and silently fails to paint the whole section -- the posts
// are in the DOM but invisible. Individual cards still fade in via `.bcard`
// below, so excluding the outer section here loses no visual effect.
const TARGETS = 'main > section:not(:first-of-type):not(:has(.blog-grid)), .pcard, .cat-tile, .bcard, .card-soft, .acc, .contact-cards > div';

export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(document.querySelectorAll(TARGETS));
    if (!els.length) return;

    els.forEach((el, i) => {
      el.classList.add('reveal');
      if (el.matches('.pcard, .cat-tile, .bcard, .card-soft')) {
        el.style.transitionDelay = `${Math.min(i % 8, 8) * 55}ms`;
      }
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
