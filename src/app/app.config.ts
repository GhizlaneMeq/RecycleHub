import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {requestsReducer} from "./state/requests/requests.reducer";
import { RequestsEffects } from './state/requests/requests.efeects';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideStore({requests:requestsReducer}),
    provideEffects([RequestsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};