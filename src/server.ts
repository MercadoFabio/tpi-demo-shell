import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { resolve } from 'node:path';

const app = express();
const browserDistFolder = resolve(import.meta.dirname, '../browser');
const angularApp = new AngularNodeAppEngine();

app.use(express.static(browserDistFolder, { index: false, maxAge: '1y', redirect: false }));
app.use((request, response, next) => {
  angularApp.handle(request)
    .then((ssrResponse) => ssrResponse ? writeResponseToNodeResponse(ssrResponse, response) : next())
    .catch(next);
});
app.use((_error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (!response.headersSent) {
    response.status(500).send('Unexpected server error');
  }
});

if (isMainModule(import.meta.url)) {
  app.listen(process.env['PORT'] || 4000);
}

export const reqHandler = createNodeRequestHandler(app);
