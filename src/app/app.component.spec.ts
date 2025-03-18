import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './utils/services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth/auth.actions';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    // Create spies for AuthService and Store
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isTokenExpired', 'getSessionToken', 'decodeToken']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch userLoginSuccess if token is not expired', () => {
      // Simulate a valid (not expired) token scenario.
      const token = 'sampleToken';
      const decodedToken = { username: 'testUser', isAdmin: true };
      authServiceSpy.isTokenExpired.and.returnValue(false);
      // Ensure the same token is returned on both calls.
      authServiceSpy.getSessionToken.and.returnValue(token);
      authServiceSpy.decodeToken.and.returnValue(decodedToken);

      component.ngOnInit();

      expect(storeSpy.dispatch).toHaveBeenCalledWith(
        AuthActions.userLoginSuccess({
          token,
          username: decodedToken.username,
          isAdmin: decodedToken.isAdmin,
        })
      );
    });

    it('should not dispatch any action if token is expired', () => {
      authServiceSpy.isTokenExpired.and.returnValue(true);

      component.ngOnInit();

      expect(storeSpy.dispatch).not.toHaveBeenCalled();
    });
  });
});
