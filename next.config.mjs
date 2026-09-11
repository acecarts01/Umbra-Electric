// CSP is scoped to this site's actual external dependencies -- Tawk (live
// chat widget + its websocket) and Web3Forms (contact/order form submit).
// 'unsafe-inline' is required for script-src/style-src because the app has
// no nonce infrastructure (inline <Script> for Tawk bootstrap, and React
// inline style={{}} attributes throughout) -- a nonce-based CSP would need
// per-request middleware to thread a nonce into every inline script/style,
// which is a larger architecture change than this pass covers.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://embed.tawk.to",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com https://*.tawk.to wss://*.tawk.to",
  "frame-src https://*.tawk.to",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.web3forms.com",
  "frame-ancestors 'self'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: CSP },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
