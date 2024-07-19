import { createAction, props } from '@ngrx/store';

export const addTask = createAction(
  '[TASK] addTask',
  props<{ title: string; description: string; deadline: string }>()
);

export const updateTask = createAction(
  '[TASK] updateTask',
  props<{
    taskId: string;
    title: string;
    description: string;
    deadline: string;
  }>()
);

export const removeTask = createAction(
  '[TASK] removeTask',
  props<{ id: string }>()
);

export const markTaskAsCompleted = createAction(
  '[TASK] markTaskAsCompleted',
  props<{ id: string }>()
);

export const unmarkTaskAsCompleted = createAction(
  '[TASK] unmarkTaskAsCompleted',
  props<{ id: string }>()
);

// TODO: De aquí para abajo no harían falta ya que estos no modifican directamente el estado de las tareas.

export const selectTask = createAction(
  '[TASK] selectTask',
  props<{ id: string }>()
);

export const selectCompletedTasks = createAction(
  '[Task] Select Completed Tasks'
);

export const getUserForTask = createAction(
  '[Task] Get User for Task',
  props<{ taskId: string }>()
);

export const getTaskId = createAction(
  '[Task] Get Task ID',
  props<{ taskId: string }>()
);
