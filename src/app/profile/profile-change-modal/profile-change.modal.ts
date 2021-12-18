import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { Category } from "src/app/categories/categories.dtos";
import { User } from "src/app/login/login.dtos";
import { LoggerService } from "../../services/logger.service";
import { StorageService } from "../../services/storage.service";
import { ToastService } from "../../services/toast.service";

const CLASS = "ProfileChangeModal";

@Component({
  selector: 'profile-change-modal',
  templateUrl: 'profile-change.modal.html',
  styles: [`
    .transparent {
      --background: transparent;
    }

    ion-input, ion-textarea {
        --color: #000;
        --padding-bottom: 15px;
        --padding-top: 15px;
        --padding-start: 4px;
        font-size: 14px;
        text-indent: 1px;
        padding-left: 10px !important;
    }
  `]
})
export class ProfileChangeModal implements OnInit {
  constructor(
      private readonly modalController: ModalController,
      private readonly logger: LoggerService,
      private readonly storage: StorageService,
      private readonly toast: ToastService
  ) { }

  public email: string;
  public currentPassword: string;
  public currentPasswordIsMatching: boolean;
  public newPassword: string;
  public newPasswordRepeat: string;
  public arePasswordsMatching: boolean;
  public isValidMailAddress: boolean;
  
  private currentUser: User;

  public async ngOnInit() {
      this.load();
  }

  private async load() {
      this.logger.log(CLASS + ".load");
      try {
          let currentUserJson = await this.storage.getData("currentUser");
          this.currentUser = JSON.parse(currentUserJson);
          
          if(this.currentUser) {
              this.email = this.currentUser.email;
          }
      } catch (error) {
          this.toast.createError(error);
      }
  }

  public async saveModal() {
    this.logger.log(CLASS + ".saveModal");
    try {
      let usersJson = await this.storage.getData("users");
      let users: Array<User> = JSON.parse(usersJson);
      let userToUpdate = users.find(user => user.email == this.currentUser.email);

      if(userToUpdate) {
          userToUpdate.email = this.email;
          this.currentUser.email = this.email;
          
          if(this.newPassword) {
              userToUpdate.password = this.newPassword;
              this.currentUser.password = this.newPassword;
          }

          this.saveDataToStorage(users);
          this.storage.setData("currentUser", JSON.stringify(this.currentUser));
      }
      this.closeModal();
      this.toast.createSuccess("User modified successfully");
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private saveDataToStorage(users: Array<User>) {
    this.storage.setData("users", JSON.stringify(users));
  }

  public async closeModal() {
    this.logger.log(CLASS + ".closeModal");
    await this.modalController.dismiss();
  }

  public validateCurrentPassword() {
    this.currentPasswordIsMatching = this.currentPassword == this.currentUser.password;
  }

  public validatePasswords() {
    this.arePasswordsMatching = this.newPassword == this.newPasswordRepeat;
  }

  public validateEmail() {
    this.isValidMailAddress = this.email.includes('@');
  }
}