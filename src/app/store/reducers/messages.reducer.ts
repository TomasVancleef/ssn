import { AppState } from './../app.reducer';
import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { Message } from './../../model/message';
import * as MessagesActions from '../actions/messages.actions';

export interface State {
  messages: Message[];
  loading: boolean;
}

const initialState: State = {
  messages: [],
  loading: false,
};

const messagesReducer = createReducer(
  initialState,
  on(MessagesActions.loadMessages, (state, action) => ({
    messages: [],
    loading: true,
  })),
  on(MessagesActions.loadMessagesSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      messages: [].concat(action.messages).sort((a, b) => +b.date - +a.date),
    };
  })
);

export function reducer(state: State, action: Action) {
  return messagesReducer(state, action);
}

export const selectState = (state: AppState) => state.messages;
export const selectMessages = createSelector(
  selectState,
  (state) => state.messages
);

export const selectMessagesLoading = createSelector(
  selectState,
  (state) => state.loading
);
