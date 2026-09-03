'use client';
import { useState } from 'react';
import { SITE } from '@/config/site';

export default function ReservationCalculator() {
  const [price, setPrice] = useState('');
  const [crypto, setCrypto] = useState(false);

  const gross = price ? Number(price) : 0;
  const discount = crypto ? gross * (SITE.cryptoDiscountPct / 100) : 0;
  const net = gross - discount;
  const deposit = net * (SITE.reservationDepositPct / 100);
  const remaining = net - deposit;

  function fmt(n) {
    return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }

  return (
    <div className="calc">
      <div className="form-group">
        <label htmlFor="res-price">Bike price (USD)</label>
        <input
          type="number"
          id="res-price"
          placeholder="e.g. 5500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
        />
      </div>
      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <input type="checkbox" id="res-crypto" checked={crypto} onChange={(e) => setCrypto(e.target.checked)} style={{ width: 'auto' }} />
        <label htmlFor="res-crypto" style={{ margin: 0 }}>
          Paying with BTC or USDT ({SITE.cryptoDiscountPct}% discount)
        </label>
      </div>
      {gross > 0 && (
        <div className="out" style={{ display: 'grid' }}>
          <div>
            Bike price
            <b>{fmt(gross)}</b>
          </div>
          <div>
            Crypto discount
            <b>{discount > 0 ? `−${fmt(discount)}` : fmt(0)}</b>
          </div>
          <div>
            Holding deposit ({SITE.reservationDepositPct}%)
            <b>{fmt(deposit)}</b>
          </div>
          <div>
            Remaining balance
            <b>{fmt(remaining)}</b>
          </div>
        </div>
      )}
      <div className="warn" style={{ marginTop: '1.2rem' }}>
        Illustrative only. A {SITE.reservationDepositPct}% holding deposit reserves your bike while we confirm final configuration, stock
        and shipping; the remaining balance is due before your order ships. Our team confirms exact pricing and reservation terms by email
        before any deposit is charged.
      </div>
    </div>
  );
}
