import { map, switchMap, filter, take } from 'rxjs/operators';
import { Message } from './../../model/message';
import { Observable, combineLatest, forkJoin, from, of } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private angularFirestore: AngularFirestore) {}

  sendMessage(uid: string, message: Message): Observable<any> {
    return from(
      this.angularFirestore.collection('messages').add({
        from: uid,
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
              .doc(uid)
              .set({
                interlocutorsUid: uid,
                text: message.text,
                date: message.date,
                viewed: false,
                my: false,
              })
          ),
          from(
            this.angularFirestore
              .collection('users')
              .doc(uid)
              .collection('chats')
              .doc(message.interlocutorUid)
              .set({
                interlocutorsUid: message.interlocutorUid,
                text: message.text,
                date: message.date,
                viewed: false,
                my: true,
              })
          )
        )
      )
    );
  }

  loadMessages(uid: string, interlocutorUid: string): Observable<Message[]> {
    if (uid == '' || interlocutorUid == '') {
      return of([]);
    }
    return this.checkChat(uid, interlocutorUid).pipe(
      switchMap((exist) => {
        if (!exist) {
          throw 'no chat';
        }
        return combineLatest(
          this.loadSentMessages(uid, interlocutorUid),
          this.loadReceivedMessages(uid, interlocutorUid)
        ).pipe(
          map(([sent, received]) =>
            []
              .concat(sent)
              .concat(received)
              .sort((a, b) => +b.date - +a.date)
          )
        );
      })
    );
  }

  checkChat(uid: string, interlocutorsUid: string): Observable<boolean> {
    return this.angularFirestore
      .collection('users')
      .doc(uid)
      .collection('chats', (ref) =>
        ref.where('interlocutorsUid', '==', interlocutorsUid)
      )
      .get()

      .pipe(
        map((doc) => {
          return !doc.empty;
        })
      );
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
  ): Observable<[void[], void[], void[]]> {
    return combineLatest(
      this.angularFirestore
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
              messages.map((message) => {
                return from(
                  this.angularFirestore
                    .collection('messages')
                    .doc(message.payload.doc.id)
                    .update({ viewed: true })
                );
              })
            )
          )
        ),
      this.angularFirestore
        .collection('users')
        .doc(interlocutorUid)
        .collection('chats', (ref) =>
          ref
            .where('interlocutorsUid', '==', uid)
            .where('my', '==', true)
            .where('viewed', '==', false)
        )
        .get()
        .pipe(
          switchMap((docs) =>
            forkJoin(
              docs.docs.map((doc) =>
                from(
                  this.angularFirestore
                    .collection('users')
                    .doc(interlocutorUid)
                    .collection('chats')
                    .doc(doc.id)
                    .update({ viewed: true })
                )
              )
            )
          )
        ),
      this.angularFirestore
        .collection('users')
        .doc(uid)
        .collection('chats', (ref) =>
          ref
            .where('interlocutorsUid', '==', interlocutorUid)
            .where('my', '==', false)
            .where('viewed', '==', false)
        )
        .get()
        .pipe(
          switchMap((docs) =>
            forkJoin(
              docs.docs.map((doc) =>
                from(
                  this.angularFirestore
                    .collection('users')
                    .doc(uid)
                    .collection('chats')
                    .doc(doc.id)
                    .update({ viewed: true })
                )
              )
            )
          )
        )
    );
  }
}
