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
      .valueChanges()
      .pipe(
        switchMap((user) =>
          this.imageService.getUserAvatar(user['photo']).pipe(
            map((photoRef) => ({
              uid: uid,
              name: user['name'],
              photo: photoRef,
              birthday: user['birthday'],
            }))
          )
        )
      );
  }
}
