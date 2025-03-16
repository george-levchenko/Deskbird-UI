import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUsername = createSelector(selectAuthState, (state: AuthState) => state.username);
export const selectIsAdmin = createSelector(selectAuthState, (state: AuthState) => state.isAdmin);
export const selectAuthLoading = createSelector(selectAuthState, (state: AuthState) => state.loading);
export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);
