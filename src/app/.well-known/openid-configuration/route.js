import { serveWellKnown } from '@/lib/wellKnown';

export function GET() {
  return serveWellKnown('openid-configuration.json', 'application/json');
}
