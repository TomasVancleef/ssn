import { map, switchMap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Store, Action } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as fromAuth from '../../store/reducers/auth.reducer';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private angularFireStorage: AngularFireStorage,
    private store: Store
  ) {}

  uploadPhoto(file: File): Observable<string> {
    return this.store
      .select(fromAuth.selectAuthUserUid)
      .pipe(
        switchMap((uid) =>
          from(
            this.angularFireStorage.upload(
              '/avatars/' + uid + '/avatar.png',
              file
            )
          ).pipe(switchMap((result) => from(result.ref.getDownloadURL())))
        )
      );
  }
}
