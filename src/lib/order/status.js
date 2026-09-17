// Kept to states something in the code actually transitions into -- no
// 'awaiting_invoice'-style rail segment that renders in every filter/badge
// but that no code path ever assigns.
export const STATUS_ORDER = ['new', 'invoice_sent', 'paid', 'dispatched'];
export const ADVANCEABLE = ['paid', 'dispatched'];

export function statusLabel(status) {
  return { new: 'New', invoice_sent: 'Invoice Sent', paid: 'Paid', dispatched: 'Dispatched' }[status] || status;
}

export function canAdvanceTo(currentStatus, nextStatus) {
  if (!ADVANCEABLE.includes(nextStatus)) return false;
  const cur = STATUS_ORDER.indexOf(currentStatus);
  const next = STATUS_ORDER.indexOf(nextStatus);
  return cur >= 0 && next > cur;
}
