import { VerifyEmailGuard } from './guards/verify-email/verify-email.guard';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoggedOutGuard } from './guards/logged-out/logged-out.guard';
import { ProfileComponent } from './components/home/profile/profile.component';
import { ChatsComponent } from './components/home/chats/chats.component';
import { MessagesComponent } from './components/home/messages/messages.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/home/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FriendsComponent } from './components/home/friends/friends.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoggedOutGuard] },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [LoggedOutGuard],
  },
  {
    path: 'verify_email',
    component: VerifyEmailComponent,
    canActivate: [VerifyEmailGuard],
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/login',
      },
      {
        path: 'chats',
        component: ChatsComponent,
        data: { animation: 'ChatsPage' },
      },

      {
        path: 'friends',
        component: FriendsComponent,
        data: { animation: 'FriendsPage' },
      },
      {
        path: 'user',
        component: UserComponent,
        data: { animation: 'UserPage' },
      },

      {
        path: 'profile/:uid',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'messages/:id',
    component: MessagesComponent,
  },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
