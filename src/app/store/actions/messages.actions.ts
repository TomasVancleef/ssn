import { Message } from './../../model/message';
import { createAction, props } from '@ngrx/store';

export const loadMessages = createAction(
  'load messages',
  props<{ interlocutorUid: string }>()
);
export const loadMessagesSuccess = createAction(
  'load messages success',
  props<{ messages: Message[] }>()
);

export const loadMessagesFailed = createAction('load messages failed');

export const sendMessage = createAction(
  'send message',
  props<{ message: Message }>()
);
export const sendMessageSuccess = createAction(
  'send message success',
  props<{ uid: string; message: Message }>()
);

export const markMessagesAsViewed = createAction(
  'mark messages as viewed',
  props<{ interlocutorUid: string }>()
);

export const markMessagesAsViewedSuccess = createAction(
  'mark messages as viewed success'
);
