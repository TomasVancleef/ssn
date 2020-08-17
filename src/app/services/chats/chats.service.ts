import { Chat } from './../../model/chat';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducer';
import { Observable, from } from 'rxjs';
import { map, switchMap, mergeMap, filter, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadChats(uid: string): Observable<Chat[]> {
    return this.angularFirestore
      .collection('chats')
      .doc(uid)
      .collection('interlocutor')
      .snapshotChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map(
            (interlocutor) =>
              new Chat({
                interlocutorUid: interlocutor.payload.doc.id,
                interlocutorName: '',
                lastMessage: '',
              })
          )
        ),
        catchError(e => []),
      );
  }

  addMessage(
    message: string,
    uid: string,
    receiverUid: string
  ): Observable<DocumentReference> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(uid)
        .collection('interlocutor')
        .doc(receiverUid)
        .collection('sent')
        .add({ message: message })
    ).pipe(
      switchMap((sentDoc) =>
        from(
          this.angularFirestore
            .collection('chats')
            .doc(receiverUid)
            .collection('interlocutor')
            .doc(uid)
            .collection('received')
            .add({ message: message })
        )
      )
    );
  }
}
