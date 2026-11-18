import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const maxBytes = 8192;
export function createApp() {
  return createServer(async (req, res) => {
    const reply = (status, body) => {
      res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(JSON.stringify(body));
    };
    if (req.method === 'GET' && req.url === '/health') return reply(200, { ok: true });
    if (req.url !== '/api/contact') return reply(404, { error: 'Not found.' });
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return reply(405, { error: 'Use POST.' });
    }
    if (req.headers['content-type']?.split(';')[0].trim() !== 'application/json') {
      return reply(415, { error: 'Send JSON.' });
    }
    // Reject oversized payloads before parsing. Never log contact data.
    let bytes = 0;
    const chunks = [];
    try {
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > maxBytes) return reply(413, { error: 'Message is too large.' });
        chunks.push(chunk);
      }
      const data = JSON.parse(Buffer.concat(chunks).toString());
      if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, { error: 'Invalid form.' });
      const { name, email, message } = data;
      if (typeof name !== 'string' || !name.trim() || name.length > 100 ||
          typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          typeof message !== 'string' || !message.trim() || message.length > 2000) {
        return reply(400, { error: 'Enter a name, email address, and message (up to 2,000 characters).' });
      }
      return reply(200, { ok: true, receipt: randomUUID(), message: 'Demo request validated. No message was stored or emailed.' });
    } catch {
      return reply(400, { error: 'Invalid JSON.' });
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = createApp();
  server.listen(Number(process.env.PORT || 3001), '::', () => console.log('Form API listening'));
  process.on('SIGTERM', () => server.close());
}
