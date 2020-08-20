import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as SidenavActions from '../actions/sidenav.actions';
import * as FriendsActions from '../actions/friends.actions';
import * as ChatsActions from '../actions/chats.actions';
import { combineLatest } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private angularFirestore: AngularFirestore
  ) {}

  userLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          filter((user) => user != null),
          map((user) =>
            AuthActions.login_success({
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
            })
          )
        )
      )
    )
  );

  userLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login_success),
        tap((action) => {
          this.store.dispatch(ChatsActions.loadChats({ uid: action.uid }));
          this.store.dispatch(FriendsActions.loadFriends({ uid: action.uid }));

          this.router.navigate(['home/chats']);
        })
      ),
    { dispatch: false }
  );

  userLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(map(() => AuthActions.logout_success()))
      )
    )
  );

  userLogoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout_success),
        tap(() => {
          this.store.dispatch(SidenavActions.closeSidenav());
          this.store.dispatch(FriendsActions.clearFriends());
          this.store.dispatch(ChatsActions.clearChats());
          this.router.navigate(['login']);
        })
      ),
    { dispatch: false }
  );

  userAutoLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.auto_login),
      switchMap(() =>
        this.authService.currentUser().pipe(
          filter((user) => user != null),
          map((user) =>
            AuthActions.login_success({
              name: user.displayName,
              uid: user.uid,
              email: user.email,
              photo: user.photoURL,
            })
          )
        )
      )
    )
  );

  userRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration),
      switchMap((action) =>
        this.authService
          .registration(action.name, action.email, action.password)
          .pipe(
            map((user) =>
              AuthActions.registration_success({
                email: action.email,
                password: action.password,
              })
            )
          )
      )
    )
  );

  userRegistrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration_success),
      switchMap((action) =>
        this.authService.currentUser().pipe(
          switchMap((user) =>
            this.angularFirestore
              .collection('default')
              .doc('avatar')
              .get()
              .pipe(
                map((avatar) =>
                  AuthActions.login_success({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email,
                    photo: user.photoURL,
                  })
                )
              )
          )
        )
      )
    )
  );

  changeAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.change_avatar),
      switchMap((action) =>
        this.authService
          .updateAvatar(action.file)
          .pipe(map((ref) => AuthActions.change_avatar_success({ ref: ref })))
      )
    )
  );
}
