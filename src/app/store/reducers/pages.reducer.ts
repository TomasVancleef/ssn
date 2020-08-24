import { AppState } from 'src/app/store/app.reducer';
import { Page } from './../../model/page';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import * as PagesActions from '../actions/pages.actions';

export interface State {
  pages: Page[];
  activePage: Page;
}

const initialState: State = {
  pages: [
    {
      index: 0,
      route: '/chats',
      title: 'Сообщения',
      icon: 'message',
      alertsNumber: 0,
    },
    {
      index: 1,
      route: '/friends',
      title: 'Друзья',
      icon: 'group',
      alertsNumber: 0,
    },
    {
      index: 2,
      route: '/user',
      title: 'Профиль',
      icon: 'settings',
      alertsNumber: 0,
    },
  ],
  activePage: {
    index: 0,
    route: 'chats',
    title: 'Сообщения',
    icon: 'message',
    alertsNumber: 0,
  },
};

const pagesReducer = createReducer(
  initialState,
  on(PagesActions.setPagesSuccess, (state, action) => ({
    ...state,
    pages: action.pages,
  })),
  on(PagesActions.setActivePage, (state, action) => ({
    ...state,
    activePage: action.page ?? state.activePage,
  }))
);

export function reducer(state: State, action: Action) {
  return pagesReducer(state, action);
}

const selectState = (state: AppState) => state.pages;

export const selectPages = createSelector(selectState, (state) => state.pages);
export const selectActivePage = createSelector(
  selectState,
  (state) => state.activePage
);
