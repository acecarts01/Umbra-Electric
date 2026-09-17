// Transactional email templates. Every contact detail (email, phone,
// address) is read from SITE / order config -- never a hardcoded literal --
// so a future number change can't silently miss one template. Every
// template carries exactly one call-to-action link.
import { SITE, fmtPrice } from '@/config/site';
import { emailShell, table, row, td, button, statusBadge, seal, kv, esc, COLORS } from './layout';

function shell(preheader, bodyHtml) {
  return emailShell({
    preheader,
    bodyHtml,
    siteName: SITE.name,
    siteTagline: SITE.tagline,
    siteDomain: SITE.domain,
    siteEmail: SITE.email,
    siteAddress: SITE.legalAddress || SITE.hqPlace,
  });
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function paymentMethodLabel(order) {
  return order.payment === 'crypto' ? 'Cryptocurrency (BTC/USDT)' : 'Bank Transfer';
}

function header(eyebrow, title) {
  return row(
    COLORS.card,
    'padding:40px 40px 10px;',
    `<div class="be-pad" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
      <div style="font-size:11.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:${COLORS.accentDark};margin-bottom:12px;">${esc(eyebrow)}</div>
      <h1 class="be-h1" style="margin:0 0 8px;font-family:Georgia,'Iowan Old Style','Times New Roman',serif;font-weight:600;color:${COLORS.ink};">${esc(title)}</h1>
    </div>`
  );
}

function lede(html) {
  return row(
    COLORS.card,
    'padding:0 40px 18px;',
    `<div class="be-pad" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15.5px;line-height:1.65;color:${COLORS.inkSoft};">${html}</div>`
  );
}

function sectionLabel(text) {
  return row(
    COLORS.card,
    'padding:22px 40px 4px;',
    `<div class="be-pad" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${COLORS.inkSoft};">${esc(text)}</div>`
  );
}

function lineItemsTable(lines) {
  const rows = lines.map((l) => kv(`${l.qty} &times; ${l.name}`, fmtPrice(l.lineTotal))).join('');
  return `<div class="be-pad">${table(COLORS.card, rows)}</div>`;
}

function totalsBlock(totals) {
  const rows = [
    kv('Subtotal', fmtPrice(totals.subtotal)),
    totals.bundleDiscount ? kv('Bundle discount', `-${fmtPrice(totals.bundleDiscount)}`) : '',
    totals.cryptoDiscount ? kv('Crypto discount', `-${fmtPrice(totals.cryptoDiscount)}`) : '',
    kv('Shipping', totals.shipping ? fmtPrice(totals.shipping) : 'Free'),
    kv('Total', fmtPrice(totals.total), { strong: true, size: 'lg' }),
    totals.orderType === 'deposit' ? kv('Reservation deposit due now', fmtPrice(totals.depositAmount), { strong: true }) : '',
  ]
    .filter(Boolean)
    .join('');
  return `<div class="be-pad" style="margin-top:4px;">${table(COLORS.card, rows)}</div>`;
}

function ctaBlock(href, label, opts = {}) {
  return row(COLORS.card, 'padding:30px 40px 6px;', `<div class="be-pad">${button(href, label, { full: true, ...opts })}</div>`);
}

function bottomSpacer() {
  return row(COLORS.card, 'padding:10px 40px 38px;', '<div class="be-pad"></div>');
}

// The official payment receipt -- a distinct, certificate-like panel
// (double-ruled seal, "Receipt No." / "Date Paid" meta, Bill To / From,
// itemised total) rather than a rasterised image, so it renders natively
// in every client the same way the rest of the order emails do.
function receiptBlock(order) {
  const amountPaid = order.invoice?.amountDueNow ?? order.totals.total;
  const balanceRemaining = Math.max(0, order.totals.total - amountPaid);
  const bg = COLORS.paper;
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";

  const titleRow = row(
    bg,
    'padding:26px 26px 4px;',
    table(
      bg,
      `<tr>
        ${td(bg, `font-family:Georgia,'Iowan Old Style','Times New Roman',serif;font-size:15px;font-weight:600;color:${COLORS.ink};vertical-align:middle;`, 'Official Receipt')}
        ${td(bg, 'text-align:right;vertical-align:middle;', seal('Paid in Full'))}
      </tr>`
    )
  );

  const metaRow = row(
    bg,
    'padding:14px 26px 0;',
    table(
      bg,
      [kv('Receipt No.', order.ref, { mono: true, bg }), kv('Date Paid', formatDate(), { bg }), kv('Payment Method', paymentMethodLabel(order), { bg })].join('')
    )
  );

  const billedToCell = td(
    bg,
    `width:50%;font-family:${SANS};font-size:12px;color:${COLORS.inkSoft};vertical-align:top;`,
    `<div style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:10.5px;color:${COLORS.inkSoft};margin-bottom:4px;">Billed To</div>
     <div style="color:${COLORS.ink};font-weight:600;">${esc(order.customer.name)}</div>
     ${esc(order.customer.address)}<br/>${esc(order.customer.city)}, ${esc(order.customer.state)} ${esc(order.customer.zip)}`
  );
  const fromCell = td(
    bg,
    `width:50%;font-family:${SANS};font-size:12px;color:${COLORS.inkSoft};vertical-align:top;text-align:right;`,
    `<div style="font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:10.5px;color:${COLORS.inkSoft};margin-bottom:4px;">From</div>
     <div style="color:${COLORS.ink};font-weight:600;">${esc(SITE.name)}</div>
     ${esc(SITE.legalAddress || SITE.hqPlace)}`
  );
  const partiesRow = row(bg, 'padding:16px 26px 0;', table(bg, `<tr>${billedToCell}${fromCell}</tr>`));

  const lineRows = order.lines.map((l) => kv(`${l.qty} &times; ${l.name}`, fmtPrice(l.lineTotal), { bg })).join('');
  const itemsRow = row(bg, 'padding:18px 26px 0;', table(bg, lineRows));

  const totalRows = [
    kv('Amount Paid', fmtPrice(amountPaid), { strong: true, size: 'lg', bg }),
    balanceRemaining > 0 ? kv('Balance remaining', fmtPrice(balanceRemaining), { bg }) : '',
  ]
    .filter(Boolean)
    .join('');
  const totalsRow = row(bg, 'padding:2px 26px 24px;', table(bg, totalRows));

  const panel = table(bg, titleRow + metaRow + partiesRow + itemsRow + totalsRow, `border-radius:12px;border:1px solid ${COLORS.line};overflow:hidden;`);

  return row(COLORS.card, 'padding:0 40px;', `<div class="be-pad">${panel}</div>`);
}

export function orderConfirmationEmail(order, statusUrl) {
  const body =
    header('Order Confirmation', `Thanks, ${order.customer.name.split(' ')[0]}.`) +
    lede(
      `We've received order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong>. Our team confirms stock, final pricing and shipping by email before anything is charged.`
    ) +
    sectionLabel('Order Summary') +
    lineItemsTable(order.lines) +
    totalsBlock(order.totals) +
    ctaBlock(statusUrl, 'View Order Status') +
    bottomSpacer();
  return {
    subject: `Order Received — ${order.ref}`,
    html: shell(`Order ${order.ref} received — we'll confirm details shortly.`, body),
  };
}

export function adminOrderNotificationEmail(order, settleUrl) {
  const body =
    header('New Order', `${esc(order.customer.name)} — ${fmtPrice(order.totals.total)}`) +
    lede(
      `${esc(order.customer.email)} &middot; ${esc(order.customer.phone)}<br/>${esc(order.customer.city)}, ${esc(order.customer.state)} &middot; ${esc(order.totals.orderType === 'deposit' ? '20% reservation deposit' : 'Full payment')} &middot; ${esc(paymentMethodLabel(order))}`
    ) +
    sectionLabel('Order Summary') +
    lineItemsTable(order.lines) +
    totalsBlock(order.totals) +
    ctaBlock(settleUrl, 'Open Settlement Terminal') +
    bottomSpacer();
  return {
    subject: `New Order ${order.ref} — ${fmtPrice(order.totals.total)}`,
    html: shell(`New order from ${order.customer.name} — ${fmtPrice(order.totals.total)}`, body),
  };
}

export function invoiceEmail(order, payUrl) {
  const inv = order.invoice || {};
  const body =
    header('Tax Invoice', `Payment for ${esc(order.ref)}`) +
    row(
      COLORS.card,
      'padding:0 40px 18px;',
      `<div class="be-pad">${statusBadge('Tax Invoice Sent', { bg: '#FDF1DE', color: '#8A5A10', dot: '#D99A2B' })}</div>`
    ) +
    lede(`Here's your tax invoice for order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong>. Full payment instructions are on the linked page.`) +
    row(
      COLORS.card,
      'padding:0 40px;',
      `<div class="be-pad">${table(COLORS.paper, kv('Amount due now', fmtPrice(inv.amountDueNow || 0), { strong: true, size: 'lg', bg: COLORS.paper }) + (inv.dueDate ? kv('Due date', inv.dueDate, { bg: COLORS.paper }) : ''), 'border-radius:12px;padding:6px 20px;border:1px solid ' + COLORS.line + ';')}</div>`
    ) +
    ctaBlock(payUrl, 'View Tax Invoice & Payment Details') +
    bottomSpacer();
  return {
    subject: `Tax Invoice for Order ${order.ref} — ${fmtPrice(inv.amountDueNow || 0)} due`,
    html: shell(`Tax Invoice for ${order.ref} — ${fmtPrice(inv.amountDueNow || 0)} due now.`, body),
  };
}

export function paymentReceivedEmail(order, statusUrl) {
  const amountPaid = order.invoice?.amountDueNow ?? order.totals.total;
  const body =
    header('Payment Received', `Thank you, ${order.customer.name.split(' ')[0]}.`) +
    lede(`We've received your payment of <strong style="color:${COLORS.ink};">${fmtPrice(amountPaid)}</strong> for order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong>. We're now preparing it for dispatch. Keep this email as your official receipt.`) +
    receiptBlock(order) +
    ctaBlock(statusUrl, 'View Order Status') +
    bottomSpacer();
  return {
    subject: `Payment Received — Receipt for Order ${order.ref}`,
    html: shell(`Payment received for order ${order.ref} — your official receipt is attached below.`, body),
  };
}

export function orderDispatchedEmail(order, statusUrl) {
  const body =
    header('Order Dispatched', `On its way, ${order.customer.name.split(' ')[0]}.`) +
    row(
      COLORS.card,
      'padding:0 40px 18px;',
      `<div class="be-pad">${statusBadge('Dispatched', { bg: '#E9E6FB', color: '#4B3A9C', dot: '#6B52D6' })}</div>`
    ) +
    lede(`Order <strong style="color:${COLORS.ink};">${esc(order.ref)}</strong> has been dispatched. Thanks for choosing ${esc(SITE.name)}.`) +
    sectionLabel('Order Summary') +
    lineItemsTable(order.lines) +
    ctaBlock(statusUrl, 'View Order Status') +
    bottomSpacer();
  return {
    subject: `Order Dispatched — ${order.ref}`,
    html: shell(`Order ${order.ref} has been dispatched.`, body),
  };
}

// Admin's own copy when an order's status changes outside the settlement
// flow (paid / dispatched) -- same "always notify the sales desk" pattern
// as the new-order and tax-invoice sends.
export function adminStatusUpdateEmail(order, statusText, portalUrl) {
  const body =
    header('Order Updated', `${esc(order.ref)} marked ${statusText}`) +
    lede(`${esc(order.customer.name)} &middot; ${esc(order.customer.email)} &middot; ${fmtPrice(order.totals.total)}`) +
    ctaBlock(portalUrl, 'View in Admin Portal') +
    bottomSpacer();
  return {
    subject: `Order ${order.ref} marked ${statusText}`,
    html: shell(`Order ${order.ref} marked ${statusText}.`, body),
  };
}
