'use client';
import { useState } from 'react';
import { SITE } from '@/config/site';

export default function TrackingTool() {
  const [orderNo, setOrderNo] = useState('');
  const msg = `Hi ${SITE.name}, please share the status of my order ${orderNo}`;

  return (
    <div className="calc">
      <div className="form-group">
        <label htmlFor="trk">Order Number</label>
        <input id="trk" placeholder="e.g. UE-10234" value={orderNo} onChange={(e) => setOrderNo(e.target.value)} />
      </div>
      <a
        className="btn-primary btn-block"
        href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`}
        target="_blank"
        rel="noopener"
      >
        Check status on WhatsApp
      </a>
      <p className="muted" style={{ marginTop: '1rem', fontSize: '.9rem' }}>
        Prefer email? Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with your order number and we&apos;ll reply with tracking.
      </p>
    </div>
  );
}
