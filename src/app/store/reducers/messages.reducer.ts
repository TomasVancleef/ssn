import { createReducer, on, Action } from '@ngrx/store';
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
    ...state,
    loading: true,
  })),
  on(MessagesActions.loadMessagesSuccess, (state, action) => ({
    ...state,
    loading: false,
    messages: state.messages.concat(action.messages),
  }))
);

export function reducer(state: State, action: Action) {
  return messagesReducer(state, action);
}
