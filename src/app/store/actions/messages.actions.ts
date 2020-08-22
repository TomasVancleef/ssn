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

export const sendMessage = createAction(
  'send message',
  props<{ message: Message }>()
);
export const sendMessageSuccess = createAction(
  'send message success',
  props<{ message: Message }>()
);

export const markMessagesAsViewed = createAction(
  'mart messages as viewed',
  props<{ uid: string; interlocutorUid: string }>()
);
