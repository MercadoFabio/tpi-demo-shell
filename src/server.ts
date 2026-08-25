import { ɵdestroyAngularServerApp, ɵgetOrCreateAngularServerApp, ɵsetAngularAppEngineManifest, ɵsetAngularAppManifest } from '@angular/ssr';
import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import bootstrap from './main.server';

const browserDistFolder = resolve(import.meta.dirname, '../browser');

const getIndexHtml = () => {
  const serverHtml = resolve(browserDistFolder, '../server/index.server.html');
  if (existsSync(serverHtml)) return readFileSync(serverHtml, 'utf-8');
  const csrHtml = resolve(browserDistFolder, 'index.csr.html');
  if (existsSync(csrHtml)) return readFileSync(csrHtml, 'utf-8');
  const indexHtml = resolve(browserDistFolder, 'index.html');
  return existsSync(indexHtml) ? readFileSync(indexHtml, 'utf-8') : '<!DOCTYPE html><html><head></head><body><app-root></app-root></body></html>';
};

try {
  ɵsetAngularAppEngineManifest({
    basePath: '/',
    allowedHosts: ['*'],
    supportedLocales: { 'en-US': '' },
    entryPoints: {
      '': () => Promise.resolve({ default: bootstrap, ɵgetOrCreateAngularServerApp, ɵdestroyAngularServerApp })
    }
  });

  ɵsetAngularAppManifest({
    bootstrap: () => Promise.resolve(bootstrap as any),
    inlineCriticalCss: false,
    baseHref: '/',
    assets: {
      'index.server.html': {
        size: 1000,
        hash: 'index',
        text: () => Promise.resolve(getIndexHtml())
      }
    }
  });
} catch {}

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.static(browserDistFolder, { index: false, maxAge: '1y', redirect: false }));
app.use((request, response, next) => {
  angularApp.handle(request)
    .then((ssrResponse) => ssrResponse ? writeResponseToNodeResponse(ssrResponse, response) : next())
    .catch(next);
});
app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('SSR error:', _error);
  if (!response.headersSent) {
    response.status(500).send('Unexpected server error');
  }
});

if (isMainModule(import.meta.url)) {
  app.listen(process.env['PORT'] || 4000);
}

export const reqHandler = createNodeRequestHandler(app);
