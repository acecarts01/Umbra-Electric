import { SITE } from '@/config/site';

// Persistent (never rotates, unlike Announce) so the registration fact is
// always visible -- the same "ABN in the header, every page" pattern used
// by verified Australian dealers, adapted to the real US-equivalent: a
// Texas Comptroller Taxpayer Number, linking straight to the live public
// government record rather than a claim customers have to take on faith.
export default function VerifyBar() {
  return (
    <div className="verify-bar">
      <div className="verify-bar-in">
        <span className="verify-bar-main">
          ✓ Verified Texas Business — <strong>{SITE.legalEntityName}</strong>
          <span className="verify-bar-taxno"> &middot; Taxpayer #{SITE.taxpayerNumber}</span>
        </span>
        <a href={SITE.verifyUrl} target="_blank" rel="noopener noreferrer">
          Verify on Texas Comptroller ↗
        </a>
      </div>
    </div>
  );
}
