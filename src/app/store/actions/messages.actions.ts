import { Message } from './../../model/message';
import { createAction, props } from '@ngrx/store';

export const loadMessages = createAction('load messages', props<{interlocutorUid: string}>());
export const loadMessagesSuccess = createAction('load messages success', props<{messages: Message[]}>());
