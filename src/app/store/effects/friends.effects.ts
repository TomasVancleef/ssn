import { AuthService } from './../../services/auth/auth.service';
import { FriendsService } from './../../services/friends/friends.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as FriendsActions from '../actions/friends.actions';

@Injectable()
export class FriendsEffects {
  constructor(
    private actions$: Actions,
    private friendsService: FriendsService,
    private authService: AuthService,
  ) {}

  friendsLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FriendsActions.loadFriends),
      switchMap((action) =>
        this.authService.currentUser()
          .pipe(
            filter((user) => user != null),
            switchMap((user) =>
              this.friendsService
                .loadFriend(user.uid)
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
