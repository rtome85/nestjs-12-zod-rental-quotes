import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from '../src/app.js';

test('rejects invalid rental durations over HTTP', async (t) => {
  const app = await createApp();
  t.after(() => app.close());
  await app.listen(0, '127.0.0.1');

  const response = await fetch(`${await app.getUrl()}/rental-quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      equipment: 'projector',
      days: 0,
      email: 'alex@example.com',
    }),
  });

  assert.equal(response.status, 400);
  const body = await response.json() as { message: string[] };
  assert.ok(body.message.some((message) => message.startsWith('days:')));
});
