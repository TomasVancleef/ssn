import { switchMap, map } from 'rxjs/operators';
import { ChatsService } from './../../services/chats/chats.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as ChatsActions from '../actions/chats.actions';

import { Injectable } from '@angular/core';

@Injectable()
export class ChatsEffects {
  constructor(private actions$: Actions, private chatsService: ChatsService) {}

  loadChats = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatsActions.loadChats),
      switchMap((action) =>
        this.chatsService.loadChats(action.uid).pipe(
          map((chats) => {
            return ChatsActions.loadChatsSuccess({ chats: chats });
          })
        )
      )
    )
  );
}
