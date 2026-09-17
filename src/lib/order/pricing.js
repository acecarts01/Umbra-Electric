// Server-side order pricing -- mirrors CartView.jsx's math exactly, but
// resolves every price against PRODUCTS itself. A public, unauthenticated
// endpoint must never trust a client-supplied price or line total.
import { SITE, PRODUCTS, getProduct, fmtPrice } from '@/config/site';

export function computeOrderTotals(items, { paymentMethod, orderType } = {}) {
  const resolved = [];
  const unknownSlugs = [];
  for (const item of items) {
    const p = getProduct(item?.slug);
    if (!p) {
      unknownSlugs.push(item?.slug);
      continue;
    }
    const qty = Number(item.qty) > 0 ? Math.floor(Number(item.qty)) : 1;
    resolved.push({ slug: p.slug, name: p.name, price: p.price, qty, lineTotal: p.price * qty, category: p.category });
  }
  if (!resolved.length) return { error: 'No valid product slugs were provided.' };

  const subtotal = resolved.reduce((a, i) => a + i.lineTotal, 0);
  const accessorySub = resolved.reduce((a, i) => a + (i.category === 'gear-accessories' ? i.lineTotal : 0), 0);
  const bikeSub = subtotal - accessorySub;
  const hasBundle = accessorySub > 0 && bikeSub > 0;
  const bundleDiscount = hasBundle ? Math.round((bikeSub * SITE.bundleDiscountPct) / 100) : 0;
  const cryptoDiscount = paymentMethod === 'crypto' ? Math.round((subtotal * SITE.cryptoDiscountPct) / 100) : 0;
  const shipping = subtotal >= SITE.freeShipThreshold ? 0 : SITE.flatShip;
  const total = subtotal - cryptoDiscount - bundleDiscount + shipping;
  const depositAmount = orderType === 'deposit' ? Math.round((total * SITE.reservationDepositPct) / 100) : null;
  const meetsMinimumOrder = subtotal >= SITE.minOrder;

  return {
    lines: resolved.map(({ slug, name, price, qty, lineTotal }) => ({ slug, name, price, qty, lineTotal })),
    unknownSlugs,
    totals: { subtotal, bundleDiscount, cryptoDiscount, shipping, total, orderType: orderType === 'deposit' ? 'deposit' : 'full', depositAmount },
    meetsMinimumOrder,
  };
}

export { fmtPrice };
