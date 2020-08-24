import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import * as AuthActions from '../../store/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.auto_login());
  }
}
