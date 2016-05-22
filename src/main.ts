import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode, provide } from '@angular/core';
import { EmsAppComponent, environment } from './app/';
import { ROUTER_PROVIDERS} from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy} from '@angular/common/index';
import { PageLoadingData } from './app/services/PageLoadingData';

if (environment.production) {
  enableProdMode();
}

bootstrap(EmsAppComponent, [ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(LocationStrategy, { useClass: PathLocationStrategy }),
  provide("PageLoadingData", { useClass: PageLoadingData })
]);
