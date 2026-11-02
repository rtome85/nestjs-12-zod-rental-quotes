import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import type { INestApplication } from '@nestjs/common';
import { createApp } from '../src/app.js';

let app: INestApplication;
let baseUrl: string;

before(async () => {
  app = await createApp();
  await app.listen(0, '127.0.0.1');
  baseUrl = await app.getUrl();
});

after(async () => {
  await app?.close();
});

const validRequest = {
  equipment: 'projector',
  days: 3,
  quantity: 2,
  email: 'alex@example.com',
};

function quote(body: unknown) {
  return fetch(`${baseUrl}/rental-quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('rejects a zero-day rental before calculating a quote', async () => {
  const response = await quote({ ...validRequest, days: 0 });
  assert.equal(response.status, 400);
  const body = await response.json() as { message: string[] };
  assert.ok(body.message.some((message) => message.startsWith('days:')));
});

test('defaults omitted quantity to one before calculating the total', async () => {
  const { quantity, ...request } = validRequest;
  const response = await quote(request);
  assert.equal(response.status, 200);
  const body = await response.json() as { quantity: number; totalCents: number };
  assert.equal(body.quantity, 1);
  assert.equal(body.totalCents, 3500 * 3);
});

test('rejects client-supplied price fields', async () => {
  const response = await quote({ ...validRequest, totalCents: 1 });
  assert.equal(response.status, 400);
  const body = await response.json() as { message: string[] };
  assert.ok(body.message.some((message) => message.includes('Unrecognized key')));
});

const invalidRequests: Array<[string, unknown]> = [
  ['a negative rental duration', { ...validRequest, days: -1 }],
  ['a fractional rental duration', { ...validRequest, days: 1.5 }],
  ['a duration above the supported maximum', { ...validRequest, days: 15 }],
  ['a numeric string instead of a JSON number', { ...validRequest, days: '3' }],
  ['zero items', { ...validRequest, quantity: 0 }],
  ['a fractional item count', { ...validRequest, quantity: 1.5 }],
  ['too many items', { ...validRequest, quantity: 6 }],
  ['an unsupported equipment type', { ...validRequest, equipment: 'camera' }],
  ['an invalid email address', { ...validRequest, email: 'not-an-email' }],
  ['a missing email address', { equipment: 'speaker', days: 1 }],
  ['an empty object', {}],
  ['an array instead of an object', []],
];

for (const [description, request] of invalidRequests) {
  test(`rejects ${description}`, async () => {
    const response = await quote(request);
    assert.equal(response.status, 400);
    const body = await response.json() as { statusCode: number; message: string[] };
    assert.equal(body.statusCode, 400);
    assert.ok(Array.isArray(body.message));
  });
}

test('accepts the maximum supported quantity and duration', async () => {
  const response = await quote({ ...validRequest, equipment: 'speaker', days: 14, quantity: 5 });
  assert.equal(response.status, 200);
  const body = await response.json() as { totalCents: number };
  assert.equal(body.totalCents, 2000 * 14 * 5);
});

test('rejects malformed JSON', async () => {
  const response = await fetch(`${baseUrl}/rental-quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{',
  });
  assert.equal(response.status, 400);
});

test('calculates a quote using server-owned daily prices', async () => {
  const response = await quote(validRequest);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    equipment: 'projector',
    days: 3,
    quantity: 2,
    email: 'alex@example.com',
    currency: 'EUR',
    totalCents: 3500 * 3 * 2,
  });
});
