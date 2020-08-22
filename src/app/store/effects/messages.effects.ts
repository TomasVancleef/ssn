import { Store } from '@ngrx/store';
import { MessagesService } from './../../services/messages/messages.service';
import { map, switchMap, withLatestFrom, concatMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as MessagesActions from '../actions/messages.actions';
import * as fromAuth from '../reducers/auth.reducer';
import { of } from 'rxjs';

@Injectable()
export class MessagesEffects {
  uid: string;

  constructor(
    private actions$: Actions,
    private messagesService: MessagesService,
    private store: Store
  ) {}

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAuth.selectAuthUserUid))
        )
      ),
      switchMap(([action, uid]) =>
        this.messagesService.loadMessages(uid, action.interlocutorUid).pipe(
          map((messages) => {
            return MessagesActions.loadMessagesSuccess({ messages: messages });
          })
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.sendMessage),
      switchMap((action) => {
        return this.messagesService
          .sendMessage(action.message)
          .pipe(
            map((message) =>
              MessagesActions.sendMessageSuccess({ message: message })
            )
          );
      })
    )
  );
}
