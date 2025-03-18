import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const dummyRequest = new HttpRequest('GET', '/test');

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['clearSessionToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should pass through successful responses unchanged', () => {
    TestBed.runInInjectionContext(() => {
      const next = () => of(new HttpResponse({ body: 'success' }));
      errorInterceptor(dummyRequest, next).subscribe({
        next: response => {
          expect(response instanceof HttpResponse).toBeTrue();
          if (response instanceof HttpResponse) {
            expect(response.body).toBe('success');
          }
        },
        error: () => fail('Expected a successful response, not an error'),
      });
    });
  });

  it('should clear the session token and navigate to /login on 401 error', done => {
    TestBed.runInInjectionContext(() => {
      const errorResponse = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });
      const next = () => throwError(() => errorResponse);

      errorInterceptor(dummyRequest, next).subscribe({
        next: () => fail('Expected an error response, not success'),
        error: (error: HttpErrorResponse) => {
          expect(authServiceSpy.clearSessionToken).toHaveBeenCalled();
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });

  it('should not clear the session token or navigate on non-401 error', done => {
    TestBed.runInInjectionContext(() => {
      const errorResponse = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });
      const next = () => throwError(() => errorResponse);

      errorInterceptor(dummyRequest, next).subscribe({
        next: () => fail('Expected an error response, not success'),
        error: (error: HttpErrorResponse) => {
          expect(authServiceSpy.clearSessionToken).not.toHaveBeenCalled();
          expect(routerSpy.navigate).not.toHaveBeenCalled();
          expect(error).toBe(errorResponse);
          done();
        },
      });
    });
  });
});
