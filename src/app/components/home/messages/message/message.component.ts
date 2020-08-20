import { Message } from './../../../../model/message';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  align = 'start center';

  constructor() {}

  ngOnInit(): void {
    this.align = this.message.my ? 'end center' : 'start center';
  }
}
