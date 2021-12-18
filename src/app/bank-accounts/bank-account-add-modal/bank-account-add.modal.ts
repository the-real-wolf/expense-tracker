import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { Transaction } from "../../overview/overview.dtos";
import { LoggerService } from "../../services/logger.service";
import { StorageService } from "../../services/storage.service";
import { ToastService } from "../../services/toast.service";
import { BankAccount } from "../bank-accounts.dtos";

const CLASS = "BankAccountsAddModal";

@Component({
    selector: 'bank-account-add-modal',
    templateUrl: 'bank-account-add.modal.html',
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
export class BankAccountAddModal implements OnInit{
    constructor(
        private readonly modalController: ModalController,
        private readonly navParams: NavParams,
        private readonly logger: LoggerService,
        private readonly storage: StorageService,
        private readonly toast: ToastService
    ) { }

    public bankName: string;
    public iban: string;
    public bic: string;
    
    private isEditMode: boolean = false;
    private ibanBackUp: string;

    public async ngOnInit() {
      this.iban = this.navParams.data.iban;
      if(this.iban) {
        let bankAccountsJson = await this.storage.getData("bankaccounts");
        let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);
        let bankAccount = bankAccounts.find(bankAccount => bankAccount.iban == this.iban);
        
        if(bankAccount) {
          this.bankName = bankAccount.bankName;
          this.iban = bankAccount.iban;
          this.ibanBackUp = bankAccount.iban;
          this.bic = bankAccount.bic;
          this.isEditMode = true;
        }
      }
    }

    public async saveModal() {
      this.logger.log(CLASS + ".saveModal");
      try {
        let userIdent = await this.storage.getCurrentUserIdent();
        let bankAccountsJson = await this.storage.getData("bankaccounts");
        let existingBankAccounts = JSON.parse(bankAccountsJson);
        let bankAccounts: Array<BankAccount> = existingBankAccounts ?? new Array<BankAccount>();

        if(this.isEditMode) {
          let bankAccount = bankAccounts.find(bankAccount => bankAccount.iban == this.ibanBackUp);

          if(bankAccount) {
            this.updateAllTransactions(bankAccount.bankName);
            bankAccount.bankName = this.bankName;
            bankAccount.iban = this.iban;
            bankAccount.bic = this.bic;
          }
          this.toast.createSuccess("Bank Account edited successfully");
        } else {
            bankAccounts.push(new BankAccount(this.bankName, this.iban, this.bic, userIdent));
            this.toast.createSuccess("Bank Account created successfully");
        }

        this.saveDataToStorage(bankAccounts);
        this.closeModal();
      } catch (error) {
        this.toast.createError(error);
      }
    }

    private saveDataToStorage(bankAccounts: Array<BankAccount>) {
      this.storage.setData("bankaccounts", JSON.stringify(bankAccounts));
    }

    public async closeModal() {
      this.logger.log(CLASS + ".closeModal");
      await this.modalController.dismiss();
    }

    private async updateAllTransactions(oldBankName: string) {
      this.logger.log(CLASS + ".updateAllTransactions");
      try {
        let userIdent = await this.storage.getCurrentUserIdent();
        let transactionsJson = await this.storage.getData("transactions");
        let transactions: Array<Transaction> = JSON.parse(transactionsJson);
        let transactionsOfUser: Array<Transaction> = transactions.filter(transaction => transaction.bankAccountName == oldBankName && transaction.userIdent == userIdent);
        
        for(let transaction of transactionsOfUser) {
          let transactionToModify = transactions.find(obj => obj.ident == transaction.ident);
          transactionToModify.bankAccountName = this.bankName;
        }

        await this.storage.setData("transactions", JSON.stringify(transactions));
      } catch (error) {
        this.toast.createError(error);
      }
    }
}