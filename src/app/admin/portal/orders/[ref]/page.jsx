import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/order/adminAuth';
import { getOrder, listEvents, orderFromRow } from '@/lib/order/db';
import { fmtPrice } from '@/config/site';
import { statusLabel } from '@/lib/order/status';
import OrderSettlementTerminal from '@/components/admin/OrderSettlementTerminal';
import LogoutButton from '@/components/AdminLogoutButton';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminOrderDetailPage({ params }) {
  const { ref } = await params;
  const currentPath = `/admin/portal/orders/${ref}/`;
  if (!(await isAdminRequest())) redirect(`/admin/login/?next=${encodeURIComponent(currentPath)}`);

  const row = await getOrder(ref).catch(() => null);

  return (
    <div className="admin-body" style={{ minHeight: '100vh' }}>
      <div className="admin-topbar">
        <div className="container">
          <span className="admin-topbar-brand">Umbra Electric — Admin</span>
          <LogoutButton />
        </div>
      </div>
      <div className="container admin-main">
        <a href="/admin/portal/?tab=orders" className="muted" style={{ fontSize: '.85rem' }}>← All orders</a>
        {!row ? (
          <div className="admin-empty" style={{ marginTop: '1.5rem' }}>No order found for ref &ldquo;{ref}&rdquo;.</div>
        ) : (
          <OrderDetail row={row} orderRef={ref} />
        )}
      </div>
    </div>
  );
}

async function OrderDetail({ row, orderRef }) {
  const order = orderFromRow(row);
  const events = await listEvents(orderRef).catch(() => []);

  return (
    <>
      <h1 style={{ fontSize: '1.7rem', margin: '.6rem 0 1.6rem' }}>
        {order.ref} <span className={`admin-badge ${order.status}`} style={{ marginLeft: '.6rem', verticalAlign: 'middle' }}>{statusLabel(order.status)}</span>
      </h1>
      <div className="admin-detail-grid">
        <div>
          <div className="admin-panel">
            <div className="admin-section-title" style={{ marginTop: 0 }}>Customer</div>
            <div className="admin-kv"><span>Name</span><span>{order.customer.name}</span></div>
            <div className="admin-kv"><span>Email</span><span>{order.customer.email}</span></div>
            <div className="admin-kv"><span>Phone</span><span>{order.customer.phone}</span></div>
            <div className="admin-kv"><span>Address</span><span>{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}</span></div>
            {order.customer.notes && <div className="admin-kv"><span>Notes</span><span>{order.customer.notes}</span></div>}

            <div className="admin-section-title">Order</div>
            {order.lines.map((l) => (
              <div className="admin-kv" key={l.slug}><span>{l.qty} x {l.name}</span><span>{fmtPrice(l.lineTotal)}</span></div>
            ))}
            <div className="admin-kv"><span>Subtotal</span><span>{fmtPrice(order.totals.subtotal)}</span></div>
            {order.totals.bundleDiscount > 0 && <div className="admin-kv"><span>Bundle discount</span><span>-{fmtPrice(order.totals.bundleDiscount)}</span></div>}
            {order.totals.cryptoDiscount > 0 && <div className="admin-kv"><span>Crypto discount</span><span>-{fmtPrice(order.totals.cryptoDiscount)}</span></div>}
            <div className="admin-kv"><span>Shipping</span><span>{order.totals.shipping ? fmtPrice(order.totals.shipping) : 'Free'}</span></div>
            <div className="admin-kv"><span>Total</span><span>{fmtPrice(order.totals.total)}</span></div>
            <div className="admin-kv"><span>Order type</span><span>{order.totals.orderType === 'deposit' ? `20% reservation deposit ($${order.totals.depositAmount})` : 'Full payment'}</span></div>
            <div className="admin-kv"><span>Preferred payment</span><span>{order.payment === 'crypto' ? 'Crypto (BTC/USDT)' : 'Bank Transfer'}</span></div>

            {order.invoice && (
              <>
                <div className="admin-section-title">Invoice</div>
                <div className="admin-kv"><span>Amount due now</span><span>{fmtPrice(order.invoice.amountDueNow)}</span></div>
                {order.invoice.dueDate && <div className="admin-kv"><span>Due date</span><span>{order.invoice.dueDate}</span></div>}
                <div className="admin-kv"><span>Instructions</span><span style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{order.invoice.instructions}</span></div>
              </>
            )}
          </div>
        </div>
        <div>
          <OrderSettlementTerminal order={order} />
          <div className="admin-panel">
            <div className="admin-section-title" style={{ marginTop: 0 }}>Activity</div>
            <ul className="admin-timeline">
              {events.length === 0 && <li>No activity yet.</li>}
              {events.map((e) => (
                <li key={e.id}>
                  <span className="t">{statusLabel(e.status)}</span> — {e.note}
                  <br />
                  {new Date(e.at).toLocaleString('en-US')}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
