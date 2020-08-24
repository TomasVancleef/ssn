import { Store } from '@ngrx/store';
import { PagesService } from './../../services/pages/pages.service';
import { map, filter, switchMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromRouter from '@ngrx/router-store';
import * as PagesActions from '../actions/pages.actions';
import { Page } from '../../model/page';
import { Injectable } from '@angular/core';
import * as fromPages from '../reducers/pages.reducer';
import * as fromAuth from '../reducers/auth.reducer';

@Injectable()
export class PagesEffects {
  constructor(
    private actions$: Actions,
    private pagesService: PagesService,
    private store: Store
  ) {}

  setPagesEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PagesActions.setPages),
      map((action) =>
        PagesActions.setPagesSuccess({ pages: this.pagesService.getPages() })
      )
    )
  );

  setActivePageEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromRouter.routerNavigatedAction),
      switchMap((action) => {
        return this.store.select(fromPages.selectPages).pipe(
          map((pages) =>
            PagesActions.setActivePage({
              page: pages.find(
                (page) => page.route == action.payload.event.url
              ),
            })
          )
        );
      })
    )
  );
}
