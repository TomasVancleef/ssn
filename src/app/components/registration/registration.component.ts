import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/actions/auth.actions';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {}

  registration(form: NgForm) {
    if (form.valid) {
      this.store.dispatch(AuthActions.registration(form.value));
    }
  }
}
