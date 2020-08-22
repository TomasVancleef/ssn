import { ProfileService } from './../../services/profile/profile.service';
import { map, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProfileActions from '../actions/profile.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService
  ) {}

  setProfileEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.setProfile),
      switchMap((action) =>
        this.profileService
          .getProfile(action.uid)
          .pipe(
            map((profile) =>
              ProfileActions.setProfileSuccess({ profile: profile })
            )
          )
      )
    )
  );
}
