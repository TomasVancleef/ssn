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
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: UserComponent },
      { path: 'chats', component: ChatsComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'messages/:id', component: MessagesComponent },
      { path: 'profile/:uid', component: ProfileComponent },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
