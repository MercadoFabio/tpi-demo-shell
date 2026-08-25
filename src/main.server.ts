import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { serverConfig } from './app/app.config.server';

export default (context?: unknown) => bootstrapApplication(App, serverConfig, context as any);
