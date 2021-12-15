import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly router: Router
  ) { }

  public email: string;
  public password: string;
  public passwordRepeat: string;
  public arePasswordsMatching: boolean;
  public isValidMailAddress: boolean;

  public mode: "login" | "login-register" | "register" | "password-reset" = "login";

  public ngOnInit() {

  }

  public changeMode(mode: "login" | "login-register" | "register" | "password-reset") {
    this.mode = mode;
  }

  public login() {
    this.router.navigateByUrl("/tabs");
  }

  public register() {
    this.changeMode("login-register");
  }

  public changePassword() {

  }

  public checkPasswords() {
    this.arePasswordsMatching = this.password == this.passwordRepeat;
  }

  public checkEmailAddress() {
    this.isValidMailAddress = this.email.includes('@');
  }
}
