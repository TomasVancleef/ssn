export class Chat {
  interlocutorUid: string;
  interlocutorName: string;
  lastMessage: string;

  constructor({interlocutorUid, interlocutorName, lastMessage}) {
    this.interlocutorUid = interlocutorUid;
    this.interlocutorName = interlocutorName;
    this.lastMessage = lastMessage;
  }
}
