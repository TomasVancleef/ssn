import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Chat {
  interlocutorUid: string;
  interlocutorName: string;
  lastMessageDate: Timestamp;
  lastMessage: string;
  lastMessageMy: boolean;
  photo: string;
  viewed: boolean;
}
