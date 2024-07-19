import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from '@users/models/user.interface';

// Obtener el estado completo de los usuarios
export const selectUserState = createFeatureSelector<UserState>('users');

// Obtener todas los usuarios
export const selectAllUsers = createSelector(
  selectUserState,
  state => state.users
);

// Obtener un usuario
export const selectUserById = (userID: string) =>
  createSelector(selectAllUsers, users =>
    users.find(user => user.id === userID)
  );

// Obtener el ID de una tarea en particular
export const selectUserId = (userID: string) => userID;

// Obtener todas las tareas del usuario seleccionado
export const selectTasksForUser = (userID: string) =>
  createSelector(selectUserById(userID), user => user?.tasks || []);
