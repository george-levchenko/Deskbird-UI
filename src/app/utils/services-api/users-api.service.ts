import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User, UserSimplified } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/users';

  getUsers(): Observable<User[]> {
    // return this.http.get<User[]>(this.apiUrl);
    return of([
      { id: '1', username: 'George', password: '123456dsadasdsadsadadsadasda123456dsadasdsadsadadsadasdasdasdasdassdasdasdas', isAdmin: true },
      { id: '2', username: 'George2', password: '1234567', isAdmin: true },
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '3', username: 'VataVata', password: '1234565', isAdmin: false },
      { id: '4', username: 'Lalala', password: '1234563', isAdmin: false },
      { id: '5', username: 'Omgmgmgmg', password: '1234563', isAdmin: false },
    ]).pipe(delay(3000));
  }

  getUsersSimplified(): Observable<UserSimplified[]> {
    return this.http.get<User[]>(`${this.apiUrl}/simplified`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
