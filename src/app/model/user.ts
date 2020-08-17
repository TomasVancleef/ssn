export class User {
  uid = '';
  name = '';
  email = '';
  photo = '';

  constructor({uid, name, email, photo = ''}) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.photo = photo;
  }
}
