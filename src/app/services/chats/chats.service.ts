import { ImageService } from './../image/image.service';
import { Chat } from './../../model/chat';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor(
    private angularFirestore: AngularFirestore,
    private imageService: ImageService
  ) {}

  loadChats(uid: string): Observable<Chat[]> {
    return of(uid).pipe(
      filter(() => uid != ''),
      switchMap(() =>
        this.angularFirestore
          .collection('users')
          .doc(uid)
          .collection('chats', (ref) => ref.orderBy('date', 'desc'))
          .snapshotChanges()
          .pipe(
            switchMap((docs) => {
              if (docs.length == 0) {
                return of([]);
              } else {
                return forkJoin(
                  docs.map((doc) => {
                    let docData = doc.payload.doc.data();
                    return this.angularFirestore
                      .collection('users')
                      .doc(docData['interlocutorsUid'])
                      .get()
                      .pipe(
                        switchMap((interlocutorsData) =>
                          this.imageService
                            .getUserAvatar(interlocutorsData.data()['photo'])
                            .pipe(
                              map((ref) => ({
                                interlocutorUid: docData['interlocutorsUid'],
                                interlocutorName: interlocutorsData.data()[
                                  'name'
                                ],
                                lastMessage: docData['text'],
                                lastMessageDate: docData['date'],
                                lastMessageMy: docData['my'],
                                photo: ref,
                                viewed: docData['viewed'],
                              }))
                            )
                        )
                      );
                  })
                );
              }
            })
          )
      )
    );
  }

  getUnviewedMessagesNumber(uid: string): Observable<number> {
    return this.angularFirestore
      .collection('messages', (ref) =>
        ref.where('to', '==', uid).where('viewed', '==', false)
      )
      .valueChanges()
      .pipe(map((docs) => docs.length));
  }
}
