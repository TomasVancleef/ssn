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
import * as fromChats from '../../../store/reducers/chats.reducer';
import { take, delay, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

  messageText = '';
  messagesState$: Observable<fromMessages.State>;
  scrolledSubscription: Subscription;
  scrolled = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.messagesState$ = this.store.select(fromMessages.selectState);

    this.scrolledSubscription = this.messagesState$.subscribe(
      () => (this.scrolled = false)
    );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toChats() {
    this.router.navigate(['/chats']);
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
          uid: '',
          interlocutorUid: this.route.snapshot.params['id'],
          text: f.value.message,
          date: Timestamp.now(),
          viewed: false,
        },
      })
    );
    f.resetForm();
  }

  ngOnDestroy(): void {
    this.scrolledSubscription.unsubscribe();
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (this.scroll != undefined) {
      this.scroll.scrollToOffset(
        this.scroll.elementRef.nativeElement.scrollTop + event.wheelDeltaY / 5
      );
    }

    event.preventDefault();
  }
}
