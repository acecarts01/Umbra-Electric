'use client';
import { useState } from 'react';

export default function FinanceCalculator() {
  const [price, setPrice] = useState('');
  const per = price ? Number(price) / 4 : 0;

  function fmt(n) {
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }

  return (
    <div className="calc">
      <div className="form-group">
        <label htmlFor="fin-price">Bike price (USD)</label>
        <input type="number" id="fin-price" placeholder="e.g. 5500" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      {price && Number(price) > 0 && (
        <div className="out" style={{ display: 'grid' }}>
          <div>
            Today
            <b>{fmt(per)}</b>
          </div>
          <div>
            Week 4
            <b>{fmt(per)}</b>
          </div>
          <div>
            Week 8
            <b>{fmt(per)}</b>
          </div>
          <div>
            Week 12
            <b>{fmt(per)}</b>
          </div>
        </div>
      )}
      <div className="warn" style={{ marginTop: '1.2rem' }}>
        Illustrative only. Pay-later splits a purchase into 4 equal, interest-free installments; the first is due at checkout. Subject to
        status and approval. Age 18+ required. Terms apply.
      </div>
    </div>
  );
}
