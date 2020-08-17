import { MessagesEffects } from './effects/messages.effects';
import { FriendsEffects } from './effects/friends.effects';
import { ChatsEffects } from './effects/chats.effects';
import { AuthEffects } from './effects/auth.effects';

export const appEffects = [AuthEffects, ChatsEffects, FriendsEffects, MessagesEffects];
