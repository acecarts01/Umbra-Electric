// Public, unauthenticated, fire-and-forget. Called (not awaited) alongside
// the existing Web3Forms submission on the Contact/Wholesale forms so the
// admin portal has enquiries to list -- never allowed to affect that
// existing, working send path if it fails.
import { NextResponse } from 'next/server';
import { insertEnquiry } from '@/lib/order/db';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  const { formType, name, email, phone, message, ...rest } = body || {};
  if (!formType || !name) return NextResponse.json({ success: false }, { status: 400 });

  try {
    await insertEnquiry({
      formType: String(formType).slice(0, 60),
      name: String(name).slice(0, 200),
      email: email ? String(email).slice(0, 200) : null,
      phone: phone ? String(phone).slice(0, 60) : null,
      message: message ? String(message).slice(0, 2000) : null,
      payload: rest,
    });
  } catch (e) {
    console.error('[enquiries/create] DB write failed:', e.message);
  }
  return NextResponse.json({ success: true });
}
