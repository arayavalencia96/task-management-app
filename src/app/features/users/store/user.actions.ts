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

// TODO: De aquí para abajo no harían falta ya que estos no modifican directamente el estado de los usuarios.

export const selectUser = createAction(
  '[User] Select User',
  props<{ userId: string }>()
);

export const getTasksForUser = createAction(
  '[User] Get Tasks for User',
  props<{ userId: string }>()
);

export const getUserId = createAction(
  '[User] Get User ID',
  props<{ userId: string }>()
);
