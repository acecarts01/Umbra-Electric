// Public, unauthenticated order submission. The server is the ONLY
// generator of ref/pricing -- never trust a client-supplied ref, price or
// line total. A database write failure must never block the confirmation
// email from sending.
import { NextResponse } from 'next/server';
import { SITE } from '@/config/site';
import { computeOrderTotals } from '@/lib/order/pricing';
import { newOrderRef, signOrder } from '@/lib/order/token';
import { siteUrl } from '@/lib/order/siteUrl';
import { upsertOrder, insertEvent } from '@/lib/order/db';
import { sendMail } from '@/lib/order/mail';
import { orderConfirmationEmail, adminOrderNotificationEmail } from '@/lib/email/templates';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const { name, email, phone, address, city, state, zip, items, paymentMethod, orderType, notes } = body || {};
  if (!name || !email || !phone || !address || !city || !state || !zip || !Array.isArray(items) || !items.length) {
    return NextResponse.json({ success: false, message: 'Missing required order fields.' }, { status: 400 });
  }
  if (!['crypto', 'bank'].includes(paymentMethod)) {
    return NextResponse.json({ success: false, message: 'Invalid payment method.' }, { status: 400 });
  }

  const priced = computeOrderTotals(items, { paymentMethod, orderType });
  if (priced.error) return NextResponse.json({ success: false, message: priced.error }, { status: 400 });
  if (!priced.meetsMinimumOrder) {
    return NextResponse.json({ success: false, message: `Minimum order is $${SITE.minOrder.toLocaleString()}.` }, { status: 400 });
  }

  const order = {
    ref: newOrderRef(),
    createdAt: new Date().toISOString(),
    status: 'new',
    channel: 'website',
    payment: paymentMethod,
    customer: {
      name: String(name).slice(0, 200),
      email: String(email).slice(0, 200),
      phone: String(phone).slice(0, 60),
      address: String(address).slice(0, 300),
      city: String(city).slice(0, 120),
      state: String(state).slice(0, 60),
      zip: String(zip).slice(0, 30),
      notes: notes ? String(notes).slice(0, 1000) : '',
    },
    lines: priced.lines,
    totals: priced.totals,
    invoice: null,
  };

  try {
    await upsertOrder(order);
    await insertEvent(order.ref, 'new', 'Order submitted via website.');
  } catch (e) {
    console.error('[orders/create] DB write failed (email will still send):', e.message);
  }

  const token = signOrder(order);
  const statusUrl = `${siteUrl()}/pay/${order.ref}/?t=${token}`;
  const settleUrl = `${siteUrl()}/admin/portal/orders/${order.ref}/?t=${token}`;

  const confirmation = orderConfirmationEmail(order, statusUrl);
  const adminNotice = adminOrderNotificationEmail(order, settleUrl);
  const notifyTo = process.env.ORDER_NOTIFY_EMAIL || SITE.email;

  const [customerResult, adminResult] = await Promise.all([
    sendMail({ to: order.customer.email, subject: confirmation.subject, html: confirmation.html, replyTo: SITE.email }),
    sendMail({ to: notifyTo, subject: adminNotice.subject, html: adminNotice.html, replyTo: order.customer.email }),
  ]);

  return NextResponse.json({
    success: true,
    ref: order.ref,
    statusUrl,
    emailSent: customerResult.sent,
    adminNotified: adminResult.sent,
  });
}
