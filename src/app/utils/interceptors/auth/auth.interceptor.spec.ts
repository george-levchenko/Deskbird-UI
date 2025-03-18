import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHeaders, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    // Create a spy for AuthService with the getSessionToken method.
    const spy = jasmine.createSpyObj('AuthService', ['getSessionToken']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: spy }],
    });
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should add Authorization header if token exists', () => {
    TestBed.runInInjectionContext(() => {
      const token = 'dummyToken';
      authServiceSpy.getSessionToken.and.returnValue(token);
      // Create a dummy request with empty headers.
      const req = new HttpRequest('GET', '/test', { headers: new HttpHeaders() });

      // next function that asserts the header has been appended.
      const next = (newReq: HttpRequest<unknown>) => {
        expect(newReq.headers.get('Authorization')).toBe(`Bearer ${token}`);
        // Return a dummy HttpResponse to satisfy the expected return type.
        return of(new HttpResponse({ body: 'success' }));
      };

      authInterceptor(req, next).subscribe({
        next: (response: unknown) => {
          expect(response instanceof HttpResponse).toBeTrue();
          if (response instanceof HttpResponse) {
            expect(response.body).toBe('success');
          }
        },
        error: () => fail('Expected a successful response, not an error'),
      });
    });
  });

  it('should not modify the request if token does not exist', () => {
    TestBed.runInInjectionContext(() => {
      authServiceSpy.getSessionToken.and.returnValue(null);
      // Create a dummy request with empty headers.
      const req = new HttpRequest('GET', '/test', { headers: new HttpHeaders() });

      // next function that asserts the request is unchanged.
      const next = (newReq: HttpRequest<unknown>) => {
        // Expect that no Authorization header has been added.
        expect(newReq.headers.has('Authorization')).toBeFalse();
        // Return a dummy HttpResponse to satisfy the expected return type.
        return of(new HttpResponse({ body: 'success' }));
      };

      authInterceptor(req, next).subscribe({
        next: (response: unknown) => {
          expect(response instanceof HttpResponse).toBeTrue();
          if (response instanceof HttpResponse) {
            expect(response.body).toBe('success');
          }
        },
        error: () => fail('Expected a successful response, not an error'),
      });
    });
  });
});
