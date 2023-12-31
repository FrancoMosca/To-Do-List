import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/pages/users/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  user$!:Observable<User | null>;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.userState$;
  }

  async onSignOut(): Promise<void> {
    await this.auth.signOut();
  }
}
