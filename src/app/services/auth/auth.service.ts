import { AngularFirestore } from '@angular/fire/firestore';
import { ChatsService } from './../chats/chats.service';
import { ImageService } from './../image/image.service';
import { switchMap, filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private imageService: ImageService,
    private chatsService: ChatsService,
    private angularFirestore: AngularFirestore
  ) {}

  login(email: string, password: string): Observable<User> {
    return from(
      this.angularFireAuth
        .signInWithEmailAndPassword(email, password)
        .then((authResult) => authResult.user)
        .catch((e) => e)
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
        from(createUserResult.user.updateProfile({ displayName: name })).pipe(
          switchMap((updateProfileResult) =>
            this.setUserData().pipe(map(() => createUserResult.user))
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

  autoLogin(): Observable<User> {
    return this.currentUser().pipe(filter((user) => user != null));
  }

  currentUser(): Observable<User> {
    return this.angularFireAuth.user.pipe();
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
            ).pipe(map(() => ref))
          )
        )
      )
    );
  }
}
