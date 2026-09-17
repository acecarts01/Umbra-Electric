// Admin-cookie gated. Advances status on events that don't naturally
// produce a new signed link ("the customer paid", "the order shipped").
// Guarded by a live-status check so reusing an old link can never regress
// an order backward.
import { NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { isAdminRequest } from '@/lib/order/adminAuth';
import { getOrder, upsertOrder, insertEvent, orderFromRow } from '@/lib/order/db';
import { signOrder } from '@/lib/order/token';
import { siteUrl } from '@/lib/order/siteUrl';
import { canAdvanceTo, statusLabel } from '@/lib/order/status';
import { sendMail } from '@/lib/order/mail';
import { paymentReceivedEmail, orderDispatchedEmail, adminStatusUpdateEmail } from '@/lib/email/templates';

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

  // Both "the customer paid" and "the order shipped" are events an admin
  // triggers manually with no naturally-occurring email of their own --
  // notify the customer AND the sales desk here, same as every other
  // status change in this module.
  const statusUrl = `${siteUrl()}/pay/${ref}/?t=${token}`;
  const portalUrl = `${siteUrl()}/admin/portal/orders/${ref}/?t=${token}`;
  const customerTemplate = status === 'paid' ? paymentReceivedEmail : orderDispatchedEmail;
  const customerMail = customerTemplate(order, statusUrl);
  const adminMail = adminStatusUpdateEmail(order, statusLabel(status), portalUrl);
  const notifyTo = process.env.ORDER_NOTIFY_EMAIL || SITE.email;

  await Promise.all([
    sendMail({ to: order.customer.email, subject: customerMail.subject, html: customerMail.html }),
    sendMail({ to: notifyTo, subject: adminMail.subject, html: adminMail.html }),
  ]);

  return NextResponse.json({ success: true, token, status });
}
