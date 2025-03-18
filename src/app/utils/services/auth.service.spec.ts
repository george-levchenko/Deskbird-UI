import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as jwtDecodeModule from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let jwtHelperServiceSpy: jasmine.SpyObj<JwtHelperService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', ['set', 'get', 'remove']);
    const jwtHelperSpy = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired']);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: LocalStorageService, useValue: localStorageSpy }, { provide: JwtHelperService, useValue: jwtHelperSpy }],
    });
    service = TestBed.inject(AuthService);
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
    jwtHelperServiceSpy = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
  });

  describe('setSessionToken', () => {
    it('should set the token in local storage if a token is provided', () => {
      const token = 'sampleToken';
      service.setSessionToken(token);
      expect(localStorageServiceSpy.set).toHaveBeenCalledWith('access_token', token);
    });

    it('should not set the token if an empty string is provided', () => {
      service.setSessionToken('');
      expect(localStorageServiceSpy.set).not.toHaveBeenCalled();
    });
  });

  describe('clearSessionToken', () => {
    it('should remove the token from local storage', () => {
      service.clearSessionToken();
      expect(localStorageServiceSpy.remove).toHaveBeenCalledWith('access_token');
    });
  });

  describe('getSessionToken', () => {
    it('should return the token from local storage', () => {
      localStorageServiceSpy.get.and.returnValue('storedToken');
      expect(service.getSessionToken()).toBe('storedToken');
    });
  });

  describe('decodeToken', () => {
    it('should decode the token using jwtDecode', () => {
      const fakeToken = 'fakeToken';
      const decoded = { username: 'testUser', isAdmin: false };
      spyOn(jwtDecodeModule, 'jwtDecode').and.returnValue(decoded);

      const result = service.decodeToken(fakeToken);
      expect(result).toEqual(decoded);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no token exists', () => {
      localStorageServiceSpy.get.and.returnValue(null);
      expect(service.isTokenExpired()).toBeTrue();
    });

    it('should delegate to jwtHelperService.isTokenExpired when a token exists', () => {
      const token = 'sampleToken';
      localStorageServiceSpy.get.and.returnValue(token);
      jwtHelperServiceSpy.isTokenExpired.and.returnValue(Promise.resolve(false));

      const result = service.isTokenExpired();
      expect(jwtHelperServiceSpy.isTokenExpired).toHaveBeenCalledWith(Promise.resolve(token));
      expect(result).toBeFalse();
    });
  });
});
