import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Message {
  id: string;
  my: boolean;
  uid: string;
  interlocutorUid: string;
  text: string;
  date: Timestamp;
  viewed: boolean;
}
