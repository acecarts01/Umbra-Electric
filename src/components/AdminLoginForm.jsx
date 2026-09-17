'use client';
import { useState } from 'react';

export default function AdminLoginForm({ next }) {
  const [passphrase, setPassphrase] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = next && next.startsWith('/admin/') ? next : '/admin/portal/';
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="passphrase">Passphrase</label>
        <input
          id="passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          required
          autoFocus
        />
      </div>
      <button type="submit" className="btn-primary btn-block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Checking...' : 'Log In'}
      </button>
      {status === 'error' && <div className="form-error">Incorrect passphrase.</div>}
    </form>
  );
}
