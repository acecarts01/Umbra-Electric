'use client';

export default function AdminLogoutButton() {
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login/';
  }
  return (
    <button type="button" className="admin-logout" onClick={handleLogout}>
      Log Out
    </button>
  );
}
