import { AppState } from 'src/app/store/app.reducer';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { Chat } from './../../model/chat';

import * as ChatsActions from '../actions/chats.actions';

export interface State {
  loading: boolean;
  chats: Chat[];
}

const initialState: State = {
  loading: false,
  chats: [],
};

const chatsReducer = createReducer(
  initialState,
  on(ChatsActions.loadChats, (state, action) => ({
    ...state,
    loading: true,
  })),
  on(ChatsActions.loadChatsSuccess, (state, action) => ({
    ...state,
    chats: state.chats.concat(action.chats),
    loading: false,
  }))
);

export function reducer(state: State, action: Action) {
  return chatsReducer(state, action);
}

export const selectChatsState = (state: AppState) => state.chats;
export const selectChats = createSelector(selectChatsState, state => state.chats);
