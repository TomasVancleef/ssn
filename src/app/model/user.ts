export class User {
  uid = '';
  name = '';
  email = '';
  photo? = '';
  verified? = false;

  constructor({ uid, name, email, photo = '', verified = false }) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.photo = photo;
    this.verified = false;
  }
}
