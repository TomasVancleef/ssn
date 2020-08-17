import * as fromAuth from './reducers/auth.reducer';
import * as fromSidenav from './reducers/sidenav.reducer';

import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuth.State,
  sidenav: fromSidenav.State,
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  sidenav: fromSidenav.reducer,
}
