import { Page } from './../../model/page';
import { createAction, props } from '@ngrx/store';

export const setPages = createAction('set pages');
export const setPagesSuccess = createAction(
  'set pages',
  props<{ pages: Page[] }>()
);
export const setActivePage = createAction(
  'set active page',
  props<{ page: Page }>()
);
