import { AppState } from 'src/app/store/app.reducer';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { Chat } from './../../model/chat';

import * as ChatsActions from '../actions/chats.actions';

export interface State {
  loading: boolean;
  chats: Chat[];
  empty: boolean;
  unviewedMessagesNumber: number;
}

const initialState: State = {
  loading: false,
  chats: [],
  empty: false,
  unviewedMessagesNumber: 0,
};

const chatsReducer = createReducer(
  initialState,
  on(ChatsActions.loadChats, (state, action) => ({
    ...state,
    chats: [],
    loading: true,
    empty: false,
    unviewedMessagesNumber: 0,
  })),
  on(ChatsActions.loadChatsSuccess, (state, action) => ({
    ...state,
    chats: action.chats,
    loading: false,
    empty: action.chats.length == 0,
    unviewedMessagesNumber: action.unviewedMessagesNumber,
  })),
  on(ChatsActions.clearChats, (state, action) => initialState)
);

export function reducer(state: State, action: Action) {
  return chatsReducer(state, action);
}

export const selectChatsState = (state: AppState) => state.chats;
export const selectChats = createSelector(
  selectChatsState,
  (state) => state.chats
);

export const selectChatsLoading = createSelector(
  selectChatsState,
  (state) => state.loading
);

export const selectChatsEmpty = createSelector(
  selectChatsState,
  (state) => state.empty
);

export const selectChatsUnviewedMessagesNumber = createSelector(
  selectChatsState,
  (state) => state.unviewedMessagesNumber
);
