import { AuthService } from './../../services/auth/auth.service';
import * as fromAuth from './../../store/reducers/auth.reducer';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.currentUser().pipe(
      map((user) => {
        {
          let loggedIn = user.uid != '';
          if (!loggedIn) {
            this.router.navigate(['login']);
          }
          return loggedIn;
        }
      })
    );
    // return this.store.select(fromAuth.selectAuth).pipe(
    //   map((auth) => {
    //     let loggedIn = auth.user.uid != '';
    //     if (!loggedIn && !auth.loggingIn) {
    //       this.router.navigate(['login']);
    //     }
    //     return loggedIn;
    //   })
    // );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.currentUser().pipe(
      map((user) => {
        {
          let loggedIn = user != null;
          if (!loggedIn) {
            this.router.navigate(['login']);
          }
          return loggedIn;
        }
      })
    );

    // return this.store.select(fromAuth.selectAuth).pipe(
    //   map((auth) => {
    //     let loggedIn = auth.user.uid != '';
    //     if (!loggedIn && !auth.loggingIn) {
    //       this.router.navigate(['login']);
    //     }
    //     return loggedIn;
    //   })
    // );
  }
}
