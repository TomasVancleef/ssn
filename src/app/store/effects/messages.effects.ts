import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessagesService } from './../../services/messages/messages.service';
import {
  map,
  switchMap,
  withLatestFrom,
  concatMap,
  filter,
  delay,
  take,
  catchError,
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
    private store: Store,
    private router: Router
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
              }),
              catchError((e) =>
                of(e).pipe(
                  map(() => {
                    return MessagesActions.loadMessagesFailed();
                  })
                )
              )
            )
          )
        )
      )
    )
  );

  loadMessagesFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MessagesActions.loadMessagesFailed),
        map((action) => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
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

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.sendMessage),
      withLatestFrom(this.store.select(fromAuth.selectAuthUserUid)),
      switchMap(([action, uid]) => {
        return this.messagesService.sendMessage(uid, action.message).pipe(
          map((message) =>
            MessagesActions.sendMessageSuccess({
              uid,
              message: message,
            })
          )
        );
      })
    )
  );

  markMessagesAsViewed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessagesActions.markMessagesAsViewed),
      withLatestFrom(this.store.select(fromAuth.selectAuthUserUid)),
      filter(([action, uid]) => uid != ''),
      switchMap(([action, uid]) => {
        return this.messagesService
          .markMessagesAsViewed(uid, action.interlocutorUid)
          .pipe(map(() => MessagesActions.markMessagesAsViewedSuccess()));
      })
    )
  );
}
