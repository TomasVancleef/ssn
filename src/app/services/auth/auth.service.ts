import { Store } from '@ngrx/store';
import { AngularFirestore } from '@angular/fire/firestore';
import { ImageService } from './../image/image.service';
import { switchMap, filter, map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of, combineLatest, from } from 'rxjs';
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
    private store: Store
  ) {}

  login(email: string, password: string): Observable<User> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((authResult) => {
          return {
            uid: authResult.user.uid,
            name: '',
            email: authResult.user.email,
            photo: '',
            verified: authResult.user.emailVerified,
          };
        })
    );
  }

  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }

  sendEmailVerify() {
    return this.angularFireAuth.user.pipe(
      take(1),
      filter((user) => user != null),
      map((user) =>
        user.sendEmailVerification({
          url: 'https://smart-social-network.web.app',
        })
      )
    );
  }

  registration(
    name: string,
    email: string,
    password: string
  ): Observable<[void, User]> {
    return from(
      this.angularFireAuth.createUserWithEmailAndPassword(email, password)
    ).pipe(
      switchMap((createUserResult) =>
        combineLatest(
          from(
            createUserResult.user.sendEmailVerification({
              url: 'https://smart-social-network.web.app',
            })
          ),
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
            verified: false,
          });
        } else {
          let user = {
            uid: fireUser.uid,
            name: '',
            email: fireUser.email,
            photo: '',
            verified: fireUser.emailVerified,
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
