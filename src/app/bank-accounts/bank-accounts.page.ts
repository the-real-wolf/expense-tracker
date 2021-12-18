import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ViewWillEnter } from '@ionic/angular';
import { Transaction } from '../overview/overview.dtos';
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
export class BankAccountsPage implements ViewWillEnter {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController
  ) {}

  public bankAccounts: Array<BankAccount> = new Array<BankAccount>();

  private userIdent: string;

  public async ionViewWillEnter() {
    this.userIdent = await this.storage.getCurrentUserIdent();
    this.load();
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let bankAccountsJson = await this.storage.getData("bankaccounts");
      let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);
      if(bankAccounts) {
        this.bankAccounts = bankAccounts.filter(bankAccount => bankAccount.userIdent == this.userIdent);
      }
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
      message: 'Deleting your bank account automatically deletes all connected transactions. Are you sure you want to delete your bank account? ',
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
      let bankAccountsJson = await this.storage.getData("bankaccounts");
      let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);
      let bankAccountToDelete = bankAccounts.find(bankAccount => bankAccount.iban == iban);
      let indexToDelete = bankAccounts.indexOf(bankAccountToDelete, 0);
      
      if(indexToDelete > -1) {
        bankAccounts.splice(indexToDelete, 1);
        this.storage.setData("bankaccounts", JSON.stringify(bankAccounts));
        await this.deleteAllTransactions(bankAccountToDelete.bankName);
        this.load();
      } else {
        this.toast.createError("Item not found!");
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private async deleteAllTransactions(bankAccountName: string) {
    this.logger.log(CLASS + ".deleteAllTransactions");
    try {
      let transactionsJson = await this.storage.getData("transactions");
      let transactions: Array<Transaction> = JSON.parse(transactionsJson);
      let transactionsToDelete = transactions.filter(transaction => transaction.bankAccountName == bankAccountName && transaction.userIdent == this.userIdent);
      
      for(let transaction of transactionsToDelete) {
        let indexToDelete = transactions.indexOf(transaction, 0);
        if(indexToDelete > -1) {
          transactions.splice(indexToDelete, 1);
        }
      }

      this.storage.setData("transactions", JSON.stringify(transactions));
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
