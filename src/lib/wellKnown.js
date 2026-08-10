import fs from 'fs';
import path from 'path';

// These 5 well-known files are extensionless. Two problems ruled out static
// serving from public/: (1) Vercel's static file server ignores custom
// Content-Type headers for extensionless files and always serves
// application/octet-stream, which breaks strict-typed agent/AI crawlers
// that gate JSON parsing on Content-Type; (2) even after adding a Route
// Handler at the same path to fix that, a same-named static file in
// public/ still won permission for the response somehow (confirmed via a
// direct production `next start` test -- Content-Type stayed
// octet-stream). So the generated source JSON now lives OUTSIDE public/, at
// src/data/well-known-generated/ -- there is no static file at the public
// URL for Next to prefer, only this Route Handler.
export function serveWellKnown(filename, contentType) {
  const filePath = path.join(process.cwd(), 'src/data/well-known-generated', filename);
  const body = fs.readFileSync(filePath, 'utf8');
  return new Response(body, {
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
