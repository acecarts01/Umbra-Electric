import { serveWellKnown } from '@/lib/wellKnown';

export function GET() {
  return serveWellKnown('oauth-protected-resource.json', 'application/json');
}
