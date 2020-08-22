import * as fromAuth from './reducers/auth.reducer';
import * as fromSidenav from './reducers/sidenav.reducer';
import * as fromChats from './reducers/chats.reducer';
import * as fromFriends from './reducers/friends.reducer';
import * as fromMessages from './reducers/messages.reducer';
import * as fromProfile from './reducers/profile.reducer';

import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  auth: fromAuth.State;
  sidenav: fromSidenav.State;
  chats: fromChats.State;
  friends: fromFriends.State;
  messages: fromMessages.State;
  profile: fromProfile.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.reducer,
  sidenav: fromSidenav.reducer,
  chats: fromChats.reducer,
  friends: fromFriends.reducer,
  messages: fromMessages.reducer,
  profile: fromProfile.reducer,
};
