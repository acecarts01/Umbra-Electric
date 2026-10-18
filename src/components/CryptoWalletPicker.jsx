'use client';
import { useState } from 'react';
import { SITE } from '@/config/site';

function slugFor(w) {
  return `${w.ticker}-${w.network}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CryptoWalletPicker() {
  const wallets = SITE.cryptoWallets || [];
  const [idx, setIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const w = wallets[idx];

  if (!wallets.length) return null;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(w.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable -- address is still selectable as text below
    }
  }

  return (
    <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
      <div className="admin-section-title" style={{ marginTop: 0 }}>Pay with Crypto</div>
      <div className="form-group">
        <label htmlFor="crypto-coin-select">Choose a coin</label>
        <select
          id="crypto-coin-select"
          value={idx}
          onChange={(e) => { setIdx(Number(e.target.value)); setCopied(false); }}
        >
          {wallets.map((opt, i) => (
            <option key={`${opt.ticker}-${opt.network}`} value={i}>
              {opt.coin} ({opt.ticker}) — {opt.network}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
        <img
          src={`/images/crypto/${slugFor(w)}.svg`}
          alt={`QR code for ${w.coin} (${w.ticker}) ${w.network} wallet address`}
          width={140}
          height={140}
          style={{ border: '1px solid var(--line)', borderRadius: 8, background: '#fff', padding: 8, flexShrink: 0 }}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <p className="muted" style={{ fontSize: '.8rem', margin: '0 0 .3rem' }}>{w.network} address</p>
          <code style={{ display: 'block', wordBreak: 'break-all', fontSize: '.85rem', background: 'var(--surface-2, rgba(127,127,127,.08))', padding: '.5rem .6rem', borderRadius: 6 }}>
            {w.address}
          </code>
          <button type="button" className="btn-secondary" style={{ marginTop: '.6rem', fontSize: '.85rem' }} onClick={copyAddress}>
            {copied ? 'Copied!' : 'Copy address'}
          </button>
        </div>
      </div>

      <p className="muted" style={{ fontSize: '.8rem', marginTop: '1rem' }}>
        Scan the QR code or copy the address above and send the exact amount due on this invoice. Don&apos;t see your
        preferred coin or network? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll provide it.
      </p>
    </div>
  );
}
