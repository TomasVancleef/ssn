import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from './../../components/login/login.component';
import { ImageService } from './../../services/image/image.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from '../actions/auth.actions';
import {
  switchMap,
  map,
  tap,
  filter,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import * as SidenavActions from '../actions/sidenav.actions';
import * as FriendsActions from '../actions/friends.actions';
import * as ChatsActions from '../actions/chats.actions';
import * as fromAuth from '../reducers/auth.reducer';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private imageService: ImageService,
    private matSnackBar: MatSnackBar
  ) {}

  userLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          filter((user) => user.uid != ''),
          map((user) => {
            if (user.verified) {
              this.router.navigate(['/chats']);
              return AuthActions.login_success(user);
            } else {
              this.router.navigate(['/verify_email']);
              return AuthActions.login_success(user);
            }
          }),
          catchError((e) => {
            this.matSnackBar.open(e.message, '', {
              duration: 3000,
            });
            return of(e).pipe(map(() => AuthActions.login_failed()));
          })
        )
      )
    )
  );

  userLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login_success),
        tap((action) => {
          this.store.dispatch(ChatsActions.loadChats());
          this.store.dispatch(FriendsActions.loadFriends());
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
          map((user) => {
            if (user.uid != '' && user.verified) {
              return AuthActions.auto_login_success(user);
            } else {
              return AuthActions.login_failed();
            }
          })
        )
      )
    )
  );

  autoLoginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.auto_login_success),
        tap(() => {
          this.store.dispatch(ChatsActions.loadChats());
          this.store.dispatch(FriendsActions.loadFriends());
          if (
            this.router.url == '/login' ||
            this.router.url == '/registration'
          ) {
            this.router.navigate(['/chats']);
          }
        })
      ),
    { dispatch: false }
  );

  userRegistration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration),
      switchMap((action) =>
        this.authService
          .registration(action.name, action.email, action.password)
          .pipe(
            map((user) => {
              this.router.navigate(['/verify-email']);
              return AuthActions.registration_success({
                email: action.email,
                password: action.password,
              });
            })
          )
      )
    )
  );

  userRegistrationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registration_success),
      switchMap((action) =>
        this.authService
          .currentUser()
          .pipe(map((user) => AuthActions.login_success(user)))
      )
    )
  );

  changeAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.change_avatar),
      withLatestFrom(this.store.select(fromAuth.selectAuthUserUid)),
      filter(([action, uid]) => uid != ''),
      switchMap(([action, uid]) =>
        this.imageService
          .updateAvatar(uid, action.file)
          .pipe(map((ref) => AuthActions.change_avatar_success({ ref: ref })))
      )
    )
  );

  changeName$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.change_name),
        withLatestFrom(this.store.select(fromAuth.selectAuthUserUid)),
        filter(([action, uid]) => uid != ''),
        switchMap(([action, uid]) =>
          this.authService
            .updateName(uid, action.name)
            .pipe(
              map(() => AuthActions.change_name_success({ name: action.name }))
            )
        )
      ),
    { dispatch: false }
  );
}
