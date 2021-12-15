import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
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

    public async ngOnInit() {
      this.iban = this.navParams.data.iban;
      if(this.iban) {
        let bankAccountsJson = await this.storage.getData("bankaccounts");
        let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);
        let bankAccount = bankAccounts.find(bankAccount => bankAccount.iban == this.iban);
        
        if(bankAccount) {
          this.bankName = bankAccount.bankName;
          this.iban = bankAccount.iban;
          this.bic = bankAccount.bic;
          this.isEditMode = true;
        }
      }
    }

    public async saveModal() {
      this.logger.log(CLASS + ".saveModal");
      try {
        let bankAccountsJson = await this.storage.getData("bankaccounts");
        let existingBankAccounts = JSON.parse(bankAccountsJson);
        let bankAccounts: Array<BankAccount> = existingBankAccounts ?? new Array<BankAccount>();

        if(this.isEditMode) {
          let bankAccount = bankAccounts.find(bankAccount => bankAccount.iban == this.iban);

          if(bankAccount) {
            bankAccount.bankName = this.bankName;
            bankAccount.iban = this.iban;
            bankAccount.bic = this.bic;
          }
        } else {
            bankAccounts.push(new BankAccount(this.bankName, this.iban, this.bic));
        }

        this.saveDataToStorage(bankAccounts);
        this.closeModal();
        this.toast.createSuccess("Bank Account created successfully");
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
}