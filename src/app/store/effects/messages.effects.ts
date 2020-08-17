import { AuthService } from './../../services/auth/auth.service';
import { MessagesService } from './../../services/messages/messages.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as MessagesActions from '../actions/messages.actions';

@Injectable()
export class MessagesEffects {
  constructor(
    private actions$: Actions,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {}

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      switchMap((action) =>
        this.authService.currentUser().pipe(
          filter((user) => user != null),
          switchMap((user) =>
            this.messagesService
              .loadMessages(user.uid, action.interlocutorUid)
              .pipe(
                map((messages) =>
                  MessagesActions.loadMessagesSuccess({ messages: messages })
                )
              )
          )
        )
      )
    )
  );
}
