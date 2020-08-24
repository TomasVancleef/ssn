import { Observable } from 'rxjs';
import * as SidenavAcrions from '../../../store/actions/sidenav.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Page } from 'src/app/model/page';
import * as fromPages from '../../../store/reducers/pages.reducer';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  page$: Observable<Page>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.page$ = this.store.select(fromPages.selectActivePage);
  }

  openSidenav() {
    this.store.dispatch(SidenavAcrions.openSidenav());
  }
}
