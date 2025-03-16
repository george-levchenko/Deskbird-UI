import { createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import * as UsersActions from './users.actions';

export interface UsersState {
  users: User[];
  loading: boolean;
}

const initialState: UsersState = {
  users: [],
  loading: false,
};

export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsers, (state: UsersState): UsersState => ({ ...state, loading: true })),
  on(
    UsersActions.loadUsersSuccess,
    (state: UsersState, { users }): UsersState => ({
      ...state,
      users,
      loading: false,
    })
  ),
  on(
    UsersActions.addUserSuccess,
    (state: UsersState, { user }): UsersState => ({
      ...state,
      users: [...state.users, user],
    })
  ),
  on(
    UsersActions.updateUserSuccess,
    (state: UsersState, { user }): UsersState => ({
      ...state,
      users: state.users.map((u: User) => (u.id === user.id ? user : u)),
    })
  ),
  on(
    UsersActions.deleteUserSuccess,
    (state: UsersState, { id }): UsersState => ({
      ...state,
      users: state.users.filter((u: User) => u.id !== id),
    })
  )
);
