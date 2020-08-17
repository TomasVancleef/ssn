import { map } from 'rxjs/operators';
import { Message } from './../../model/message';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadMessages(uid: string, interlocutorUid: string): Observable<Message[]> {
    return this.angularFirestore
      .collection('chats')
      .doc(uid)
      .collection('messages')
      .doc(interlocutorUid)
      .collection('sent')
      .valueChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map(
            (doc) => new Message({ message: doc['message'], date: doc['date'] })
          )
        )
      );
  }
}
