import { Observable } from 'rxjs';
import { Component, inject } from '@angular/core';
import { AuthService } from '@app/pages/users/services/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],

})
export class ProfileComponent {
  public user$!:Observable<User | null>;
  private readonly authSvc = inject(AuthService); 
  public sidebarShow: boolean = false;
  
  constructor() {
    this.user$ = this.authSvc.userState$;
  }

  
}
