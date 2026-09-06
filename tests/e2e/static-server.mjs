import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist');
const config = JSON.parse(readFileSync(join(root, 'staticwebapp.config.json'), 'utf8'));
const port = Number(process.env.PORT ?? 4173);

const mime = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp', '.xml': 'application/xml; charset=utf-8'
};

function pagePath(pathname) {
  if (pathname === '/') return '/index.html';
  if (pathname === '/demo' || pathname === '/demo/') return '/demo/index.html';
  if (pathname === '/privacy' || pathname === '/privacy/') return '/privacy/index.html';
  if (pathname === '/terms' || pathname === '/terms/') return '/terms/index.html';
  return pathname;
}

function responseHeaders(pathname) {
  const headers = { ...config.globalHeaders };
  if (pathname.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  if (pathname === '/sw.js') headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  return headers;
}

createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname); }
  catch { pathname = '/404.html'; }
  const requested = pagePath(pathname);
  const candidate = normalize(join(root, requested));
  const insideRoot = candidate === root || candidate.startsWith(`${root}/`);
  const exists = insideRoot && existsSync(candidate) && statSync(candidate).isFile();
  const file = exists ? candidate : join(root, '404.html');
  const status = exists ? 200 : 404;
  const headers = responseHeaders(requested);
  headers['Content-Type'] = mime[extname(file)] ?? 'application/octet-stream';
  response.writeHead(status, headers);
  if (request.method === 'HEAD') return response.end();
  createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1');
