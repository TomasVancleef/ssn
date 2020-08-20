import { map } from 'rxjs/operators';
import { Message } from './../../model/message';
import { Observable, merge, from, combineLatest, zip } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(private angularFirestore: AngularFirestore) {}

  loadMessages(uid: string, interlocutorUid: string): Observable<Message[]> {
    return combineLatest(
      this.loadSentMessages(uid, interlocutorUid),
      this.loadReceivedMessages(uid, interlocutorUid)
    ).pipe(map((messages) => messages[0].concat(messages[1])));
  }

  private loadSentMessages(
    uid: string,
    interlocutorUid: string
  ): Observable<Message[]> {
    return this.angularFirestore
      .collection('chats')
      .doc(uid)
      .collection('messages')
      .doc(interlocutorUid)
      .collection('sent')
      .valueChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map((doc) => ({
            id: doc.id,
            my: true,
            uid: uid,
            interlocutorUid: interlocutorUid,
            text: doc['text'],
            date: doc['date'],
          }))
        )
      );
  }

  private loadReceivedMessages(
    uid: string,
    interlocutorUid: string
  ): Observable<Message[]> {
    return this.angularFirestore
      .collection('chats')
      .doc(uid)
      .collection('messages')
      .doc(interlocutorUid)
      .collection('received')
      .valueChanges()
      .pipe(
        map((snapshot) =>
          snapshot.map((doc) => ({
            id: doc.id,
            my: false,
            uid: uid,
            interlocutorUid: interlocutorUid,
            text: doc['text'],
            date: doc['date'],
          }))
        )
      );
  }

  sendMessage(
    message: Message
  ): Observable<
    [[void, void, DocumentReference], [void, void, DocumentReference]]
  > {
    return combineLatest(
      this.addToMyMessages(message),
      this.addToInterlocutorsMessages(message)
    );
  }

  private addToMyMessages(
    message: Message
  ): Observable<[void, void, DocumentReference]> {
    return combineLatest(
      this.addChatsDoc(message.uid),
      this.addMessagesDoc(message.uid, message.interlocutorUid),
      this.addMyMessageDoc(message)
    );
  }

  private addToInterlocutorsMessages(
    message: Message
  ): Observable<[void, void, DocumentReference]> {
    return combineLatest(
      this.addChatsDoc(message.interlocutorUid),
      this.addMessagesDoc(message.interlocutorUid, message.uid),
      this.addInterlocutorsMessageDoc(message)
    );
  }

  private addChatsDoc(fromId: string): Observable<void> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(fromId)
        .set({}, { merge: true })
    );
  }

  private addMessagesDoc(fromId: string, toId: string): Observable<void> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(fromId)
        .collection('messages')
        .doc(toId)
        .set({}, { merge: true })
    );
  }

  private addMyMessageDoc(message: Message): Observable<DocumentReference> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(message.uid)
        .collection('messages')
        .doc(message.interlocutorUid)
        .collection('sent')
        .add({ text: message.text, date: message.date })
    );
  }

  private addInterlocutorsMessageDoc(
    message: Message
  ): Observable<DocumentReference> {
    return from(
      this.angularFirestore
        .collection('chats')
        .doc(message.interlocutorUid)
        .collection('messages')
        .doc(message.uid)
        .collection('received')
        .add({ text: message.text, date: message.date })
    );
  }
}
