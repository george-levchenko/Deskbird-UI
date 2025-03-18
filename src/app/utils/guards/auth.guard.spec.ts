import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let isAuthenticatedValue: boolean;

  // Create a stub for the store with a selectSignal method.
  const storeStub = {
    selectSignal: jasmine.createSpy('selectSignal').and.callFake(() => {
      // Return a function that returns the desired isAuthenticated value.
      return () => isAuthenticatedValue;
    }),
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isTokenExpired']);
    // Default authentication value. This can be modified per test.
    isAuthenticatedValue = true;

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Store, useValue: storeStub },
      ],
    });
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should allow activation when authenticated and token is not expired', () => {
    isAuthenticatedValue = true;
    authServiceSpy.isTokenExpired.and.returnValue(false);

    const result = authGuard.canActivate();
    expect(result).toBe(true);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and navigate to /login when not authenticated', () => {
    isAuthenticatedValue = false;
    // Even if the token is valid, lack of authentication should block activation.
    authServiceSpy.isTokenExpired.and.returnValue(false);

    const result = authGuard.canActivate();
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should block activation and navigate to /login when token is expired', () => {
    isAuthenticatedValue = true;
    authServiceSpy.isTokenExpired.and.returnValue(true);

    const result = authGuard.canActivate();
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
