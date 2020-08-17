import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../store/reducers/auth.reducer';
import { Observable, from } from 'rxjs';
import { map, switchMap, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private angularFirestore: AngularFirestore
  ) {}

  addMessage(
    message: string,
    uid: string,
    receiverUid: string
  ): Observable<DocumentReference> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(uid)
        .collection('sent')
        .doc(receiverUid)
        .collection('messages')
        .add({ message: message })
    ).pipe(
      switchMap((sentDoc) =>
        from(
          this.angularFirestore
            .collection('chats')
            .doc(receiverUid)
            .collection('received')
            .doc(uid)
            .collection('messages')
            .add({ message: message })
        )
      )
    );
  }
}
