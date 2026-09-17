// Stateless signed order tokens -- the token, not the database, proves an
// order's contents. base64url(JSON payload).base64url(HMAC-SHA256(payload)),
// verified with a timing-safe comparison before any page trusts a byte of it.
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { secret } from './secret';

const b64u = (buf) => buf.toString('base64url');

export function signOrder(order) {
  const payload = b64u(Buffer.from(JSON.stringify(order), 'utf8'));
  const sig = b64u(createHmac('sha256', secret()).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyOrder(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let expected;
  try {
    expected = b64u(createHmac('sha256', secret()).update(payload).digest());
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const order = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!order.ref || !Array.isArray(order.lines)) return null;
    return order;
  } catch {
    return null;
  }
}

// The server is the ONLY generator of a ref -- a public, unauthenticated
// endpoint (order submission) must never accept a client-supplied one.
// 5 random bytes (10 hex chars) once ref is a database primary key: a 4-hex
// (2-byte) ref gave only 65,536 values/day, cheap enough to collide once
// persistence -- not just a display label -- was in play.
export function newOrderRef(now = new Date()) {
  const stamp = `${now.getFullYear().toString().slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `UE-${stamp}-${randomBytes(5).toString('hex').toUpperCase()}`;
}
