import { PagesService } from './../../services/pages/pages.service';
import { RouterOutlet } from '@angular/router';
import * as SidenavActions from '../../store/actions/sidenav.actions';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSidenav from '../../store/reducers/sidenav.reducer';
import { slideInAnimation } from './home.animation';
import { Page } from 'src/app/model/page';
import * as fromPages from '../../store/reducers/pages.reducer';
import * as fromChats from '../../store/reducers/chats.reducer';
import * as PagesActions from '../../store/actions/pages.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [slideInAnimation],
})
export class HomeComponent implements OnInit {
  opened: Observable<boolean>;
  pages$: Observable<Page[]>;
  pages: Page[];
  activePage$: Observable<Page>;
  unviewedMessagesNumber$: Observable<number>;

  constructor(private store: Store, private pagesService: PagesService) {}

  ngOnInit(): void {
    this.pages = this.pagesService.getPages();
    this.activePage$ = this.store.select(fromPages.selectActivePage);
    this.opened = this.store.select(fromSidenav.selectSidenavOpen);
    this.unviewedMessagesNumber$ = this.store.select(
      fromChats.selectChatsUnviewedMessagesNumber
    );
  }

  prepareRoute(outlet: RouterOutlet) {
    return (
      outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation
    );
  }

  closeSidenav() {
    this.store.dispatch(SidenavActions.closeSidenav());
  }
}
