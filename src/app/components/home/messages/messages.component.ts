import { Message } from './../../../model/message';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as MessagesActions from '../../../store/actions/messages.actions';
import * as fromAuth from '../../../store/reducers/auth.reducer';
import * as fromMessages from '../../../store/reducers/messages.reducer';
import { map, last, takeLast, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('scroll') scroll: CdkVirtualScrollViewport;

  interlocutorUid: string;
  messageText = '';
  messages$: Observable<Message[]>;
  uid: string;
  paramsSubscription: Subscription;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params
      .pipe(take(1))
      .subscribe((params) => (this.interlocutorUid = params['id']));

    this.messages$ = this.store.select(fromMessages.selectMessages);

    this.store
      .select(fromAuth.selectAuthUserUid)
      .pipe(take(1))
      .subscribe((uid) => (this.uid = uid));

    this.store.dispatch(
      MessagesActions.loadMessages({ interlocutorUid: this.interlocutorUid })
    );
  }

  sendMessage() {
    this.store.dispatch(
      MessagesActions.sendMessage({
        message: {
          id: '',
          my: true,
          uid: this.uid,
          interlocutorUid: this.interlocutorUid,
          text: this.messageText,
          date: Timestamp.now(),
        },
      })
    );
    this.messageText = '';
    this.scroll.scrollToIndex(0);
  }
}
