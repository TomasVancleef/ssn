import { ImageService } from './../../services/image/image.service';
import { Injectable } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import { switchMap, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as SidenavActions from '../actions/sidenav.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  userLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password)
      )
    )
  );

  userLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login_success),
        tap(() => this.router.navigate(['home']))
      ),
    { dispatch: false }
  );

  userLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => this.authService.logout())
    )
  );

  userLogoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout_success),
        tap(() => {
          this.store.dispatch(SidenavActions.closeSidenav());
          this.router.navigate(['login']);
        })
      ),
    { dispatch: false }
  );

  userAutoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.auto_login),
      switchMap(() => this.authService.autoLogin())
    )
  );

  userRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration),
      switchMap((action) =>
        this.authService.registration(
          action.name,
          action.email,
          action.password
        )
      )
    )
  );

  userRegistrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration_success),
      switchMap((action) => this.authService.autoLogin())
    )
  );

  changeAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.change_avatar),
      switchMap((action) => this.authService.updateAvatar(action.file))
    )
  );
}
