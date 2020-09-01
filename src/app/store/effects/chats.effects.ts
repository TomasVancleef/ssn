import { Store } from '@ngrx/store';
import {
  switchMap,
  map,
  filter,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import { ChatsService } from './../../services/chats/chats.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as ChatsActions from '../actions/chats.actions';
import * as fromAuth from '../reducers/auth.reducer';

import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class ChatsEffects {
  constructor(
    private actions$: Actions,
    private chatsService: ChatsService,
    private store: Store
  ) {}

  loadChats = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatsActions.loadChats),
      switchMap((action) =>
        this.store.select(fromAuth.selectAuthUserUid).pipe(
          switchMap((uid) =>
            this.chatsService.loadChats(uid).pipe(
              switchMap((chats) =>
                this.chatsService.getUnviewedMessagesNumber(uid).pipe(
                  map((unviewedMessagesNumber) =>
                    ChatsActions.loadChatsSuccess({
                      chats: chats,
                      unviewedMessagesNumber: unviewedMessagesNumber,
                    })
                  ),
                  catchError((e, caught) => caught)
                )
              )
            )
          )
        )
      )
    )
  );
}
