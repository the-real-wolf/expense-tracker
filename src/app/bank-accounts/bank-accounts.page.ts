import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { BankAccountAddModal } from './bank-account-add-modal/bank-account-add.modal';
import { BankAccount } from './bank-accounts.dtos';

const CLASS = "BankAccountsPage";

@Component({
  selector: 'bank-accounts',
  templateUrl: 'bank-accounts.page.html'
})
export class BankAccountsPage implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController
  ) {}

  public bankAccounts: Array<BankAccount> = new Array<BankAccount>();

  public ngOnInit() {
    this.load();
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let bankAccountsJson = await this.storage.getData("bankaccounts");
      this.bankAccounts = JSON.parse(bankAccountsJson);
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async createBankAccount() {
    this.logger.log(CLASS + ".createBankAccount");
    try {
      let modal = await this.modalCtrl.create({
        component: BankAccountAddModal
      });

      modal.onDidDismiss().then(() => {
        this.load();
      });

      return await modal.present();
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async editBankAcccount(iban: string) {
    this.logger.log(CLASS + ".editBankAcccount");
    try {
      let modal = await this.modalCtrl.create({
        component: BankAccountAddModal,
        componentProps: {
          "iban": iban
        }
      });

      modal.onDidDismiss().then(() => {
        this.load();
      });

      return await modal.present();
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async showDeleteDialog(iban: string) {
    this.logger.log(CLASS + ".showDeleteDialog");
    const alert = await this.alertCtrl.create({
      header: 'Delete Bank Account',
      message: 'Are you sure you want to delete the bank account?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'DELETE',
          handler: () => {
            this.deleteBankAccount(iban);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteBankAccount(iban: string) {
    try {
      let bankAccountToDelete = this.bankAccounts.find(bankAccount => bankAccount.iban == iban);
      let indexToDelete = this.bankAccounts.indexOf(bankAccountToDelete, 0);
      
      if(indexToDelete > -1) {
        this.bankAccounts.splice(indexToDelete, 1);
        this.storage.setData("bankaccounts", JSON.stringify(this.bankAccounts));
        this.load();
      } else {
        this.toast.createError("Item not found!");
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
