import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { userLogout } from '../../../store/auth/auth.actions';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let storeStub: {
    selectSignal: jasmine.Spy;
    dispatch: jasmine.Spy;
  };

  beforeEach(async () => {
    // Create a stub for the Store with a selectSignal that returns a function (signal)
    storeStub = {
      selectSignal: jasmine.createSpy('selectSignal').and.returnValue(() => 'TestUser'),
      dispatch: jasmine.createSpy('dispatch'),
    };

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: Store, useValue: storeStub }],
      // Use NO_ERRORS_SCHEMA to ignore unknown attributes/directives (like pTooltip, ngSrc)
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the username from the store signal', () => {
    // Since the signal is a function, call it and expect the value returned to be 'TestUser'
    expect(component.username()).toEqual('TestUser');
  });

  it('should dispatch the logout action when logout() is called', () => {
    component.logout();
    expect(storeStub.dispatch).toHaveBeenCalledWith(userLogout());
  });

  it('should dispatch logout action when logout icon is clicked', () => {
    const logoutIcon: HTMLElement = fixture.nativeElement.querySelector('.pi-sign-out');
    logoutIcon.click();
    expect(storeStub.dispatch).toHaveBeenCalledWith(userLogout());
  });

  it('should dispatch logout action when Enter key is pressed on logout icon', () => {
    const logoutIcon: HTMLElement = fixture.nativeElement.querySelector('.pi-sign-out');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    logoutIcon.dispatchEvent(event);
    expect(storeStub.dispatch).toHaveBeenCalledWith(userLogout());
  });

  it('should dispatch logout action when Space key is pressed on logout icon', () => {
    const logoutIcon: HTMLElement = fixture.nativeElement.querySelector('.pi-sign-out');
    // Using key ' ' for space. Adjust as needed based on how key detection is implemented.
    const event = new KeyboardEvent('keydown', { key: ' ' });
    logoutIcon.dispatchEvent(event);
    expect(storeStub.dispatch).toHaveBeenCalledWith(userLogout());
  });
});
