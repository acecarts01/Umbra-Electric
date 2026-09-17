import { SITE } from '@/config/site';

function formatRegDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const ROWS = [
  ['Legal Entity Name', SITE.legalEntityName],
  ['Trading As', SITE.legalTradingAs],
  ['State of Formation', SITE.legalState],
  ['Texas Taxpayer Number', SITE.taxpayerNumber],
  ['Texas SOS File Number', SITE.sosFileNumber],
  ['Right to Transact Business', SITE.entityStatus],
  ['SOS Registration Status', SITE.entityStatus],
  ['Effective Registration Date', formatRegDate(SITE.registrationDate)],
  ['Registered Office', SITE.legalAddress],
  ['Governing Regulator', 'Texas Secretary of State / Comptroller of Public Accounts'],
];

export default function BusinessVerification() {
  return (
    <div className="verify-section">
      <div className="verify-head">
        <div>
          <span className="eyebrow" style={{ color: '#9DB4EA' }}>Legally Registered &amp; Verified</span>
          <h2 style={{ color: 'var(--ivory)', marginTop: '.4rem' }}>Buy with certainty. We&apos;re on the public record.</h2>
        </div>
        <span className="verify-seal">✓ Active — State of Texas</span>
      </div>
      <p style={{ color: '#D8D1C4', maxWidth: '68ch', marginBottom: '1.8rem' }}>
        {SITE.name} is operated by <strong style={{ color: 'var(--ivory)' }}>{SITE.legalEntityName}</strong>, a Texas corporation registered
        and in continuous active standing since {formatRegDate(SITE.registrationDate)} — {new Date().getFullYear() - new Date(SITE.registrationDate).getFullYear()}+
        years on the record with the Texas Secretary of State. Every detail below is drawn directly from that public filing, so you can confirm
        exactly who you&apos;re buying from before you ever send payment — no anonymous storefront, no shell company, no guesswork.
      </p>
      <div className="verify-grid">
        {ROWS.map(([label, value]) => (
          <div className="verify-row" key={label}>
            <span className="verify-label">{label}</span>
            <span className="verify-value">{value}</span>
          </div>
        ))}
      </div>
      <div className="verify-foot">
        <p>
          These records are independently verifiable at any time — search Taxpayer Number {SITE.taxpayerNumber} directly on the Texas
          Comptroller&apos;s public Franchise Tax Account Status search.
        </p>
        <a className="btn-primary" href={SITE.verifyUrl} target="_blank" rel="noopener noreferrer">
          Verify This Record ↗
        </a>
      </div>
    </div>
  );
}
