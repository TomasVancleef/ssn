import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Profile } from './../../../model/profile';
import { Component, OnInit } from '@angular/core';
import * as fromProfile from '../../../store/reducers/profile.reducer';
import * as ProfileActions from '../../../store/actions/profile.actions';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile$: Observable<Profile>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(take(1))
      .subscribe((params) =>
        this.store.dispatch(ProfileActions.setProfile({ uid: params['uid'] }))
      );

    this.profile$ = this.store.select(fromProfile.selectProfile);
  }

  toMessages() {
    this.profile$
      .pipe(take(1))
      .subscribe((profile) =>
        this.router.navigate(['messages/' + profile.uid])
      );
  }
}
