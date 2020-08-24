import { NgForm } from '@angular/forms';
import { AppState } from '../../../store/app.reducer';
import { selectAuthUser } from '../../../store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user$: Observable<User>;
  nameEditMode = false;
  newName: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectAuthUser);
  }

  uploadPhoto(event) {
    this.store.dispatch(
      AuthActions.change_avatar({ file: event.target.files[0] })
    );
  }

  editName() {
    this.nameEditMode = true;
  }

  saveName(form: NgForm) {
    let newName = form.value.name;
    this.store.dispatch(AuthActions.change_name({ name: newName }));
    this.nameEditMode = false;
  }

  denyNameChange() {
    this.nameEditMode = false;
  }
}
