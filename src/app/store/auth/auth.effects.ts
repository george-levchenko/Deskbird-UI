import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import * as AuthActions from './auth.actions';
import { AuthApiService } from '../../utils/services-api/auth-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../utils/services/auth.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApiService = inject(AuthApiService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  userLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.userLogin),
      exhaustMap(({ username, password }) =>
        this.authApiService.login({ username, password }).pipe(
          map(({ token }) => {
            const decodedToken = this.authService.decodeToken(token);
            return AuthActions.userLoginSuccess({ token, username: decodedToken?.username, isAdmin: decodedToken?.isAdmin });
          }),
          catchError(error => of(AuthActions.userLoginError(error)))
        )
      )
    );
  });

  userLoginSuccess$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.userLoginSuccess),
        tap(({ token }) => {
          this.authService.setSessionToken(token);
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  userLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.userLogout),
        tap(() => {
          this.authService.clearSessionToken();
          this.router.navigate(['/login']);
        })
      );
    },
    { dispatch: false }
  );
}
