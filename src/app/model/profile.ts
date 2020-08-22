import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

export interface Profile {
  uid: string;
  name: string;
  birthday?: Timestamp;
  photo?: string;
}
