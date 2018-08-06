import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  isSignInVisible: boolean = false;
  isSignUpVisible: boolean = false;
  isSignedIn: boolean = false;

  username: string = null;
  jwtToken: string = null;

  toggleSignIn (data: any) {
    this.isSignInVisible = !this.isSignInVisible;

    if (data) {
      this.username = data.email;
      this.jwtToken = data.token;
      this.isSignedIn = true;
    }
  }

  toggleSignUp () {
    this.isSignUpVisible = !this.isSignUpVisible;
  }

  signOut () {
    this.username = null;
    this.jwtToken = null;
    this.isSignedIn = false;
  }
}
