'use client';
import { useState } from 'react';
import SmartImage from './SmartImage';

export default function Gallery({ images, name }) {
  const [active, setActive] = useState(0);

  return (
    <div className="gallery">
      <div className="main">
        <SmartImage src={images[active]} alt={`${name} — view ${active + 1}`} fill priority sizes="(max-width: 760px) 90vw, 500px" />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              className={i === active ? 'on' : ''}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              aria-pressed={i === active}
            >
              <SmartImage src={img} alt={`${name} thumbnail ${i + 1}`} fill sizes="74px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
