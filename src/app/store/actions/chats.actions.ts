import { Chat } from './../../model/chat';
import { createAction, props } from '@ngrx/store';

export const loadChats = createAction('load chats');
export const loadChatsSuccess = createAction(
  'load chats success',
  props<{ chats: Chat[] }>()
);

export const sendMessage = createAction(
  'send message',
  props<{ uid: string; receiverUid: string; message: string }>()
);

export const clearChats = createAction(' clear chats');
