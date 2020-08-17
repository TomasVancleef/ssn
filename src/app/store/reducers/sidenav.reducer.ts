import { AppState } from 'src/app/store/app.reducer';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import * as SidenavActions from '../actions/sidenav.actions';

export interface State {
  open: boolean;
}

export const initialState: State = {
  open: false,
};

const sidenavReducer = createReducer(
  initialState,
  on(SidenavActions.openSidenav, (state, action) => ({ open: true })),
  on(SidenavActions.closeSidenav, (state, action) => ({ open: false }))
);

export function reducer(state: State, action: Action) {
  return sidenavReducer(state, action);
}

export const selectSidenav = (state: AppState) => state.sidenav;

export const selectSidenavOpen = createSelector(selectSidenav, (state: State) => state.open);
