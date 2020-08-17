import * as SidenavAcrions from '../../../store/actions/sidenav.actions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {}

  openSidenav() {
    this.store.dispatch(SidenavAcrions.openSidenav())
  }
}
