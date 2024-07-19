import { createAction, props } from '@ngrx/store';

export const setPage = createAction(
  '[Pagination] Set Page',
  props<{ page: number }>()
);
