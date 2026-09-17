'use client';

export default function AdminError({ error, reset }) {
  return (
    <div className="admin-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="admin-login-box" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Umbra Electric Admin</span>
          <h1 style={{ fontSize: '1.5rem', marginTop: '.4rem' }}>Something didn&apos;t load</h1>
          <p className="muted">
            {error?.message?.includes('ORDER_SIGNING_SECRET')
              ? 'The order-signing secret is not configured for this environment.'
              : 'This is usually a temporary database or network issue.'}
          </p>
          <button className="btn-primary btn-block" type="button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
