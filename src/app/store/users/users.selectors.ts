import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUserState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(selectUserState, (state: UsersState) => state.users);
export const selectUsersLoading = createSelector(selectUserState, (state: UsersState) => state.loading);
