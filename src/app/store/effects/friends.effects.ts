import { Store } from '@ngrx/store';
import { FriendsService } from './../../services/friends/friends.service';
import { map, switchMap, filter, withLatestFrom } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as FriendsActions from '../actions/friends.actions';
import * as fromAuth from '../reducers/auth.reducer';

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
      switchMap((action) =>
        this.store.select(fromAuth.selectAuthUserUid).pipe(
          switchMap((uid) =>
            this.friendsService.loadFriend(uid).pipe(
              map((friends) => {
                return FriendsActions.loadFriendsSuccess({ friends: friends });
              })
            )
          )
        )
      )
    )
  );
}
