import { ChatsService } from './../chats/chats.service';
import { Injectable } from '@angular/core';
import { Page } from 'src/app/model/page';

@Injectable({
  providedIn: 'root',
})
export class PagesService {
  constructor(private chatsService: ChatsService) {}

  getPages(): Page[] {
    return [
      {
        index: 0,
        route: '/chats',
        title: 'Сообщения',
        icon: 'message',
        alertsNumber: 0,
      },
      {
        index: 1,
        route: '/friends',
        title: 'Друзья',
        icon: 'group',
        alertsNumber: 0,
      },
      {
        index: 2,
        route: '/user',
        title: 'Профиль',
        icon: 'settings',
        alertsNumber: 0,
      },
    ];
  }
}
