import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { User } from '../login/login.dtos';
import { StorageService } from './storage.service';

const CLASS = "AuthGuardService";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    constructor(
        private readonly storage: StorageService,
        private readonly router: Router
    ) { }

    public async canActivate() {
        let currentUserJson = await this.storage.getData('currentUser');
        let currentUser: User = JSON.parse(currentUserJson);

        if(currentUser) {
            return true;
        } else {
            this.router.navigate(['login']);
            return false;
        }
    }
}
