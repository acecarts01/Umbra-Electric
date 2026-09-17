import { SITE } from '@/config/site';

// Every email link (settlement terminal, pay page, order card) is built
// from this. Without the VERCEL_ENV === 'preview' branch, a Preview
// deployment would email out links pointing at the PRODUCTION domain --
// which doesn't have that branch's unmerged routes yet. Every link in every
// test email would 404 while the email itself sends successfully, which
// looks exactly like broken SMTP and wastes real debugging time chasing it.
export function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `https://${SITE.domain}`;
}
