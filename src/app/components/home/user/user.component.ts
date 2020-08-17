import { ImageService } from '../../../services/image/image.service';
import { AppState } from '../../../store/app.reducer';
import { selectAuthUser } from '../../../store/reducers/auth.reducer';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AuthActions from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user$: Observable<User>;

  constructor(
    private store: Store<AppState>,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectAuthUser);
  }

  uploadPhoto(event) {
    this.store.dispatch(
      AuthActions.change_avatar({ file: event.target.files[0] })
    );
  }
}
