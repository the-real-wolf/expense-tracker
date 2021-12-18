import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ViewDidEnter } from '@ionic/angular';
import { BankAccount } from '../bank-accounts/bank-accounts.dtos';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { SelectItem, Transaction } from './overview.dtos';
import { TransactionAddModal } from './transaction-add-modal/transaction-add.modal';

const CLASS = "OverviewPage";

@Component({
  selector: 'overview',
  templateUrl: 'overview.page.html'
})
export class OverviewPage implements ViewDidEnter {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController,
    private readonly router: Router
  ) {}

  public totalBalance: number = 0;
  public transactions: Array<Transaction> = new Array<Transaction>();
  public selectedBankAccount: string;
  public bankAccountSelectItems: Array<SelectItem>;
  private userIdent: string;

  public async ionViewDidEnter() {
    this.userIdent = await this.storage.getCurrentUserIdent();
    this.loadSelectedBankAccount();
  }
  
  private async loadSelectedBankAccount() {
    this.logger.log(CLASS + ".loadSelectedBankAccount");
    try {
      let bankAccountsJson = await this.storage.getData("bankaccounts");
      let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);

      if(bankAccounts) {
        let filteredBankAccounts = bankAccounts.filter(bankAccount => bankAccount.userIdent == this.userIdent);
        this.bankAccountSelectItems = filteredBankAccounts.map(bankAccount => new SelectItem(bankAccount.bankName));

        if(filteredBankAccounts.length > 0) {
          this.selectedBankAccount = filteredBankAccounts[0].bankName;
        }
        this.load();
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let transactionsJson = await this.storage.getData("transactions");
      let transactions: Array<Transaction> = JSON.parse(transactionsJson);

      if(transactions) {
        this.transactions = transactions.filter(transaction => transaction.userIdent == this.userIdent && transaction.bankAccountName == this.selectedBankAccount);
        this.transactions.sort((a: Transaction, b: Transaction) => {
          return +new Date(a.date) - +new Date(b.date);
        });
        this.transactions.reverse();
        this.calculateTotalBalance();
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public refresh() {
    this.load();
  }

  private async calculateTotalBalance() {
    this.totalBalance = 0;
    for(let transaction of this.transactions) {
      this.totalBalance = transaction.type == "income" ? this.totalBalance + transaction.amount : this.totalBalance - transaction.amount;
    }
  }

  public async createTransaction() {
    this.logger.log(CLASS + ".createTransaction");
    try {
      let modal = await this.modalCtrl.create({
        component: TransactionAddModal
      });

      modal.onDidDismiss().then(() => {
        this.load();
      });

      return await modal.present();
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async editTransaction(ident: string) {
    this.logger.log(CLASS + ".editTransaction");
    try {
      let modal = await this.modalCtrl.create({
        component: TransactionAddModal,
        componentProps: {
          "ident": ident
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

  public async showDeleteDialog(ident: string) {
    this.logger.log(CLASS + ".showDeleteDialog");
    const alert = await this.alertCtrl.create({
      header: 'Delete Transaction',
      message: 'Are you sure you want to delete this transaction?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'DELETE',
          handler: () => {
            this.deleteTransaction(ident);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteTransaction(ident: string) {
    try {
      let transactionsJson = await this.storage.getData("transactions");
      let transactions: Array<Transaction> = JSON.parse(transactionsJson);
      let transactionToDelete = transactions.find(transaction => transaction.ident == ident);
      let indexToDelete = transactions.indexOf(transactionToDelete, 0);
      
      if(indexToDelete > -1) {
        transactions.splice(indexToDelete, 1);
        this.storage.setData("transactions", JSON.stringify(transactions));
        this.load();
      } else {
        this.toast.createError("Item not found!");
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public navigateToBankAccounts() {
    this.logger.log(CLASS + ".navigateToBankAccounts");
    this.router.navigateByUrl("tabs/bankaccounts"); 
  }
}
