import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';

// SSR deshabilitado. En lugar de prerender/SSR, la app se comporta como SPA normal.
export const config = mergeApplicationConfig(appConfig, {} as ApplicationConfig);

