import { AuthService } from './../../services/auth/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from './../../store/reducers/auth.reducer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoggedOutGuard implements CanActivate {
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
          if (loggedIn) {
            this.router.navigate(['chats']);
          }
          return !loggedIn;
        }
      })
    );
  }
}
