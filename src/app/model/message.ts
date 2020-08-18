export class Message {
  my: boolean;
  uid: string;
  interlocutorUid: string;
  text: string;
  date: Date;

  constructor({ my, uid, interlocutorUid, text, date }) {
    this.my = my;
    this.uid = uid;
    this.interlocutorUid = interlocutorUid;
    this.text = text;
    this.date = date;
  }
}
