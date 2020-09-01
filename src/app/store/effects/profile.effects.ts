import { Router } from '@angular/router';
import { ProfileService } from './../../services/profile/profile.service';
import { map, switchMap, filter, catchError } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ProfileActions from '../actions/profile.actions';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class ProfileEffects {
  constructor(
    private actions$: Actions,
    private profileService: ProfileService,
    private router: Router
  ) {}

  setProfileEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.setProfile),
      filter((action) => action.uid != ''),
      switchMap((action) =>
        this.profileService.getProfile(action.uid).pipe(
          map((profile) =>
            ProfileActions.setProfileSuccess({ profile: profile })
          ),
          catchError((e) =>
            of(e).pipe(
              map(() => {
                return ProfileActions.setProfileFailed();
              })
            )
          )
        )
      )
    )
  );

  setProfileFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProfileActions.setProfileFailed),
        map((action) => {
          this.router.navigate(['/friends']);
        })
      ),
    { dispatch: false }
  );
}
