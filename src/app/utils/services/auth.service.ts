import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly jwtHelperService = inject(JwtHelperService);

  setSessionToken(token: string): void {
    if (token) {
      this.localStorageService.set('access_token', token);
    }
  }

  clearSessionToken(): void {
    this.localStorageService.remove('access_token');
  }

  getSessionToken(): string | null {
    return this.localStorageService.get('access_token');
  }

  decodeToken(token: string): { username: string; isAdmin: boolean } {
    return jwtDecode(token);
  }

  isTokenExpired(): boolean {
    const token = this.getSessionToken();
    return token ? this.jwtHelperService.isTokenExpired(token) : true;
  }
}
