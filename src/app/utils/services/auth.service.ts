import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly localStorageService = inject(LocalStorageService);

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

  // isTokenExpired(expiryTime: number): boolean {
  //   if (expiryTime) {
  //     return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
  //   } else {
  //     return false;
  //   }
  // }
}
