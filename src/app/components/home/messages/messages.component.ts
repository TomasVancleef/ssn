import { NgForm } from '@angular/forms';
import { Message } from './../../../model/message';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as MessagesActions from '../../../store/actions/messages.actions';
import * as fromAuth from '../../../store/reducers/auth.reducer';
import * as fromMessages from '../../../store/reducers/messages.reducer';
import { take } from 'rxjs/operators';
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
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scroll') scroll: CdkVirtualScrollViewport;

  interlocutorUid: string;
  messageText = '';
  messages$: Observable<Message[]>;
  messagesLoading$: Observable<boolean>;
  uid: string;
  paramsSubscription: Subscription;
  scrolledSubscription: Subscription;
  scrolled = false;
  messagesEmpty: Observable<boolean>;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe(
      (params) => (this.interlocutorUid = params['id'])
    );

    this.messagesLoading$ = this.store.select(
      fromMessages.selectMessagesLoading
    );

    this.messagesEmpty = this.store.select(fromMessages.selectMessagesEmpty);
    this.messages$ = this.store.select(fromMessages.selectMessages);

    console.log('init');
    this.scrolledSubscription = this.messages$.subscribe(
      () => (this.scrolled = false)
    );

    this.store
      .select(fromAuth.selectAuthUserUid)
      .pipe(take(1))
      .subscribe((uid) => (this.uid = uid));

    this.store.dispatch(
      MessagesActions.loadMessages({ interlocutorUid: this.interlocutorUid })
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (!this.scrolled) {
      if (this.scroll != undefined) {
        this.scroll.scrollToIndex(0);
        this.scrolled = true;
      }
    }
  }

  sendMessage(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this.store.dispatch(
      MessagesActions.sendMessage({
        message: {
          id: '',
          my: true,
          uid: this.uid,
          interlocutorUid: this.interlocutorUid,
          text: f.value.message,
          date: Timestamp.now(),
        },
      })
    );
    f.resetForm();
  }

  ngOnDestroy(): void {
    this.scrolledSubscription.unsubscribe();
    this.paramsSubscription.unsubscribe();
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (this.scroll != undefined) {
      this.scroll.scrollToOffset(
        this.scroll.elementRef.nativeElement.scrollTop + event.wheelDeltaY
      );
    }

    event.preventDefault();
  }
}
