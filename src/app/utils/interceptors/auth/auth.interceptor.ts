import { inject } from '@angular/core';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);

  const token = authService.getSessionToken();
  let newReq = req;

  if (token) {
    newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
  }

  return next(newReq);
}
