import { Friend } from './../../model/friend';
import { User } from './../../model/user';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadFriend(uid): Observable<Friend[]> {
    return this.angularFirestore
      .collection('users')
      .snapshotChanges()
      .pipe(
        map((users) =>
          users
            .map(
              (user) =>
                new Friend({
                  uid: user.payload.doc.id,
                  name: user.payload.doc.data()['name'],
                })
            )
            .filter((user) => user.uid != uid)
        )
      );
  }
}
