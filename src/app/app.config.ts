import { ApplicationConfig, provideZoneChangeDetection, isDevMode, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngrx/store';
import { effects, reducers } from './store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import Material from '@primeng/themes/material';
import { MessageService } from 'primeng/api';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/interceptors/auth/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { errorInterceptor } from './utils/interceptors/error/error.interceptor';
import { AuthService } from './utils/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Material,
        options: { darkModeSelector: false },
      },
    }),
    provideStore(reducers),
    provideEffects(effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    MessageService,
    importProvidersFrom(
      JwtModule.forRoot({
        config: { tokenGetter: () => inject(AuthService).getSessionToken() },
      })
    ),
  ],
};
