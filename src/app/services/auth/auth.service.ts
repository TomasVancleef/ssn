import { AngularFirestore } from '@angular/fire/firestore';
import { ImageService } from './../image/image.service';
import { switchMap, filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from, combineLatest } from 'rxjs';
import { User } from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private imageService: ImageService,
    private angularFirestore: AngularFirestore,
    private matSnackBar: MatSnackBar
  ) {}

  login(email: string, password: string): Observable<User> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((authResult) => authResult.user)
        .catch((e) => {
          let snackBarRef = this.matSnackBar.open(e.message, '', {
            duration: 3000,
          });
          return null;
        })
    );
  }

  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }

  registration(
    name: string,
    email: string,
    password: string
  ): Observable<User> {
    return from(
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      switchMap((createUserResult) =>
        this.angularFirestore
          .collection('default')
          .doc('avatar')
          .get()
          .pipe(
            switchMap((avatar) =>
              from(
                createUserResult.user.updateProfile({
                  displayName: name,
                  photoURL: avatar.data()['ref'],
                })
              ).pipe(
                switchMap((updateProfileResult) =>
                  this.setUserData().pipe(
                    switchMap(() =>
                      from(
                        this.angularFirestore
                          .collection('users')
                          .doc(createUserResult.user.uid)
                          .set({
                            name: createUserResult.user.displayName,
                            photo: avatar.data()['ref'],
                          })
                      ).pipe(map((res) => createUserResult.user))
                    )
                  )
                )
              )
            )
          )
      )
    );
  }

  setUserData(): Observable<void> {
    return this.currentUser().pipe(
      filter((user) => user != null),
      switchMap((user) =>
        from(
          this.angularFirestore
            .collection('users')
            .doc(user.uid)
            .set({ name: user.displayName })
        )
      )
    );
  }

  currentUser(): Observable<User> {
    return this.angularFireAuth.user;
  }

  updateAvatar(file: File): Observable<string> {
    return this.currentUser().pipe(
      filter((user) => user != null),
      switchMap((user) =>
        this.imageService.uploadPhoto(file).pipe(
          switchMap((ref) =>
            from(
              user.updateProfile({
                displayName: user.displayName,
                photoURL: ref,
              })
            ).pipe(
              switchMap(() =>
                from(
                  this.angularFirestore
                    .collection('users')
                    .doc(user.uid)
                    .update({ photo: ref })
                ).pipe(map(() => ref))
              )
            )
          )
        )
      )
    );
  }
}
