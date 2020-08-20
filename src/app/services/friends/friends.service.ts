import { Friend } from './../../model/friend';
import { User } from './../../model/user';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { map, filter, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadFriend(uid: string): Observable<Friend[]> {
    return of(uid).pipe(
      filter(() => uid != ''),
      switchMap(() =>
        this.angularFirestore
          .collection('users')
          .snapshotChanges()
          .pipe(
            map((users) =>
              users
                .map((user) => ({
                  uid: user.payload.doc.id,
                  name: user.payload.doc.data()['name'],
                  myFriend: false,
                }))
                .filter((user) => user.uid != uid)
            ),
            catchError((e) => [])
          )
      )
    );
  }
}
