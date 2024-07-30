import { createAction, props } from '@ngrx/store';

export const addUser = createAction(
  '[User] Add User',
  props<{ name: string; email: string; username: string }>()
);

export const updateUser = createAction(
  '[USER] updateUser',
  props<{ userId: string; name: string; email: string; username: string }>()
);

export const removeUser = createAction(
  '[USER] removeUser',
  props<{ id: string }>()
);

export const removeAllUsers = createAction('[USER] removeAllUsers');
