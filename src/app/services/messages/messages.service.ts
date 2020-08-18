import { AuthService } from './../auth/auth.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { Message } from './../../model/message';
import { Observable, merge, from, forkJoin } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService
  ) {}

  loadMessages(uid: string, interlocutorUid: string): Observable<Message[]> {
    return merge(
      this.loadSentMessages(uid, interlocutorUid),
      this.loadReceivedMessages(uid, interlocutorUid)
    );
  }

  private loadSentMessages(uid: string, interlocutorUid: string) {
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
            (doc) =>
              new Message({
                my: true,
                uid: uid,
                interlocutorUid: interlocutorUid,
                text: doc['text'],
                date: doc['date'],
              })
          )
        )
      );
  }

  private loadReceivedMessages(uid: string, interlocutorUid: string) {
    return this.angularFirestore
      .collection('chats')
      .doc(uid)
      .collection('messages')
      .doc(interlocutorUid)
      .collection('received')
      .valueChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map(
            (doc) =>
              new Message({
                my: false,
                uid: uid,
                interlocutorUid: interlocutorUid,
                text: doc['text'],
                date: doc['date'],
              })
          )
        )
      );
  }

  sendMessage(
    message: Message
  ): Observable<[DocumentReference, DocumentReference]> {
    return forkJoin(
      from(
        this.angularFirestore
          .collection('chats')
          .doc(message.uid)
          .collection('messages')
          .doc(message.interlocutorUid)
          .collection('sent')
          .add({ text: message.text, date: message.date })
      ),

      from(
        this.angularFirestore
          .collection('chats')
          .doc(message.interlocutorUid)
          .collection('messages')
          .doc(message.uid)
          .collection('received')
          .add({ text: message.text, date: message.date })
      )
    );
  }
}
