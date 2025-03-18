import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
      // This token has payload {"username":"testUser","isAdmin":false}
      const fakeToken = 'eyJhbGciOiJub25lIn0.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaXNBZG1pbiI6ZmFsc2V9.';
      const expectedDecoded = { username: 'testUser', isAdmin: false };

      const result = service.decodeToken(fakeToken);
      expect(result).toEqual(expectedDecoded);
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
      // @ts-expect-error no-error
      jwtHelperServiceSpy.isTokenExpired.and.returnValue(false);

      const result = service.isTokenExpired();
      // @ts-expect-error no-error
      expect(jwtHelperServiceSpy.isTokenExpired).toHaveBeenCalledWith(token);
      expect(result).toBeFalse();
    });
  });
});
