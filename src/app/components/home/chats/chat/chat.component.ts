import { Chat } from './../../../../model/chat';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() chat: Chat;

  constructor() { }

  ngOnInit(): void {
  }

}
