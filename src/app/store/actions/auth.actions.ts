import { User } from 'src/app/model/user';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  'login',
  props<{ email: string; password: string }>()
);
export const login_success = createAction('login success', props<User>());
export const login_failed = createAction('login failed');
export const logout = createAction('logout');
export const logout_success = createAction('logout success');
export const logout_failed = createAction('logout failed');

export const auto_login = createAction('auto login');
export const auto_login_success = createAction(
  'auto login success',
  props<User>()
);

export const registration = createAction(
  'registration',
  props<{ name: string; email: string; password: string }>()
);
export const registration_success = createAction(
  'registration success',
  props<{ email: string; password: string }>()
);
export const registration_failed = createAction('registration failed');

export const change_avatar = createAction(
  'change avatar',
  props<{ file: File }>()
);

export const change_avatar_image_uploaded = createAction(
  'change avatar image uploaded',
  props<{ ref: string }>()
);

export const change_avatar_success = createAction(
  'change avatar success',
  props<{ ref: string }>()
);

export const change_name = createAction(
  'change name',
  props<{ name: string }>()
);

export const change_name_success = createAction(
  'change name success',
  props<{ name: string }>()
);
