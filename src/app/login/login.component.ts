import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { User } from './login.dtos';

const CLASS = "LoginComponent";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService
  ) { }

  public email: string;
  public password: string;
  public passwordRepeat: string;
  public arePasswordsMatching: boolean;
  public isValidMailAddress: boolean;

  public mode: "login" | "login-register" | "register" | "password-reset" | "password-reset-confirm" = "login";

  public ngOnInit() {

  }

  public changeMode(mode: "login" | "login-register" | "register" | "password-reset" | "password-reset-confirm" ) {
    this.logger.log(CLASS + ".changeMode");
    this.mode = mode;
  }

  public async login() {
    this.logger.log(CLASS + ".login");
    let users = await this.getUsers();
    let currentUser = users.find(user => user.email == this.email && user.password == this.password);

    if(currentUser) {
      this.storage.setData("currentUser", JSON.stringify(currentUser));
      this.router.navigateByUrl("/tabs/overview");
    } else {
      this.toast.createError("Can't find user.");
    }
  }

  public async register() {
    this.logger.log(CLASS + ".register");
    try {
      let user: User = new User(this.email, this.password);

      let users: Array<User> = await this.getUsers();
      let userExists: boolean = users.find(user => user.email == this.email) != undefined;
      
      if(userExists) {
        await this.toast.createError("User already exists!");
      } else {
        this.registerUser(users, user);
      }
    } catch (error) {
      await this.toast.createError(error);
    }
  }

  private async registerUser(users: Array<User>, user: User) {
    try {
      users.push(user);
      let usersJson = JSON.stringify(users);
      await this.storage.setData("users", usersJson);
      await this.toast.createSuccess("Successfully registered!");
      this.changeMode("login-register");
    } catch (error) {
      await this.toast.createError(error);
    }
  }

  public async changePassword() {
    this.logger.log(CLASS + ".changePassword");
    try {
      let users = await this.getUsers();
      let currentUser = users.find(user => user.email == this.email);
      
      if(currentUser) {
        this.changeMode("password-reset-confirm");
      } else {
        await this.toast.createError("Can't find user.");
      }
    } catch (error) {
      await this.toast.createError(error);
    }
  }

  public async resetPassword() {
    this.logger.log(CLASS + ".changePassword");
    try {
      let users = await this.getUsers();
      let currentUser = users.find(user => user.email == this.email);
      currentUser.password = this.password;
      let usersJson = JSON.stringify(users);
      await this.storage.setData('users', usersJson);    
      this.changeMode("login");
      await this.toast.createSuccess("Password reset successful. Log in with your new password.");
    } catch (error) {
      await this.toast.createError(error);
    }
  }

  private async getUsers(): Promise<Array<User>> {
    try {
      let data: string = await this.storage.getData('users');
  
      if(data) {
        let users: Array<User> = JSON.parse(data);
        return users;
      } else {
        return new Array<User>();
      }
    } catch (error) {
      await this.toast.createError(error);
    }
  }

  public validatePasswords() {
    this.arePasswordsMatching = this.password == this.passwordRepeat;
  }

  public validateEmail() {
    this.isValidMailAddress = this.email.includes('@');
  }
}
