import { AuthService } from './../../services/auth/auth.service';
import { switchMap, map, filter } from 'rxjs/operators';
import { ChatsService } from './../../services/chats/chats.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as ChatsActions from '../actions/chats.actions';

import { Injectable } from '@angular/core';

@Injectable()
export class ChatsEffects {
  constructor(
    private actions$: Actions,
    private chatsService: ChatsService,
    private authService: AuthService
  ) {}

  loadChats = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatsActions.loadChats),
      switchMap((action) =>
        this.authService.currentUser().pipe(
          filter((user) => user != null),
          switchMap((user) =>
            this.chatsService
              .loadChats(user.uid)
              .pipe(
                map((chats) => ChatsActions.loadChatsSuccess({ chats: chats }))
              )
          )
        )
      )
    )
  );
}
