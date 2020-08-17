import { appEffects } from './store/app.effects';
import { environment } from './../environments/environment';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import * as fromApp from './store/app.reducer';
import { UserComponent } from './components/home/user/user.component';
import { HomeComponent } from './components/home/home.component';
import { ToolbarComponent } from './components/home/toolbar/toolbar.component';
import { SidemenuComponent } from './components/home/sidemenu/sidemenu.component';
import { ChatsComponent } from './components/home/chats/chats.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ChatComponent } from './components/home/chats/chat/chat.component';
import { FriendsComponent } from './components/home/friends/friends.component';
import { FriendComponent } from './components/home/friends/friend/friend.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    HomeComponent,
    ToolbarComponent,
    SidemenuComponent,
    ChatsComponent,
    RegistrationComponent,
    ChatComponent,
    FriendsComponent,
    FriendComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot(appEffects),
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
