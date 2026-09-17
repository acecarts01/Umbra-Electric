// Passphrase -> signed cookie, no session store. One passphrase, one admin
// cookie -- matches the scale of a single sales-desk login.
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { secret } from './secret';

export const ADMIN_COOKIE = 'ue_admin';
const TTL_MS = 12 * 60 * 60 * 1000;

function sign(exp) {
  return createHmac('sha256', secret()).update(`admin:${exp}`).digest('base64url');
}

export function issueAdminCookie() {
  const exp = Date.now() + TTL_MS;
  return { value: `${exp}.${sign(exp)}`, expires: new Date(exp) };
}

export function verifyAdminCookie(value) {
  if (!value) return false;
  const [expStr, sig] = value.split('.');
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminRequest() {
  const jar = await cookies();
  return verifyAdminCookie(jar.get(ADMIN_COOKIE)?.value);
}
