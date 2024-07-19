import { ActionReducerMap } from '@ngrx/store';

import { tasksReducerFn } from '@tasks/store/task.reducer';
import { usersReducerFn } from '@users/store/user.reducer';
import { paginationReducerFn } from '@core/store/pagination/pagination.reducer';

import { AppState } from './app.interface';

export const appReducer: ActionReducerMap<AppState> = {
  tasks: tasksReducerFn,
  users: usersReducerFn,
  pagination: paginationReducerFn,
};
