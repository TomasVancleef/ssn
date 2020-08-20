import { FriendsService } from './../../services/friends/friends.service';
import {
  map,
  switchMap,
  filter,
  withLatestFrom,
  concatMap,
} from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as FriendsActions from '../actions/friends.actions';
import * as fromAuth from '../reducers/auth.reducer';

import { Store } from '@ngrx/store';
import { of } from 'rxjs';

@Injectable()
export class FriendsEffects {
  constructor(
    private actions$: Actions,
    private friendsService: FriendsService,
    private store: Store
  ) {}

  friendsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsActions.loadFriends),
      concatMap((action) =>
        of(action).pipe(
          withLatestFrom(this.store.select(fromAuth.selectAuthUserUid)),
          switchMap(([action, uid]) =>
            this.friendsService
              .loadFriend(uid)
              .pipe(
                map((friends) =>
                  FriendsActions.loadFriendsSuccess({ friends: friends })
                )
              )
          )
        )
      )
    )
  );
}
