import { inject } from '@angular/core';
import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearSessionToken();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
