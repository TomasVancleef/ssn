import { map, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import * as fromAuth from '../../store/reducers/auth.reducer';

@Injectable({
  providedIn: 'root',
})
export class VerifyEmailGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.store.select(fromAuth.selectAuthUser).pipe(
      filter((user) => user.uid != ''),
      map((user) => {
        return !user.verified;
      })
    );
  }
}
