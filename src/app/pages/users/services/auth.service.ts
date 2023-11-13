import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '@app/shared/services/store.service';
import { Observable } from 'rxjs';

interface ErrorResponse {
  code: string;
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly googleProvider = new GoogleAuthProvider();
  user$!:Observable<User | null>;
  userId?: string;

  constructor(
              private auth:Auth,
              private router: Router,
              private store:StoreService
              ){
    this.user$ = this.userState$;
    this.userState$.subscribe(async user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  get userState$() {
    return authState(this.auth);
  }

  async signInGoogle(): Promise<void> {
    try {
      await signInWithPopup(this.auth, this.googleProvider);
      onAuthStateChanged(this.auth, async (user: User | null) => {
        if (user) {
          const userExists = await this.store.documentExists('users', user.uid);
  
          if (!userExists) {
            // si el usuario no existe en la colección 'users', lo agregamos
            await this.store.addDocument('users', {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              tasks: []
            }, user.uid);
          }
        }
      });
      this.router.navigate(['/home']);
    } catch (error) {
      console.log('Google login', error);
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      const { user } = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await this.sendEmailVerification(user);
      this.router.navigate(['/user/email-verification']);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.log('Code ', code);
      console.log('Message ', message);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
      try {
        const { user } = await signInWithEmailAndPassword(this.auth, email, password);
        this.checkUserIsVerified(user);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.log('Code ', code);
      console.log('Message ', message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error: unknown) {
      console.log(error);
    }
  }

  async sendEmailVerification(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
    } catch (error: unknown) {
      console.log(error);
    }
  }
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: unknown) {
      console.log(error);
    }
  }


  private checkUserIsVerified(user: User): void {
    const route = user.emailVerified ? '/user/profile' : '/user/email-verification';
    this.router.navigate([route]);
  }
}
