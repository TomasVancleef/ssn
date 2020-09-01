import { ImageService } from './../image/image.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Profile } from './../../model/profile';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private angularFirestore: AngularFirestore,
    private imageService: ImageService
  ) {}

  getProfile(uid: string): Observable<Profile> {
    return this.angularFirestore
      .collection('users')
      .doc(uid)
      .snapshotChanges()
      .pipe(
        switchMap((user) => {
          if (!user.payload.exists) {
            throw 'no user';
          }
          return this.imageService
            .getUserAvatar(user.payload.data()['photo'])
            .pipe(
              map((photoRef) => ({
                uid: uid,
                name: user.payload.data()['name'],
                photo: photoRef,
                birthday: user.payload.data()['birthday'],
              }))
            );
        })
      );
  }
}
