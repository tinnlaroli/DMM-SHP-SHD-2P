import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  picture: string | null = null;
    name: string | null = null;
    email: string | null = null;
  
    constructor(private afAuth: AngularFireAuth ) {}
  
    // Google Login
    async loginGoogle() {
      try {
        // Usamos 'signInWithPopup' directamente desde afAuth
        const res = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        const user = res.user;
  
        if (user) {
          console.log(user);
          this.picture = user.photoURL;
          this.name = user.displayName;
          this.email = user.email;
        }
      } catch (error) {
        console.error('Error during Google login: ', error);
      }
    }
  
    // Facebook Login - Placeholder
    loginFacebook() {
      console.log('Login con Facebook');
      // Facebook login implementation can be added here
    }

}
