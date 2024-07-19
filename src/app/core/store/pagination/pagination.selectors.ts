import { createFeatureSelector, createSelector } from '@ngrx/store';

import { PaginationState } from './pagination.interface';

const selectPaginationState =
  createFeatureSelector<PaginationState>('pagination');

export const selectCurrentPage = createSelector(
  selectPaginationState,
  state => state.currentPage
);
export const selectItemsPerPage = createSelector(
  selectPaginationState,
  state => state.itemsPerPage
);
