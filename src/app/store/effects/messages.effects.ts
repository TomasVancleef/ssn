import { Store } from '@ngrx/store';
import { MessagesService } from './../../services/messages/messages.service';
import {
  map,
  switchMap,
  withLatestFrom,
  concatMap,
  filter,
  delay,
} from 'rxjs/operators';
import { createEffect, Actions, ofType, act } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as MessagesActions from '../actions/messages.actions';
import * as fromAuth from '../reducers/auth.reducer';
import * as fromRouterStore from '@ngrx/router-store';
import { of } from 'rxjs';

@Injectable()
export class MessagesEffects {
  uid: string;

  constructor(
    private actions$: Actions,
    private messagesService: MessagesService,
    private store: Store
  ) {}

  routeLoadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRouterStore.routerNavigatedAction),
      map((action) => {
        let route = action.payload.routerState.root.children[0];
        return { url: route?.url[0]?.path, uid: route?.params['id'] };
      }),
      filter((route) => route.url == 'messages'),
      map((route) =>
        MessagesActions.loadMessages({
          interlocutorUid: route.uid,
        })
      )
    )
  );

  routeMarkMessagesAsViewed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRouterStore.routerNavigatedAction),
      map((action) => {
        let route = action.payload.routerState.root.children[0];
        return { url: route?.url[0]?.path, uid: route?.params['id'] };
      }),
      filter((route) => route.url == 'messages'),
      switchMap((route) =>
        of(route).pipe(
          delay(3000),
          map(() => {
            return MessagesActions.markMessagesAsViewed({
              interlocutorUid: route.uid,
            });
          })
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.loadMessages),
      switchMap((action) =>
        this.store.select(fromAuth.selectAuthUserUid).pipe(
          filter((uid) => uid != ''),
          switchMap((uid) =>
            this.messagesService.loadMessages(uid, action.interlocutorUid).pipe(
              map((messages) => {
                return MessagesActions.loadMessagesSuccess({
                  messages: messages,
                });
              })
            )
          )
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

  markMessagesAsViewed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.markMessagesAsViewed),
      switchMap((action) =>
        this.store.select(fromAuth.selectAuthUserUid).pipe(
          filter((uid) => uid != ''),
          switchMap((uid) => {
            return this.messagesService
              .markMessagesAsViewed(uid, action.interlocutorUid)
              .pipe(map(() => MessagesActions.markMessagesAsViewedSuccess()));
          })
        )
      )
    )
  );
}
