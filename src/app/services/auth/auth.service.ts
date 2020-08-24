import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImageService } from './../image/image.service';
import { switchMap, filter, map, take, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromAuth from '../../store/reducers/auth.reducer';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private imageService: ImageService,
    private angularFirestore: AngularFirestore,
    private matSnackBar: MatSnackBar,
    private store: Store
  ) {}

  login(email: string, password: string): Observable<User> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((authResult) => ({
          uid: authResult.user.uid,
          name: '',
          email: authResult.user.email,
          photo: '',
        }))
        .catch((e) => {
          this.matSnackBar.open(e.message, '', {
            duration: 3000,
          });
          return e;
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
        from(
          this.angularFirestore
            .collection('users')
            .doc(createUserResult.user.uid)
            .set({
              name: name,
              photo: this.imageService.getDefaultAvatar(),
            })
        ).pipe(
          map(() => ({
            uid: createUserResult.user.uid,
            name: '',
            email: createUserResult.user.email,
            photo: '',
          }))
        )
      )
    );
  }

  setUserData(): Observable<void> {
    return this.store.select(fromAuth.selectAuthUser).pipe(
      filter((user) => user.uid != ''),
      switchMap((user) =>
        from(
          this.angularFirestore
            .collection('users')
            .doc(user.uid)
            .set({ name: user.name })
        )
      )
    );
  }

  updateName(uid: string, name: string): Observable<void> {
    return from(
      this.angularFirestore.collection('users').doc(uid).update({ name: name })
    );
  }

  currentUser(): Observable<User> {
    return this.angularFireAuth.user.pipe(
      switchMap((fireUser) => {
        if (fireUser == null) {
          return of({
            uid: '',
            name: '',
            email: '',
            photo: '',
          });
        } else {
          let user = {
            uid: fireUser.uid,
            name: '',
            email: fireUser.email,
            photo: '',
          };

          return this.angularFirestore
            .collection('users')
            .doc(fireUser.uid)
            .valueChanges()
            .pipe(
              switchMap((userData) => {
                user.name = userData['name'];
                user.photo = userData['photo'];
                return this.imageService.getUserAvatar(user.photo).pipe(
                  map((ref) => {
                    user.photo = ref;
                    return user;
                  })
                );
              })
            );
        }
      })
    );
  }
}
