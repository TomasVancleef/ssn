import { createAction, props } from '@ngrx/store';

export const sendMessage = createAction('send message', props<{uid: string, receiverUid: string, message: string}>());
