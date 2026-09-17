// Transactional email templates. Every contact detail (email, phone,
// address) is read from SITE / order config -- never a hardcoded literal --
// so a future number change can't silently miss one template. Every
// template carries exactly one call-to-action link.
import { SITE, fmtPrice } from '@/config/site';
import { emailShell, table, row, td, button, statusBadge, kv, esc, COLORS } from './layout';

const ACCENT = SITE.primaryColor || '#5B82D6';

function shell(preheader, bodyHtml) {
  return emailShell({
    preheader,
    bodyHtml,
    siteName: SITE.name,
    siteDomain: SITE.domain,
    siteEmail: SITE.email,
    siteAddress: SITE.legalAddress || SITE.hqPlace,
  });
}

function header(eyebrow, title) {
  return row(
    COLORS.surface,
    'padding:36px 40px 8px;',
    `<div class="be-pad" style="font-family:Inter,Arial,sans-serif;">
      <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${ACCENT};margin-bottom:10px;">${esc(eyebrow)}</div>
      <h1 class="be-h1" style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;color:${COLORS.ink};">${esc(title)}</h1>
    </div>`
  );
}

function lineItemsTable(lines) {
  const rows = lines
    .map((l) =>
      kv(`${l.qty} x ${l.name}`, fmtPrice(l.lineTotal))
    )
    .join('');
  return `<div class="be-pad">${table(COLORS.surface, rows)}</div>`;
}

function totalsBlock(totals) {
  const rows = [
    kv('Subtotal', fmtPrice(totals.subtotal)),
    totals.bundleDiscount ? kv('Bundle discount', `-${fmtPrice(totals.bundleDiscount)}`) : '',
    totals.cryptoDiscount ? kv('Crypto discount', `-${fmtPrice(totals.cryptoDiscount)}`) : '',
    kv('Shipping', totals.shipping ? fmtPrice(totals.shipping) : 'Free'),
    kv('Total', fmtPrice(totals.total), { strong: true }),
    totals.orderType === 'deposit' ? kv('Reservation deposit due now', fmtPrice(totals.depositAmount), { strong: true }) : '',
  ]
    .filter(Boolean)
    .join('');
  return `<div class="be-pad" style="margin-top:6px;">${table(COLORS.surface, rows)}</div>`;
}

function footerSpacer() {
  return row(COLORS.surface, 'padding:8px 40px 36px;', '<div class="be-pad"></div>');
}

export function orderConfirmationEmail(order, statusUrl) {
  const body =
    header('Order received', `Thanks, ${order.customer.name.split(' ')[0]}.`) +
    row(
      COLORS.surface,
      'padding:0 40px 20px;',
      `<div class="be-pad" style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:${COLORS.inkSoft};">
        We've received order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong>. Our team confirms stock, final pricing and shipping by email before anything is charged.
      </div>`
    ) +
    lineItemsTable(order.lines) +
    totalsBlock(order.totals) +
    row(
      COLORS.surface,
      'padding:28px 40px 8px;',
      `<div class="be-pad">${button(statusUrl, 'View Order Status', { accent: ACCENT, full: true })}</div>`
    ) +
    footerSpacer();
  return {
    subject: `Order Received — ${order.ref}`,
    html: shell(`Order ${order.ref} received — we'll confirm details shortly.`, body),
  };
}

export function adminOrderNotificationEmail(order, settleUrl) {
  const body =
    header('New order', `${esc(order.customer.name)} — ${fmtPrice(order.totals.total)}`) +
    row(
      COLORS.surface,
      'padding:0 40px 16px;',
      `<div class="be-pad" style="font-family:Inter,Arial,sans-serif;font-size:14px;color:${COLORS.inkSoft};">
        ${esc(order.customer.email)} &middot; ${esc(order.customer.phone)}<br/>
        ${esc(order.customer.city)}, ${esc(order.customer.state)} &middot; ${esc(order.totals.orderType === 'deposit' ? '20% reservation deposit' : 'Full payment')} &middot; ${esc(order.payment)}
      </div>`
    ) +
    lineItemsTable(order.lines) +
    totalsBlock(order.totals) +
    row(
      COLORS.surface,
      'padding:28px 40px 8px;',
      `<div class="be-pad">${button(settleUrl, 'Open Settlement Terminal', { accent: ACCENT, full: true })}</div>`
    ) +
    footerSpacer();
  return {
    subject: `New Order ${order.ref} — ${fmtPrice(order.totals.total)}`,
    html: shell(`New order from ${order.customer.name} — ${fmtPrice(order.totals.total)}`, body),
  };
}

export function invoiceEmail(order, payUrl) {
  const inv = order.invoice || {};
  const body =
    header('Invoice', `Payment for ${esc(order.ref)}`) +
    row(
      COLORS.surface,
      'padding:0 40px 20px;',
      `<div class="be-pad" style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:${COLORS.inkSoft};">
        ${statusBadge('Invoice Sent', { bg: '#fdf1de', color: '#8a5a10', dot: '#d99a2b' })}
        <div style="margin-top:14px;">Here's your invoice for order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong>. Full payment instructions are on the linked page.</div>
      </div>`
    ) +
    row(
      COLORS.surface,
      'padding:0 40px;',
      `<div class="be-pad">${table(COLORS.surfaceAlt, kv('Amount due now', fmtPrice(inv.amountDueNow || 0), { strong: true }) + (inv.dueDate ? kv('Due date', inv.dueDate) : ''), 'border-radius:10px;padding:4px 16px;')}</div>`
    ) +
    row(
      COLORS.surface,
      'padding:28px 40px 8px;',
      `<div class="be-pad">${button(payUrl, 'View Invoice & Payment Details', { accent: ACCENT, full: true })}</div>`
    ) +
    footerSpacer();
  return {
    subject: `Invoice for Order ${order.ref} — ${fmtPrice(inv.amountDueNow || 0)} due`,
    html: shell(`Invoice for ${order.ref} — ${fmtPrice(inv.amountDueNow || 0)} due now.`, body),
  };
}
