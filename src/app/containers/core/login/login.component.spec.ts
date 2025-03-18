import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Injector, NO_ERRORS_SCHEMA, runInInjectionContext } from '@angular/core';
import { LoginComponent } from './login.component';
import { Store } from '@ngrx/store';
import { userLogin } from '../../../store/auth/auth.actions';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storeStub: {
    selectSignal: jasmine.Spy;
    dispatch: jasmine.Spy;
  };

  beforeEach(async () => {
    // Create a stub for the Store.
    // For this suite, authLoading returns false and authError returns null.
    storeStub = {
      selectSignal: jasmine.createSpy('selectSignal').and.callFake((selector: unknown) => {
        if (selector === selectAuthLoading) {
          return () => false;
        }
        if (selector === selectAuthError) {
          return () => null;
        }
        return () => null;
      }),
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeStub }],
      // Ignore unknown elements/directives (like p-card, p-floatlabel, etc.)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // ngOnInit will run here and set up the form
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty username and password', () => {
    expect(component.form).toBeDefined();
    const usernameControl = component.form.get('username');
    const passwordControl = component.form.get('password');
    expect(usernameControl?.value).toEqual('');
    expect(passwordControl?.value).toEqual('');
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should disable the submit button when the form is invalid', () => {
    // Query the submit button.
    // Depending on how primeng renders p-button, you might need to adjust the selector.
    const submitButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.submit-button button') || fixture.nativeElement.querySelector('.submit-button');
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    // Fill the form with valid values.
    component.form.patchValue({
      username: 'validUser',
      password: 'validPassword123',
    });
    fixture.detectChanges();

    const submitButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.submit-button button') || fixture.nativeElement.querySelector('.submit-button');
    expect(component.form.valid).toBeTrue();
    expect(submitButton.disabled).toBeFalse();
  });

  it('should dispatch userLogin action with form values on submit', () => {
    // Provide valid credentials.
    const credentials = { username: 'testuser', password: 'password123' };
    component.form.patchValue(credentials);
    expect(component.form.valid).toBeTrue();

    component.onSubmit();

    expect(storeStub.dispatch).toHaveBeenCalledWith(userLogin(credentials));
  });
});

describe('LoginComponent - with auth error', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let storeStub: {
    selectSignal: jasmine.Spy;
    dispatch: jasmine.Spy;
  };

  beforeEach(async () => {
    // Simulate that the authError signal returns a truthy value.
    storeStub = {
      selectSignal: jasmine.createSpy('selectSignal').and.callFake((selector: unknown) => {
        if (selector === selectAuthLoading) {
          return () => false;
        }
        if (selector === selectAuthError) {
          return () => 'Invalid credentials';
        }
        return () => null;
      }),
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [{ provide: Store, useValue: storeStub }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    // Use the root injector to provide an injection context
    const injector = TestBed.inject(Injector);
    runInInjectionContext(injector, () => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  });

  it('should set form errors when authError signal is truthy', fakeAsync(() => {
    // Allow microtasks to flush (the effect will run in the proper injection context).
    tick();
    fixture.detectChanges();
    expect(component.form.errors).toEqual({ unauthenticated: true });
  }));
});
