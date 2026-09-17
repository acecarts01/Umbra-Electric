import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { issueAdminCookie, ADMIN_COOKIE } from '@/lib/order/adminAuth';

export async function POST(request) {
  const { passphrase } = await request.json().catch(() => ({}));

  // Flat ~400ms delay before checking -- cheap brute-force friction without
  // needing rate-limit state, for a single-passphrase, single-admin login.
  await new Promise((r) => setTimeout(r, 400));

  const expected = process.env.ADMIN_PASSPHRASE;
  if (!expected || !passphrase || passphrase !== expected) {
    return NextResponse.json({ success: false, message: 'Incorrect passphrase.' }, { status: 401 });
  }

  const { value, expires } = issueAdminCookie();
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires,
  });
  return NextResponse.json({ success: true });
}
