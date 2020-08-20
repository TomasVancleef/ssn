import {
  switchMap,
  map,
  filter,
  last,
  withLatestFrom,
  concatMap,
} from 'rxjs/operators';
import { ChatsService } from './../../services/chats/chats.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as ChatsActions from '../actions/chats.actions';
import * as fromAuth from '../reducers/auth.reducer';

import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
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
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAuth.selectAuthUserUid))),
          switchMap(([action, uid]) =>
            this.chatsService.loadChats(uid).pipe(
              map((chats) => {
                return ChatsActions.loadChatsSuccess({ chats: chats });
              })
            )
          )
        )
      )
    )
  );
}
