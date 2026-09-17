// Every signed order token and admin cookie is HMAC'd with this secret.
// Reject at first use rather than silently signing with an empty/short
// value -- a short secret makes every signature guessable.
let cached = null;

export function secret() {
  if (cached) return cached;
  const s = process.env.ORDER_SIGNING_SECRET;
  if (!s || s.length < 16) {
    throw new Error('ORDER_SIGNING_SECRET is missing or shorter than 16 characters. Set it in Vercel Project Settings -> Environment Variables.');
  }
  cached = s;
  return cached;
}
