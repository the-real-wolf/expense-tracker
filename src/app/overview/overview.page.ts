import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { Transaction } from './overview.dtos';
import { TransactionAddModal } from './transaction-add-modal/transaction-add.modal';

const CLASS = "OverviewPage";

@Component({
  selector: 'overview',
  templateUrl: 'overview.page.html'
})
export class OverviewPage implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController
  ) {}

  public totalBalance: number = 0;
  public transactions: Array<Transaction>;

  public ngOnInit() {
      this.load();
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let transactionsJson = await this.storage.getData("transactions");
      this.transactions = JSON.parse(transactionsJson);
      this.transactions.sort((a: Transaction, b: Transaction) => {
        return +new Date(a.date) - +new Date(b.date);
      });
      this.transactions.reverse();
      this.calculateTotalBalance();
    } catch (error) {
      this.toast.createError(error);
    }
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
      let transactionToDelete = this.transactions.find(category => category.ident == ident);
      let indexToDelete = this.transactions.indexOf(transactionToDelete, 0);
      
      if(indexToDelete > -1) {
        this.transactions.splice(indexToDelete, 1);
        this.storage.setData("transactions", JSON.stringify(this.transactions));
        this.load();
      } else {
        this.toast.createError("Item not found!");
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
