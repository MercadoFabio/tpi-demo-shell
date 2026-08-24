import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('declares a Node SSR entrypoint', async () => {
  const angularConfig = await readFile(new URL('../angular.json', import.meta.url), 'utf8');
  const serverMain = await readFile(new URL('../src/main.server.ts', import.meta.url), 'utf8');

  assert.match(angularConfig, /"server": "src\/main\.server\.ts"/);
  assert.match(angularConfig, /"entry": "src\/server\.ts"/);
  assert.match(serverMain, /bootstrapApplication/);
});

test('uses a fixed internal BFF target during SSR and forwards only the session cookie', async () => {
  const interceptor = await readFile(new URL('../src/app/ssr-api.interceptor.ts', import.meta.url), 'utf8');

  assert.match(interceptor, /http:\/\/bff:8080/);
  assert.match(interceptor, /__Host-tpi-session/);
  assert.doesNotMatch(interceptor, /request\.headers\.get\('cookie'\)\s*\?\?/);
  assert.match(interceptor, /request\.url\.startsWith\('\/api\/v1\/'\)/);
});

test('uses checked-in local feature packages and the shared UI kit', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  const styles = await readFile(new URL('../src/styles.scss', import.meta.url), 'utf8');

  assert.match(packageJson.dependencies['@mercadofabio/usuarios-lib'], /^file:/);
  assert.match(packageJson.dependencies['@mercadofabio/productos-lib'], /^file:/);
  assert.match(packageJson.dependencies['@tpi-demo/ui-kit'], /^file:/);
  assert.match(styles, /@tpi-demo\/ui-kit\/styles\.css/);
});
