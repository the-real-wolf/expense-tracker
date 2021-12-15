import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../login/login.dtos';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { ProfileChangeModal } from './profile-change-modal/profile-change.modal';

const CLASS = "ProfilePage";

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styles: [`
    .password-placeholder {
      -webkit-text-security: disc; 
      font-size: 25px;
    }
  `]
})
export class ProfilePage implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController
  ) { }

  public currentUser: User;

  public ngOnInit() {
    this.load();
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let currentUserJson = await this.storage.getData("currentUser");
      this.currentUser = JSON.parse(currentUserJson);
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async changeProfile() {
    this.logger.log(CLASS + ".changeProfile");
    try {
      let modal = await this.modalCtrl.create({
        component: ProfileChangeModal
      });

      modal.onDidDismiss().then(() => {
        this.load();
      });

      return await modal.present();
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
