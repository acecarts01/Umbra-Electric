'use client';
import { useState } from 'react';

export default function FaqAccordion({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div className="acc-list">
      {faqs.map((f, i) => (
        <div key={i} className={`acc${openIdx === i ? ' on' : ''}`}>
          <h3>
            <button type="button" aria-expanded={openIdx === i} onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {f.q}
              <span className="pm" aria-hidden="true">
                {openIdx === i ? '−' : '+'}
              </span>
            </button>
          </h3>
          <div className="ans">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
