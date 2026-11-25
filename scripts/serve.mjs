import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import speech from '../netlify/functions/speech.mjs';
try { loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const root = resolve(process.argv[2] || '.');
const port = Number(process.env.PORT || 5173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/.netlify/functions/speech') {
      const controller = new AbortController();
      req.once('aborted', () => controller.abort());
      res.once('close', () => { if (!res.writableEnded) controller.abort(); });
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method, headers: req.headers, signal: controller.signal,
        ...(req.method === 'POST' ? {body: Readable.toWeb(req), duplex: 'half'} : {}),
      });
      const response = await speech(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      if (response.body) Readable.fromWeb(response.body).on('error', () => res.destroy()).pipe(res);
      else res.end();
      return;
    }
    // Only expose the current static entry and future public assets.
    if (pathname !== '/' && pathname !== '/index.html' && !pathname.startsWith('/assets/') && !pathname.startsWith('/games/')) {
      res.writeHead(404); res.end('Not found'); return;
    }
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://localhost:${port}`));
