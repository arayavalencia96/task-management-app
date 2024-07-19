import { createReducer, on } from '@ngrx/store';

import { setPage } from './pagination.actions';

import { initialStatePagination } from '@data';

export const paginationReducerFn = createReducer(
  initialStatePagination,
  on(setPage, (state, { page }) => ({ ...state, currentPage: page }))
);
