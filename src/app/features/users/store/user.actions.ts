import { createAction, props } from '@ngrx/store';
import { User } from '@users/models/user.interface';

export const addUser = createAction('[User] Add User', props<{ user: User }>());

export const updateUser = createAction(
  '[USER] updateUser',
  props<{ userId: string; updatedUser: User }>()
);

export const removeUser = createAction(
  '[USER] removeUser',
  props<{ id: string }>()
);

export const removeAllUsers = createAction('[USER] removeAllUsers');
