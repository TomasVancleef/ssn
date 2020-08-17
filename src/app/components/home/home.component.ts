import * as SidenavActions from '../../store/actions/sidenav.actions';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSidenav from '../../store/reducers/sidenav.reducer';
import * as AuthActions from '../../store/actions/auth.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  opened: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.opened = this.store.select(fromSidenav.selectSidenavOpen);
  }

  closeSidenav() {
    this.store.dispatch(SidenavActions.closeSidenav());
  }
}
