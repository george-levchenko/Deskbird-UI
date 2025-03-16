import { ActionReducerMap } from '@ngrx/store';
import { usersReducer, UsersState } from './users/users.reducer';
import { UserEffects } from './users/users.effects';
import { AuthEffects } from './auth/auth.effects';
import { authReducer, AuthState } from './auth/auth.reducer';

export interface State {
  users: UsersState;
  auth: AuthState;
}

export const reducers: ActionReducerMap<State> = {
  users: usersReducer,
  auth: authReducer,
};

export const effects = [UserEffects, AuthEffects];
