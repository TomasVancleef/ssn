import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap, filter, catchError } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducer';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private angularFireStorage: AngularFireStorage,
    private angularFirestore: AngularFirestore,
    private store: Store
  ) {}

  updateAvatar(file: File): Observable<string> {
    return this.store.select(fromAuth.selectAuthUserUid).pipe(
      filter((uid) => uid != ''),
      switchMap((uid) =>
        this.uploadPhoto(file).pipe(
          switchMap((fileName) =>
            from(
              this.angularFirestore
                .collection('users')
                .doc(uid)
                .update({ photo: fileName })
            ).pipe(switchMap(() => this.getUserAvatar(fileName)))
          )
        )
      )
    );
  }

  uploadPhoto(file: File): Observable<string> {
    return this.store.select(fromAuth.selectAuthUserUid).pipe(
      switchMap((uid) =>
        from(
          this.angularFireStorage.upload(
            '/avatars/' + uid + '/avatar.png',
            file
          )
        ).pipe(map((result) => '/avatars/' + uid + '/avatar.png'))
      ),
      catchError((e) => of(''))
    );
  }

  getUserAvatar(fileName: string) {
    return this.angularFireStorage.ref(fileName).getDownloadURL();
  }

  getDefaultAvatar(): string {
    return '/avatars/avatar.png';
  }
}
