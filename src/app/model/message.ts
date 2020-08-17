export class Message {
  message: string;
  date: Date;

  constructor({ message, date }) {
    this.message = message;
    this.date = date;
  }
}
