import { FriendsService } from './../../services/friends/friends.service';
import { map, switchMap } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as FriendsActions from '../actions/friends.actions';

@Injectable()
export class FriendsEffects {
  constructor(
    private actions$: Actions,
    private friendsService: FriendsService
  ) {}

  friendsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsActions.loadFriends),
      switchMap((action) =>
        this.friendsService.loadFriend(action.uid).pipe(
          map((friends) => {
            return FriendsActions.loadFriendsSuccess({ friends: friends });
          })
        )
      )
    )
  );
}
