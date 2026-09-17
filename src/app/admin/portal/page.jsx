import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/order/adminAuth';
import { dashboardStats, listOrders, listEnquiries, orderFromRow } from '@/lib/order/db';
import { signOrder } from '@/lib/order/token';
import { statusLabel } from '@/lib/order/status';
import { fmtPrice } from '@/config/site';
import LogoutButton from '@/components/AdminLogoutButton';

export const metadata = { robots: { index: false, follow: false } };

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function orderLink(row) {
  return `/admin/portal/orders/${row.ref}/?t=${signOrder(orderFromRow(row))}`;
}

function Tabs({ active }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Orders' },
    { id: 'enquiries', label: 'Enquiries' },
  ];
  return (
    <div className="admin-tabs">
      {tabs.map((t) => (
        <a key={t.id} href={`/admin/portal/?tab=${t.id}`} className={`admin-tab${active === t.id ? ' on' : ''}`}>
          {t.label}
        </a>
      ))}
    </div>
  );
}

function OrderCards({ rows }) {
  if (!rows.length) return <div className="admin-empty">No orders match.</div>;
  return (
    <div className="admin-list-cards">
      {rows.map((row) => (
        <a key={row.ref} href={orderLink(row)} className="admin-card-row">
          <div className="admin-card-row-top">
            <span className="ref">{row.ref} &middot; {fmtDate(row.created_at)}</span>
            <span className="who">{row.customer.name}</span>
          </div>
          <div className="admin-card-row-bottom">
            <span className={`admin-badge ${row.status}`}>{statusLabel(row.status)}</span>
            <span className="total">{fmtPrice(row.totals.total)}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function OrderTable({ rows }) {
  if (!rows.length) return null;
  return (
    <div className="admin-list-table">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Total</th>
            <th>Placed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.ref}>
              <td><a href={orderLink(row)}>{row.ref}</a></td>
              <td>{row.customer.name}</td>
              <td><span className={`admin-badge ${row.status}`}>{statusLabel(row.status)}</span></td>
              <td>{fmtPrice(row.totals.total)}</td>
              <td>{fmtDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EnquiryCards({ rows }) {
  if (!rows.length) return <div className="admin-empty">No enquiries match.</div>;
  return (
    <div className="admin-list-cards">
      {rows.map((row) => (
        <div key={row.id} className="admin-card-row">
          <div className="admin-card-row-top">
            <span className="ref">{row.form_type} &middot; {fmtDate(row.created_at)}</span>
            <span className="who">{row.name}</span>
          </div>
          <div className="admin-card-row-bottom">
            <span className="muted" style={{ fontSize: '.85rem' }}>{row.email || row.phone || '—'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnquiryTable({ rows }) {
  if (!rows.length) return null;
  return (
    <div className="admin-list-table">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Email / Phone</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.form_type}</td>
              <td>{row.name}</td>
              <td>{row.email || row.phone || '—'}</td>
              <td>{fmtDate(row.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function AdminPortalPage({ searchParams }) {
  if (!(await isAdminRequest())) redirect('/admin/login/?next=%2Fadmin%2Fportal%2F');

  const sp = await searchParams;
  const tab = ['dashboard', 'orders', 'enquiries'].includes(sp.tab) ? sp.tab : 'dashboard';

  return (
    <div className="admin-body" style={{ minHeight: '100vh' }}>
      <div className="admin-topbar">
        <div className="container">
          <span className="admin-topbar-brand">Umbra Electric — Admin</span>
          <LogoutButton />
        </div>
      </div>
      <div className="container admin-main">
        <Tabs active={tab} />
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'orders' && <OrdersTab status={sp.status || ''} q={sp.q || ''} />}
        {tab === 'enquiries' && <EnquiriesTab type={sp.type || ''} q={sp.q || ''} />}
      </div>
    </div>
  );
}

async function DashboardTab() {
  const [stats, recentOrders, recentEnquiries] = await Promise.all([
    dashboardStats().catch(() => ({ total_orders: 0, needs_action: 0, settled_revenue: 0, pipeline_value: 0, total_enquiries: 0 })),
    listOrders({ limit: 5 }).catch(() => []),
    listEnquiries({ limit: 5 }).catch(() => []),
  ]);

  return (
    <>
      <div className="admin-stats">
        <a className="admin-stat-card" href="/admin/portal/?tab=orders">
          <span className="num">{stats.total_orders}</span>
          <span className="label">Total Orders</span>
        </a>
        <a className="admin-stat-card" href="/admin/portal/?tab=orders&status=new">
          <span className="num">{stats.needs_action}</span>
          <span className="label">Needs Action</span>
        </a>
        <div className="admin-stat-card">
          <span className="num">{fmtPrice(Math.round(stats.settled_revenue))}</span>
          <span className="label">Settled Revenue</span>
        </div>
        <div className="admin-stat-card">
          <span className="num">{fmtPrice(Math.round(stats.pipeline_value))}</span>
          <span className="label">Pipeline Value</span>
        </div>
        <a className="admin-stat-card" href="/admin/portal/?tab=enquiries">
          <span className="num">{stats.total_enquiries}</span>
          <span className="label">Enquiries</span>
        </a>
      </div>

      <div className="admin-section-title">Recent Orders</div>
      <OrderCards rows={recentOrders} />
      <OrderTable rows={recentOrders} />
      <div className="admin-actions">
        <a className="btn-ghost" href="/admin/portal/?tab=orders">View all orders →</a>
      </div>

      <div className="admin-section-title">Recent Enquiries</div>
      <EnquiryCards rows={recentEnquiries} />
      <EnquiryTable rows={recentEnquiries} />
      <div className="admin-actions">
        <a className="btn-ghost" href="/admin/portal/?tab=enquiries">View all enquiries →</a>
      </div>
    </>
  );
}

async function OrdersTab({ status, q }) {
  const rows = await listOrders({ status: status || undefined, q: q || undefined }).catch(() => []);
  return (
    <>
      <form className="admin-filter-form" method="get">
        <input type="hidden" name="tab" value="orders" />
        <input type="text" name="q" defaultValue={q} placeholder="Search name, email, ref..." />
        <select name="status" defaultValue={status}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="invoice_sent">Tax Invoice Sent</option>
          <option value="paid">Paid</option>
          <option value="dispatched">Dispatched</option>
        </select>
        <button className="btn-secondary" type="submit">Filter</button>
      </form>
      <OrderCards rows={rows} />
      <OrderTable rows={rows} />
    </>
  );
}

async function EnquiriesTab({ type, q }) {
  const rows = await listEnquiries({ type: type || undefined, q: q || undefined }).catch(() => []);
  return (
    <>
      <form className="admin-filter-form" method="get">
        <input type="hidden" name="tab" value="enquiries" />
        <input type="text" name="q" defaultValue={q} placeholder="Search name, email, message..." />
        <select name="type" defaultValue={type}>
          <option value="">All types</option>
          <option value="contact">Contact</option>
          <option value="wholesale">Wholesale</option>
        </select>
        <button className="btn-secondary" type="submit">Filter</button>
      </form>
      <EnquiryCards rows={rows} />
      <EnquiryTable rows={rows} />
    </>
  );
}
