import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Task, TaskState } from '@tasks/models/task.interface';
import { User } from '@users/models/user.interface';
import { selectAllUsers } from '@users/store/user.selectors';

// Obtener el estado completo de las tareas
const selectTaskState = createFeatureSelector<TaskState>('tasks');

// Obtener todas las tareas
export const selectAllTasks = createSelector(
  selectTaskState,
  state => state?.tasks
);

// // Obtener todas las tareas completadas
export const selectCompletedTasks = createSelector(selectAllTasks, tasks =>
  tasks?.filter(task => task?.isCompleted)
);

// Obtener una tarea en particular
export const selectTaskById = (taskId: string) =>
  createSelector(selectAllTasks, tasks =>
    tasks?.find(task => task?.id === taskId)
  );

// Obtener el ID de una tarea en particular
export const selectTaskId = (taskId: string) => taskId;

// Obtener el usuario a cargo de una tarea
export const selectUserForTask = (taskId: string) =>
  createSelector(
    selectAllTasks,
    selectAllUsers,
    (tasks: Task[], users: User[]) => {
      const task = tasks?.find(t => t?.id === taskId);
      return task ? users?.find((user: User) => user?.id === task?.userID) : null;
    }
  );
