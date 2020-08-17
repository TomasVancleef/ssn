import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/model/chat';
import { Store, select } from '@ngrx/store';
import * as fromChats from '../../../store/reducers/chats.reducer';
import * as ChatsActions from '../../../store/actions/chats.actions';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit {
  chats$: Observable<Chat[]>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(ChatsActions.loadChats());

    this.chats$ = this.store.select(fromChats.selectChats);
  }
}
