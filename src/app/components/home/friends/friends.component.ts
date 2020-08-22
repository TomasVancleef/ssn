import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFriends from '../../../store/reducers/friends.reducer';
import { Friend } from 'src/app/model/friend';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends$: Observable<Friend[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.friends$ = this.store.select(fromFriends.selectFriends);
  }

}
