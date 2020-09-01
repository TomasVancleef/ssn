import { take } from 'rxjs/operators';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  sendLink() {
    this.authService.sendEmailVerify().pipe(take(1)).subscribe();
  }
}
