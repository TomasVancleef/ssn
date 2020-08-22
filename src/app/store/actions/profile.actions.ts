import { Profile } from './../../model/profile';
import { Friend } from '../../model/friend';

import { createAction, props } from '@ngrx/store';

export const setProfile = createAction('set profile', props<{ uid: string }>());

export const setProfileSuccess = createAction(
  'set profile success',
  props<{ profile: Profile }>()
);
