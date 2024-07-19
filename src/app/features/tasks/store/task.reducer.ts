import { v4 as uuidv4 } from 'uuid';

import { createReducer, on } from '@ngrx/store';

import {
  addTask,
  markTaskAsCompleted,
  removeTask,
  unmarkTaskAsCompleted,
  updateTask,
} from './task.actions';

import { initialStateTasks } from '@data';
import { Task } from '@tasks/models/task.interface';

export const tasksReducerFn = createReducer(
  initialStateTasks,
  on(addTask, (state, { title, description, deadline }) => ({
    ...state,
    tasks: [
      ...state.tasks,
      { id: uuidv4(), title, description, deadline, isCompleted: false, createdAt: new Date() },
    ],
  })),
  on(removeTask, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
  })),
  on(updateTask, (state, { taskId, title, deadline, description }) => ({
    ...state,
    tasks: state.tasks.map((task: Task) =>
      task.id === taskId ? { ...task, title, deadline, description, updatedAt: new Date() } : task
    ),
  })),
  on(markTaskAsCompleted, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, isCompleted: true } : task
    ),
  })),
  on(unmarkTaskAsCompleted, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, isCompleted: false } : task
    ),
  }))
);
