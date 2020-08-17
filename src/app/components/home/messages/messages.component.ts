import { Component, OnInit, Input } from '@angular/core';
import { Friend } from 'src/app/model/friend';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() friend: Friend;

  constructor() { }

  ngOnInit(): void {
  }

}
