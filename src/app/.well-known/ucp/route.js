import { serveWellKnown } from '@/lib/wellKnown';

export function GET() {
  return serveWellKnown('ucp.json', 'application/json');
}
