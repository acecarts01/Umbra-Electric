import { verifyOrder } from '@/lib/order/token';
import { getOrder } from '@/lib/order/db';
import { statusLabel } from '@/lib/order/status';
import { SITE, fmtPrice } from '@/config/site';

export const metadata = { robots: { index: false, follow: false } };

export default async function PayPage({ params, searchParams }) {
  const { ref } = await params;
  const { t } = await searchParams;
  const tokenOrder = verifyOrder(t);

  if (!tokenOrder || tokenOrder.ref !== ref) {
    return (
      <div className="admin-body" style={{ minHeight: '100vh' }}>
        <div className="container">
          <div className="admin-login-box" style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.4rem' }}>Link Invalid or Expired</h1>
            <p className="muted">
              This order link couldn&apos;t be verified. Please check your email for the latest link, or contact us at{' '}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Live DB status/invoice win for display -- a re-opened old email link
  // must never show stale status or stale payment instructions.
  const row = await getOrder(ref).catch(() => null);
  const order = row ? { ...tokenOrder, status: row.status, invoice: row.invoice } : tokenOrder;

  return (
    <div className="admin-body" style={{ minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 640, padding: '3rem 20px' }}>
        <span className="eyebrow">{SITE.name}</span>
        <h1 style={{ fontSize: '1.8rem', margin: '.4rem 0 .3rem' }}>
          Order {order.ref} <span className={`admin-badge ${order.status}`} style={{ marginLeft: '.5rem', verticalAlign: 'middle' }}>{statusLabel(order.status)}</span>
        </h1>

        {order.status === 'new' && (
          <p className="lead">We&apos;re confirming stock, final pricing and shipping. An invoice with payment instructions will be emailed to you shortly.</p>
        )}

        {order.status !== 'new' && order.invoice && (
          <div className="admin-panel" style={{ marginTop: '1.5rem' }}>
            <div className="admin-kv"><span>Amount due now</span><span>{fmtPrice(order.invoice.amountDueNow)}</span></div>
            {order.invoice.dueDate && <div className="admin-kv"><span>Due date</span><span>{order.invoice.dueDate}</span></div>}
            <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', fontSize: '.92rem', lineHeight: 1.6 }}>{order.invoice.instructions}</div>
            {(order.status === 'paid' || order.status === 'dispatched') && (
              <p style={{ marginTop: '1rem', fontWeight: 700, color: '#1f7a3d' }}>Payment received — thank you.</p>
            )}
          </div>
        )}

        <div className="admin-panel">
          <div className="admin-section-title" style={{ marginTop: 0 }}>Order Summary</div>
          {order.lines.map((l) => (
            <div className="admin-kv" key={l.slug}><span>{l.qty} x {l.name}</span><span>{fmtPrice(l.lineTotal)}</span></div>
          ))}
          <div className="admin-kv"><span>Total</span><span>{fmtPrice(order.totals.total)}</span></div>
        </div>

        <p className="muted" style={{ fontSize: '.85rem' }}>
          Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </div>
  );
}
