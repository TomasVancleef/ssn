import { Store } from '@ngrx/store';
import { Message } from './../../../../model/message';
import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import * as MessagesActions from '../../../../store/actions/messages.actions';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  align = 'start center';

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.align = this.message.my ? 'end center' : 'start center';
  }
}
