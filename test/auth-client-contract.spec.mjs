import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('uses same-origin auth routes without browser token storage', async () => {
  const source = await readFile(new URL('../src/app/auth.service.ts', import.meta.url), 'utf8');

  assert.match(source, /post<SessionResponse>\('\/api\/v1\/auth\/login'/);
  assert.match(source, /post<void>\('\/api\/v1\/auth\/logout'/);
  assert.match(source, /__Host-tpi-csrf/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|Authorization/);
});
