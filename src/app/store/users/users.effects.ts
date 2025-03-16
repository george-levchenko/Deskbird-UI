import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import * as UsersActions from './users.actions';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { UsersApiService } from '../../utils/services-api/users-api.service';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly usersApiService = inject(UsersApiService);
  private readonly messageService = inject(MessageService);

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      exhaustMap(() =>
        this.usersApiService.getUsers().pipe(
          map((users: User[]) => UsersActions.loadUsersSuccess({ users })),
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: 'Load Users Failed', detail: error.message });
            return of(error);
          })
        )
      )
    );
  });

  addUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.addUser),
      exhaustMap(({ user }) =>
        this.usersApiService.addUser(user).pipe(
          map((newUser: User) => UsersActions.addUserSuccess({ user: newUser })),
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: 'Create User Failed', detail: error.message });
            return of(error);
          })
        )
      )
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.updateUser),
      exhaustMap(({ user }) =>
        this.usersApiService.updateUser(user).pipe(
          map((updatedUser: User) => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: 'Update User Failed', detail: error.message });
            return of(error);
          })
        )
      )
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      exhaustMap(({ id }) =>
        this.usersApiService.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError(error => {
            this.messageService.add({ severity: 'error', summary: 'Delete User Failed', detail: error.message });
            return of(error);
          })
        )
      )
    );
  });
}
