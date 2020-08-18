import { selectAuthUser } from './../../../store/reducers/auth.reducer';
import { Message } from './../../../model/message';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Friend } from 'src/app/model/friend';
import { Store } from '@ngrx/store';
import * as MessagesActions from '../../../store/actions/messages.actions';
import * as fromAuth from '../../../store/reducers/auth.reducer';
import * as fromMessages from '../../../store/reducers/messages.reducer';
import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/model/user';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
  interlocutorUid: string;
  messageText = '';
  messages: Observable<Message[]>;
  uid$: Observable<string>;
  paramsSubscription: Subscription;
  uid: string;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe(
      (params) => (this.interlocutorUid = params['id'])
    );
    this.store.dispatch(MessagesActions.loadMessages({interlocutorUid: this.interlocutorUid}));
    this.messages = this.store.select(fromMessages.selectMessages);
    this.store
      .select(fromAuth.selectAuthUserUid)
      .subscribe((uid) => (this.uid = uid));
  }

  sendMessage() {
    this.store.dispatch(
      MessagesActions.sendMessage({
        message: new Message({
          my: true,
          uid: this.uid,
          interlocutorUid: this.interlocutorUid,
          text: this.messageText,
          date: Date.now(),
        }),
      })
    );
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }
}
