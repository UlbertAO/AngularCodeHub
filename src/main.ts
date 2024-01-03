/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AppConfigService } from './app/core/services/app-config.service';

function bootstrapApp(): void {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.log(err));
}

document.addEventListener('DOMContentLoaded', () => {
  // We bootstraping app from browser, we need fetch config.json.
  fetch(AppConfigService.configPath)
    .then((response) => {
      return response.json();
    })
    .then((jsonData) => {
      sessionStorage[AppConfigService.configPath] = JSON.stringify(jsonData);
      bootstrapApp();
    })
    .catch((err) => {
      console.warn('caught when bootstrapping app');
      console.error(err);
    });
});
