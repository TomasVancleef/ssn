import { map, switchMap } from 'rxjs/operators';
import { Message } from './../../model/message';
import { Observable, combineLatest, forkJoin, from } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private angularFirestore: AngularFirestore) {}

  sendMessage(message: Message): Observable<any> {
    return from(
      this.angularFirestore.collection('messages').add({
        from: message.uid,
        to: message.interlocutorUid,
        text: message.text,
        date: message.date,
        viewed: false,
      })
    ).pipe(
      switchMap((doc) =>
        combineLatest(
          from(
            this.angularFirestore
              .collection('users')
              .doc(message.interlocutorUid)
              .collection('chats')
              .doc(message.uid)
              .set({
                interlocutorsUid: message.uid,
                text: message.text,
                date: message.date,
                viewed: false,
              })
          ),
          from(
            this.angularFirestore
              .collection('users')
              .doc(message.uid)
              .collection('chats')
              .doc(message.interlocutorUid)
              .set({
                interlocutorsUid: message.interlocutorUid,
                text: message.text,
                date: message.date,
                viewed: false,
              })
          )
        )
      )
    );
  }

  loadMessages(uid: string, interlocutorUid: string): Observable<Message[]> {
    return combineLatest(
      this.loadSentMessages(uid, interlocutorUid),
      this.loadReceivedMessages(uid, interlocutorUid)
    ).pipe(map(([sent, received]) => [].concat(sent).concat(received)));
  }

  loadSentMessages(
    uid: string,
    interlocutorUid: string
  ): Observable<Message[]> {
    return this.angularFirestore
      .collection('messages', (ref) =>
        ref.where('from', '==', uid).where('to', '==', interlocutorUid)
      )
      .snapshotChanges()
      .pipe(
        map((docs) =>
          docs.map((doc) => {
            let docData = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              my: true,
              uid: docData['from'],
              interlocutorUid: docData['to'],
              text: docData['text'],
              date: docData['date'],
              viewed: docData['viewed'],
            };
          })
        )
      );
  }

  loadReceivedMessages(
    uid: string,
    interlocutorUid: string
  ): Observable<Message[]> {
    return this.angularFirestore
      .collection('messages', (ref) =>
        ref.where('to', '==', uid).where('from', '==', interlocutorUid)
      )
      .snapshotChanges()
      .pipe(
        map((docs) =>
          docs.map((doc) => {
            let docData = doc.payload.doc.data();
            return {
              id: doc.payload.doc.id,
              my: false,
              uid: docData['to'],
              interlocutorUid: docData['from'],
              text: docData['text'],
              date: docData['date'],
              viewed: docData['viewed'],
            };
          })
        )
      );
  }

  markMessagesAsViewed(
    uid: string,
    interlocutorUid: string
  ): Observable<void[]> {
    return this.angularFirestore
      .collection('messages', (ref) =>
        ref
          .where('to', '==', uid)
          .where('from', '==', interlocutorUid)
          .where('viewed', '==', false)
      )
      .snapshotChanges()
      .pipe(
        switchMap((messages) =>
          forkJoin(
            messages.map((message) =>
              from(
                this.angularFirestore
                  .collection('messages')
                  .doc(message.payload.doc.id)
                  .update({ viewed: true })
              )
            )
          )
        )
      );
  }
}
