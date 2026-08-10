import { serveWellKnown } from '@/lib/wellKnown';

export function GET() {
  return serveWellKnown('oauth-authorization-server.json', 'application/json');
}
