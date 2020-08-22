import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';
import * as fromAuth from '../../store/reducers/auth.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loggingIn$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loggingIn$ = this.store.select(fromAuth.selectAuthLoggingIn);
    this.store.dispatch(AuthActions.auto_login());
  }

  login(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(AuthActions.login(form.value));
    }
  }
}
