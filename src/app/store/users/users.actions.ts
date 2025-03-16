import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

export const loadUsers = createAction('[Users] Load Users');
export const loadUsersSuccess = createAction('[Users] Load Users Success', props<{ users: User[] }>());

export const addUser = createAction('[Users] Add User', props<{ user: User }>());
export const addUserSuccess = createAction('[Users] Add User Success', props<{ user: User }>());

export const updateUser = createAction('[Users] Update User', props<{ user: User }>());
export const updateUserSuccess = createAction('[Users] Update User Success', props<{ user: User }>());

export const deleteUser = createAction('[Users] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[Users] Delete User Success', props<{ id: string }>());
