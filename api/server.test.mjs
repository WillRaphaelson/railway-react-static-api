import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from './server.mjs';

test('form contract rejects invalid input and never caches submissions', async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const post = body => fetch(`${url}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const valid = { name: 'Example Reader', email: 'reader@example.com', message: 'Please share more information about this example.' };
    const response = await post(JSON.stringify(valid));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.match(body.receipt, /^[\da-f-]{36}$/);
    assert.match(body.message, /No message was stored or emailed/);
    for (const payload of ['{', 'null', '[]', JSON.stringify({ ...valid, email: 'bad' }), JSON.stringify({ ...valid, message: '' })]) {
      assert.equal((await post(payload)).status, 400);
    }
    assert.equal((await post(JSON.stringify({ ...valid, message: 'x'.repeat(9000) }))).status, 413);
    assert.equal((await fetch(`${url}/api/contact`)).status, 405);
    assert.equal((await fetch(`${url}/api/unknown`)).status, 404);
    assert.equal((await fetch(`${url}/health`)).status, 200);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
