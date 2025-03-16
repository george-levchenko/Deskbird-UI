import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  username: string | undefined;
  isAdmin: boolean;
  loading: boolean;
  error: string | undefined;
}

const initialState: AuthState = {
  username: undefined,
  isAdmin: false,
  loading: false,
  error: undefined,
};

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.userLogin,
    (state: AuthState): AuthState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    AuthActions.userLoginSuccess,
    (state: AuthState, { username, isAdmin }): AuthState => ({
      ...state,
      username,
      isAdmin,
      loading: false,
    })
  ),
  on(
    AuthActions.userLoginError,
    (state: AuthState, { error }): AuthState => ({
      ...state,
      error,
      loading: false,
    })
  ),
  on(
    AuthActions.userLogout,
    (): AuthState => ({
      ...initialState,
    })
  )
);
