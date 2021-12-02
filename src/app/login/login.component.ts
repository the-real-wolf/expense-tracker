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

  ngOnInit() {}

  public login() {
    this.router.navigateByUrl("/tabs");
  }

  public register() {

  }
}
