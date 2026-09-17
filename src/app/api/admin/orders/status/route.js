// Admin-cookie gated. Advances status on events that don't naturally
// produce a new signed link ("the customer paid", "the order shipped").
// Guarded by a live-status check so reusing an old link can never regress
// an order backward.
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/order/adminAuth';
import { getOrder, upsertOrder, insertEvent, orderFromRow } from '@/lib/order/db';
import { signOrder } from '@/lib/order/token';
import { canAdvanceTo, statusLabel } from '@/lib/order/status';

export async function POST(request) {
  if (!(await isAdminRequest())) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

  const { ref, status } = await request.json().catch(() => ({}));
  if (!ref || !status) return NextResponse.json({ success: false, message: 'ref and status are required.' }, { status: 400 });

  const row = await getOrder(ref).catch(() => null);
  if (!row) return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });

  if (!canAdvanceTo(row.status, status)) {
    return NextResponse.json({ success: false, message: `Cannot move from ${statusLabel(row.status)} to ${statusLabel(status)}.` }, { status: 409 });
  }

  const order = orderFromRow(row);
  order.status = status;
  await upsertOrder(order);
  await insertEvent(ref, status, `Marked ${statusLabel(status)} by admin.`);

  const token = signOrder(order);
  return NextResponse.json({ success: true, token, status });
}
