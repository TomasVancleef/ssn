import { AppState } from 'src/app/store/app.reducer';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { Friend } from './../../model/friend';
import * as FriendsActions from '../actions/friends.actions';

export interface State {
  loading: boolean;
  friends: Friend[];
}

export const initialState: State = {
  loading: false,
  friends: [],
};

const friendsReducer = createReducer(
  initialState,
  on(FriendsActions.loadFriends, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(FriendsActions.loadFriendsSuccess, (state, action) => ({
    ...state,
    loading: false,
    friends: state.friends.concat(action.friends),
  }))
);

export function reducer(state: State, action: Action) {
  return friendsReducer(state, action);
}

export const selectFriendsState = (state: AppState) => state.friends;
export const selectFriends = createSelector(selectFriendsState, (state) => state.friends);
