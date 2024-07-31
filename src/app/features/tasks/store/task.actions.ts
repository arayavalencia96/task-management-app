import { createAction, props } from '@ngrx/store';

export const addTask = createAction(
  '[TASK] addTask',
  props<{
    title: string;
    description: string;
    userID?: string;
    deadline: string;
  }>()
);

export const updateTask = createAction(
  '[TASK] updateTask',
  props<{
    taskId: string;
    title: string;
    description: string;
    userID?: string;
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

export const selectCompletedTasks = createAction(
  '[Task] Select Completed Tasks'
);
