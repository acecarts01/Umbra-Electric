import { redirect } from 'next/navigation';
import { isAdminRequest } from '@/lib/order/adminAuth';
import AdminLoginForm from '@/components/AdminLoginForm';

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }) {
  const { next } = await searchParams;
  if (await isAdminRequest()) redirect(next && next.startsWith('/admin/') ? next : '/admin/portal/');

  return (
    <div className="admin-body" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="admin-login-box">
          <span className="eyebrow">Umbra Electric</span>
          <h1 style={{ fontSize: '1.6rem', marginTop: '.4rem' }}>Admin Login</h1>
          <p className="muted" style={{ marginBottom: '1.5rem' }}>Orders &amp; enquiries portal.</p>
          <AdminLoginForm next={next || ''} />
        </div>
      </div>
    </div>
  );
}
