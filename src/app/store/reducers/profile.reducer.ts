import { AppState } from './../app.reducer';
import { Profile } from './../../model/profile';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import * as ProfileActions from '../actions/profile.actions';

export interface State {
  profile: Profile;
}

const initialState: State = {
  profile: {
    uid: '',
    name: '',
  },
};

const profileReducer = createReducer(
  initialState,
  on(ProfileActions.setProfile, (state, action) => ({
    profile: { name: '', uid: action.uid },
  })),
  on(ProfileActions.setProfileSuccess, (state, action) => ({
    profile: action.profile,
  }))
);

export function reducer(state: State, action: Action) {
  return profileReducer(state, action);
}

const selectState = (state: AppState) => state.profile;

export const selectProfile = createSelector(
  selectState,
  (state: State) => state.profile
);
