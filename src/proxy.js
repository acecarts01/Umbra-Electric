import { NextResponse } from 'next/server';
import { getMarkdownForPath } from '@/lib/agentMarkdown';

// Vercel Routing Middleware (WebForge Agent-Ready V5 — Markdown Negotiation).
// Serves markdown instead of HTML when the client's Accept header genuinely
// PREFERS text/markdown over text/html -- never a substring check. A real
// crawler sending "Accept: text/html, text/markdown;q=0.9" still prefers
// HTML (and the full page, with JSON-LD, that markdown extract doesn't
// have), so q-values must be parsed and compared, not just detected.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|css|js|mjs|txt|xml|json|woff2?)$).*)'],
};

function prefersMarkdownOverHtml(accept) {
  let mdQ = -1;
  let htmlQ = -1;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';').map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q);
    if (type === 'text/html') htmlQ = Math.max(htmlQ, q);
  }
  return mdQ > -1 && mdQ > htmlQ;
}

export default function proxy(request) {
  const accept = request.headers.get('accept') || '';
  if (!prefersMarkdownOverHtml(accept)) return NextResponse.next();

  const { pathname } = request.nextUrl;
  const markdown = getMarkdownForPath(pathname);
  if (!markdown) return NextResponse.next();

  return new NextResponse(markdown, {
    status: 200,
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
