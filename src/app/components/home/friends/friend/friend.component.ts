import { Component, OnInit, Input } from '@angular/core';
import { Friend } from 'src/app/model/friend';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {
  @Input() friend: Friend;

  constructor() {}

  ngOnInit(): void {}
}
