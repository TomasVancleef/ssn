import { closeSidenav } from './../../../store/actions/sidenav.actions';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions';
import * as SidenavActions from '../../../store/actions/sidenav.actions';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {
  constructor(private store: Store, private roter: Router) {}

  ngOnInit(): void {}

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  closeSidenav() {
    this.store.dispatch(SidenavActions.closeSidenav());
  }
}
