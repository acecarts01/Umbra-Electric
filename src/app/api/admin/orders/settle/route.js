// Admin-cookie gated. Writes the invoice (a plain "amount due now" field
// the admin fills in per order -- works for both full-payment and
// reservation-deposit flows without the terminal needing to know which one
// applies), advances status to invoice_sent, and sends the invoice email.
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/order/adminAuth';
import { getOrder, upsertOrder, insertEvent, orderFromRow } from '@/lib/order/db';
import { signOrder } from '@/lib/order/token';
import { siteUrl } from '@/lib/order/siteUrl';
import { sendMail } from '@/lib/order/mail';
import { invoiceEmail } from '@/lib/email/templates';

export async function POST(request) {
  if (!(await isAdminRequest())) return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });

  const { ref, amountDueNow, instructions, dueDate, notes } = await request.json().catch(() => ({}));
  if (!ref || !(Number(amountDueNow) > 0) || !instructions) {
    return NextResponse.json({ success: false, message: 'ref, amountDueNow and instructions are required.' }, { status: 400 });
  }

  const row = await getOrder(ref).catch(() => null);
  if (!row) return NextResponse.json({ success: false, message: 'Order not found.' }, { status: 404 });

  // Status must come from the live DB row, not any token -- and a
  // state-changing write must never regress an already-advanced order.
  if (row.status === 'paid' || row.status === 'dispatched') {
    return NextResponse.json({ success: false, message: `Already ${row.status}. This order can no longer be re-invoiced.` }, { status: 409 });
  }

  const order = orderFromRow(row);
  order.status = 'invoice_sent';
  order.invoice = {
    amountDueNow: Number(amountDueNow),
    instructions: String(instructions).slice(0, 2000),
    dueDate: dueDate ? String(dueDate).slice(0, 40) : null,
    notes: notes ? String(notes).slice(0, 1000) : '',
    issuedAt: new Date().toISOString(),
  };

  await upsertOrder(order);
  await insertEvent(ref, 'invoice_sent', `Invoice issued: $${order.invoice.amountDueNow} due now.`);

  const token = signOrder(order);
  const payUrl = `${siteUrl()}/pay/${ref}/?t=${token}`;
  const invoice = invoiceEmail(order, payUrl);
  const mailResult = await sendMail({ to: order.customer.email, subject: invoice.subject, html: invoice.html });

  return NextResponse.json({ success: true, token, payUrl, emailSent: mailResult.sent });
}
