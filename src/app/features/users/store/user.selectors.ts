import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Task } from '@tasks/models/task.interface';
import { selectAllTasks } from '@tasks/store/task.selectors';

import { UserState } from '@users/models/user.interface';

// Obtener el estado completo de los usuarios
export const selectUserState = createFeatureSelector<UserState>('users');

// Obtener todas los usuarios
export const selectAllUsers = createSelector(
  selectUserState,
  state => state?.users
);

// Obtener un usuario
export const selectUserById = (userID: string) =>
  createSelector(selectAllUsers, users =>
    users?.find(user => user.id === userID)
  );

// Obtener el ID de una tarea en particular
export const selectUserId = (userID: string) => userID;

// Obtener todas las tareas para un usuario en particular
export const selectTasksForUser = (userId: string) =>
  createSelector(selectAllTasks, (tasks: Task[]) => {
    return tasks?.filter(task => task?.userID === userId);
  });
