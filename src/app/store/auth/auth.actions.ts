import { createAction, props } from '@ngrx/store';

export const userLogin = createAction('[Auth] User Login', props<{ username: string; password: string }>());
export const userLoginSuccess = createAction('[Auth] User Login Success', props<{ token: string; username: string; isAdmin: boolean }>());
export const userLoginError = createAction('[Auth] User Login Error', props<{ error: string }>());

export const userLogout = createAction('[Auth] Logout');
