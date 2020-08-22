import { MessagesEffects } from './effects/messages.effects';
import { FriendsEffects } from './effects/friends.effects';
import { ChatsEffects } from './effects/chats.effects';
import { AuthEffects } from './effects/auth.effects';
import { ProfileEffects } from './effects/profile.effects';

export const appEffects = [
  AuthEffects,
  ChatsEffects,
  FriendsEffects,
  MessagesEffects,
  ProfileEffects,
];
