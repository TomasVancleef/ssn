import { Chat } from './../../model/chat';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducer';
import { Observable, from, of, merge, combineLatest } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  filter,
  catchError,
  withLatestFrom,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadChats(uid: string): Observable<Chat[]> {
    return of(uid).pipe(
      filter(() => uid != ''),
      switchMap(() =>
        combineLatest(
          this.angularFirestore
            .collection('chats')
            .doc(uid)
            .collection('messages')
            .snapshotChanges(),
          this.angularFirestore.collection('users').snapshotChanges()
        ).pipe(
          map(([messages, users]) =>
            messages.map((message) => ({
              interlocutorUid: message.payload.doc.id,
              interlocutorName: users
                .find((user) => user.payload.doc.id == message.payload.doc.id)
                .payload.doc.data()['name'],
              lastMessage: 'test',
            }))
          )
        )
      ),
      catchError((e) => [])
    );
  }
}
