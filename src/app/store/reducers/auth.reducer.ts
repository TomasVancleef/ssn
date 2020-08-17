import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { User } from '../../model/user';

import * as AuthActions from '../actions/auth.actions';
import { AppState } from '../app.reducer';

export interface State {
  user: User;
  loggedIn: boolean;
  email: string;
  password: string;
}

export const initialState: State = {
  user: new User({ uid: '', name: '', email: '' }),
  loggedIn: false,
  email: '',
  password: '',
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state, action) => ({
    user: new User({ name: '', uid: '', email: '' }),
    email: action.email,
    password: action.password,
    loggedIn: false,
  })),
  on(AuthActions.login_success, (state, action) => ({
    user: new User({
      name: action.name,
      uid: action.uid,
      email: action.email,
      photo: action.photo,
    }),
    email: '',
    password: '',
    loggedIn: true,
  })),
  on(AuthActions.logout, (state) => ({
    user: new User({ name: '', uid: '', email: '' }),
    email: '',
    password: '',
    loggedIn: false,
  })),
  on(AuthActions.registration, (state, action) => ({
    user: new User({ name: action.name, uid: '', email: action.email }),
    email: action.email,
    password: action.password,
    loggedIn: false,
  })),
  on(AuthActions.change_avatar_success, (state, action) => ({
    ...state,
    user: new User({ ...state.user, photo: action.ref }),
  }))
);

export function reducer(state: State, action: Action) {
  return authReducer(state, action);
}

export const selectAuth = (state: AppState) => state.auth;

export const selectAuthUser = createSelector(
  selectAuth,
  (state: State) => state.user
);

export const selectAuthUserUid = createSelector(
  selectAuth,
  (state: State) => state.user.uid
);
