import { ImageService } from './../image/image.service';
import { switchMap, filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, from } from 'rxjs';
import { Action } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private imageService: ImageService
  ) {}

  login(email: string, password: string): Observable<Action> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((authResult) =>
          AuthActions.login_success({
            uid: authResult.user.uid,
            name: authResult.user.displayName,
            email: authResult.user.email,
            photo: authResult.user.photoURL,
          })
        )
        .catch((e) => AuthActions.login_failed())
    );
  }

  logout(): Observable<Action> {
    return from(
      this.angularFireAuth
        .signOut()
        .then(() => AuthActions.logout_success())
        .catch((e) => AuthActions.logout_failed())
    );
  }

  registration(
    name: string,
    email: string,
    password: string
  ): Observable<Action> {
    return from(
      this.angularFireAuth
        .createUserWithEmailAndPassword(email, password)
        .then((result) =>
          result.user.updateProfile({ displayName: name }).then((result) =>
            AuthActions.registration_success({
              email: email,
              password: password,
            })
          )
        )
        .catch((e) => AuthActions.registration_failed())
    );
  }

  autoLogin(): Observable<Action> {
    return this.angularFireAuth.authState.pipe(
      filter((user) => user != null),
      map((user) =>
        AuthActions.login_success({
          name: user.displayName,
          uid: user.uid,
          email: user.email,
          photo: user.photoURL ?? 'https://firebasestorage.googleapis.com/v0/b/cosmo-chat-bf694.appspot.com/o/avatars%2F-C3JhGfgsIg.jpg?alt=media&token=9749bbbb-ede3-42df-9619-b68fe461b161',
        })
      )
    );
  }

  updateAvatar(file: File): Observable<Action> {
    return this.angularFireAuth.authState.pipe(
      filter(user => user != null),
      switchMap((user) =>
        this.imageService
          .uploadPhoto(file, user.uid)
          .pipe(
            switchMap((ref) =>
              from(
                user.updateProfile({
                  displayName: user.displayName,
                  photoURL: ref,
                })
              ).pipe(map(() => AuthActions.change_avatar_success({ ref: ref })))
            )
          )
      )
    );
  }
}
