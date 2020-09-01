import { ImageService } from './../image/image.service';
import { Friend } from './../../model/friend';
import { Observable, of, forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(
    private angularFirestore: AngularFirestore,
    private imageService: ImageService
  ) {}

  loadFriend(uid: string): Observable<Friend[]> {
    if (uid == '') {
      return of([]);
    }
    return this.angularFirestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        switchMap((users) => {
          return forkJoin(
            users
              .filter((u) => u.payload.doc.id != uid)
              .map((user) => {
                let userData = user.payload.doc.data();
                return this.imageService.getUserAvatar(userData['photo']).pipe(
                  map((ref) => ({
                    uid: user.payload.doc.id,
                    name: userData['name'],
                    birthday: userData['birthday'],
                    myFriend: false,
                    photo: ref,
                  }))
                );
              })
          );
        })
      );
  }
}
