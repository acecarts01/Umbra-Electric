'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const AUTOPLAY_MS = 5500;

export default function ReviewCarousel({ reviews }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const dragState = useRef(null);
  const trackRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);

  const count = reviews.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const goTo = useCallback(
    (next) => {
      setIndex(((next % count) + count) % count);
      setProgressKey((k) => k + 1);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || reducedMotion) return undefined;
    const id = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, reducedMotion, goTo]);

  function onPointerDown(e) {
    dragState.current = { startX: e.clientX, dragging: true };
    setPaused(true);
    trackRef.current?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragState.current?.dragging) return;
    setDragOffset(e.clientX - dragState.current.startX);
  }
  function onPointerUp() {
    if (!dragState.current?.dragging) return;
    const threshold = 60;
    if (dragOffset > threshold) prev();
    else if (dragOffset < -threshold) next();
    dragState.current = null;
    setDragOffset(0);
    setPaused(false);
  }

  return (
    <div
      className="rcarousel"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
    >
      <button type="button" className="rcarousel-arrow prev" onClick={prev} aria-label="Previous review">
        ‹
      </button>

      <div
        className="rcarousel-viewport"
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="rcarousel-track"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragOffset}px))`,
            transition: dragState.current?.dragging ? 'none' : 'transform .5s cubic-bezier(.22,.61,.36,1)',
          }}
        >
          {reviews.map((r, i) => (
            // A plain div, not <article> -- ARIA-in-HTML's role mapping for
            // <article> doesn't permit overriding its strong native semantics
            // with role="group" (PageSpeed's Agentic Browsing audit flags
            // this specific combination as "ARIA role should be appropriate
            // for the element"). role="group" + aria-roledescription="slide"
            // is still the correct WAI-ARIA Carousel Slide pattern -- div has
            // no native role of its own, so it's a valid host for it.
            <div className="rcarousel-slide" key={r.id} aria-hidden={i !== index} role="group" aria-roledescription="slide">
              <div className="review-stars" aria-label={`${r.rating} out of 5 stars`}>
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)}
              </div>
              <h3>{r.title}</h3>
              <p className="review-text">&ldquo;{r.text}&rdquo;</p>
              <div className="review-meta">
                <span className="review-name">{r.name}</span> — {r.state} · <time dateTime={r.date}>{r.dateDisplay}</time>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="rcarousel-arrow next" onClick={next} aria-label="Next review">
        ›
      </button>

      <div className="rcarousel-foot">
        <div className="rcarousel-progress">
          {!reducedMotion && !paused && <div key={progressKey} className="bar" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
        </div>
        <span className="rcarousel-count" aria-live="polite">
          {index + 1} / {count}
        </span>
      </div>
    </div>
  );
}
