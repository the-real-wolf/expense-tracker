import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { BankAccount } from "../../bank-accounts/bank-accounts.dtos";
import { Category } from "../../categories/categories.dtos";
import { LoggerService } from "../../services/logger.service";
import { StorageService } from "../../services/storage.service";
import { ToastService } from "../../services/toast.service";
import { SelectItem, Transaction } from "../overview.dtos";

const CLASS = "TransactionAddModal";

@Component({
    selector: 'transaction-add-modal',
    templateUrl: 'transaction-add.modal.html',
    styles: [`
      .transparent {
        --background: transparent;
      }

      ion-input, ion-textarea, ion-select::part(placeholder), ion-select::part(text) {
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
export class TransactionAddModal implements OnInit{
  constructor(
      private readonly modalController: ModalController,
      private readonly navParams: NavParams,
      private readonly logger: LoggerService,
      private readonly storage: StorageService,
      private readonly toast: ToastService
  ) { }

  public date: Date;
  public categoryName: string;
  public bankAccountName: string;
  public amount: number;
  public type: "expense" | "income" = "expense";
  public formIsValid: boolean = false;
  public categorySelectItems: Array<SelectItem> = new Array<SelectItem>();
  public bankAccountSelectItems: Array<SelectItem> = new Array<SelectItem>();
  
  private ident: string;
  private userIdent: string;
  private isEditMode: boolean = false;

  public async ngOnInit() {
    this.ident = this.navParams.data.ident;
    this.userIdent = await this.storage.getCurrentUserIdent();
    this.load();
    this.loadCategorySelectItems();
    this.loadBankAccountSelectItems();
  }
    
  private async load() {
    this.logger.log(CLASS + ".load");
    try {        
      if(this.ident) {
        let transactionsJson = await this.storage.getData("transactions");
        let transactions: Array<Transaction> = JSON.parse(transactionsJson);
        let transaction = transactions.find(category => category.ident == this.ident);
        
        if(transaction) {
          this.date = transaction.date;
          this.categoryName = transaction.categoryName;
          this.bankAccountName = transaction.bankAccountName;
          this.amount = transaction.amount;
          this.type = transaction.type;
          this.isEditMode = true;
        }
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private async loadCategorySelectItems() {
    this.logger.log(CLASS + "loadCategorySelectItems");
    try {
      let categoriesJson = await this.storage.getData("categories");
      let categories: Array<Category> = JSON.parse(categoriesJson);

      if(categories) {
        let filteredCategories = categories.filter(category => category.userIdent == this.userIdent);
        this.categorySelectItems = filteredCategories.map(category => new SelectItem(category.name));
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private async loadBankAccountSelectItems() {
    this.logger.log(CLASS + "loadBankAccountSelectItems");
    try {
      let bankAccountsJson = await this.storage.getData("bankaccounts");
      let bankAccounts: Array<BankAccount> = JSON.parse(bankAccountsJson);

      if(bankAccounts) {
        let filteredBankAccounts = bankAccounts.filter(bankAccount => bankAccount.userIdent == this.userIdent);
        this.bankAccountSelectItems = filteredBankAccounts.map(bankAccount => new SelectItem(bankAccount.bankName));
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async saveModal() {
    this.logger.log(CLASS + ".saveModal");
    try {
      let userIdent = await this.storage.getCurrentUserIdent();
      let transactionsJson = await this.storage.getData("transactions");
      let existingTransactions = JSON.parse(transactionsJson);
      let transactions: Array<Transaction> = existingTransactions ?? new Array<Transaction>();

      if(this.isEditMode) {
        let transaction = transactions.find(transaction => transaction.ident == this.ident);

        if(transaction) {
          transaction.date = this.date;
          transaction.categoryName = this.categoryName;
          transaction.amount = this.amount;
          transaction.type = this.type;
          transaction.bankAccountName = this.bankAccountName;
        }
        this.toast.createSuccess("Transaction edited successfully");
      } else {
        transactions.push(new Transaction(this.date, this.categoryName, this.amount, this.type, userIdent, this.bankAccountName));
        this.toast.createSuccess("Transaction created successfully");
      }

      this.saveDataToStorage(transactions);
      this.closeModal();
    } catch (error) {
      this.toast.createError(error);
    }
  }

  private saveDataToStorage(transactions: Array<Transaction>) {
    this.storage.setData("transactions", JSON.stringify(transactions));
  }

  public async closeModal() {
    this.logger.log(CLASS + ".closeModal");
    await this.modalController.dismiss();
  }

  public validateForm() {
    this.formIsValid = (this.date && this.amount != undefined && this.bankAccountName != undefined);
  }
}