'use client';
import { useState } from 'react';
import { fmtPrice } from '@/config/site';

// A plain "Amount due now" field the admin fills in per invoice, rather
// than a hardcoded deposit-percentage calculation -- works for both a
// full-payment order and a 20% reservation-deposit order without the
// terminal needing to know in advance which one applies.
function suggestedAmount(order) {
  return order.totals.orderType === 'deposit' ? order.totals.depositAmount : order.totals.total;
}

export default function OrderSettlementTerminal({ order }) {
  const [amountDueNow, setAmountDueNow] = useState(suggestedAmount(order));
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function callStatusAction(status) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: order.ref, status }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to update status.');
      window.location.reload();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  async function handleSettle(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/orders/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: order.ref, amountDueNow: Number(amountDueNow), instructions, dueDate, notes }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to send invoice.');
      window.location.reload();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-section-title" style={{ marginTop: 0 }}>Settlement Terminal</div>

      {order.status === 'new' && (
        <form onSubmit={handleSettle}>
          <p className="muted" style={{ fontSize: '.85rem', marginTop: 0 }}>
            Suggested amount due now: {fmtPrice(suggestedAmount(order))}. Adjust and add payment coordinates below, then send the invoice.
          </p>
          <div className="form-group">
            <label htmlFor="amountDueNow">Amount Due Now (USD) *</label>
            <input id="amountDueNow" type="number" min="1" step="1" required value={amountDueNow} onChange={(e) => setAmountDueNow(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="instructions">Payment Instructions *</label>
            <textarea
              id="instructions"
              required
              rows={5}
              placeholder={order.payment === 'crypto' ? 'BTC/USDT wallet address, network, and any memo/tag...' : 'Bank name, account name, account/routing number...'}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date (optional)</label>
            <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Internal Notes (optional)</label>
            <textarea id="notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button className="btn-primary btn-block" type="submit" disabled={busy}>
            {busy ? 'Sending...' : 'Send Invoice'}
          </button>
        </form>
      )}

      {order.status === 'invoice_sent' && (
        <>
          <p className="muted" style={{ marginTop: 0 }}>Invoice sent — {fmtPrice(order.invoice?.amountDueNow || 0)} due now.</p>
          <button className="btn-primary btn-block" type="button" disabled={busy} onClick={() => callStatusAction('paid')}>
            Mark Paid
          </button>
        </>
      )}

      {order.status === 'paid' && (
        <>
          <p className="muted" style={{ marginTop: 0 }}>Payment received.</p>
          <button className="btn-primary btn-block" type="button" disabled={busy} onClick={() => callStatusAction('dispatched')}>
            Mark Dispatched
          </button>
        </>
      )}

      {order.status === 'dispatched' && <p className="muted" style={{ marginTop: 0 }}>Order complete — dispatched to customer.</p>}

      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
