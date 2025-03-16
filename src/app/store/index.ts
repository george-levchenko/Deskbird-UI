import { ActionReducerMap } from '@ngrx/store';
import { usersReducer, UsersState } from './users/users.reducer';
import { UserEffects } from './users/users.effects';

export interface State {
  users: UsersState;
}

export const reducers: ActionReducerMap<State> = {
  users: usersReducer,
};

export const effects = [UserEffects];
