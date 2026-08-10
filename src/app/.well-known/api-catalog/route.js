import { serveWellKnown } from '@/lib/wellKnown';

export function GET() {
  return serveWellKnown('api-catalog.json', 'application/linkset+json');
}
