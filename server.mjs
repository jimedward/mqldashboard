import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const allowed = new Set(['index.html', 'styles.css', 'app.js']);
createServer(async (req, res) => {
  try {
    const path = new URL(req.url, 'http://localhost').pathname;
    const file = path === '/' ? 'index.html' : path.slice(1);
    if (!allowed.has(file)) { res.writeHead(404); res.end('Not found'); return; }
    const body = await readFile(resolve(root, file));
    res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' }[extname(file)] + '; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { res.writeHead(500); res.end('Unable to load the dashboard'); }
}).listen(port, '127.0.0.1', () => console.log(`Dashboard ready: http://localhost:${port}`));
