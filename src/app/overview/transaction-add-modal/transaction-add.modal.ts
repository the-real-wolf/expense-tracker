import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { LoggerService } from "../../services/logger.service";
import { StorageService } from "../../services/storage.service";
import { ToastService } from "../../services/toast.service";
import { Transaction } from "../overview.dtos";

const CLASS = "TransactionAddModal";

@Component({
    selector: 'transaction-add-modal',
    templateUrl: 'transaction-add.modal.html',
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
    public amount: number;
    public type: "expense" | "income" = "expense";
    public formIsValid: boolean = false;
    
    private ident: string;
    private isEditMode: boolean = false;

    public async ngOnInit() {
      this.ident = this.navParams.data.ident;

      if(this.ident) {
        let transactionsJson = await this.storage.getData("transactions");
        let transactions: Array<Transaction> = JSON.parse(transactionsJson);
        let transaction = transactions.find(category => category.ident == this.ident);
        
        if(transaction) {
          this.date = transaction.date;
          this.categoryName = transaction.categoryName;
          this.amount = transaction.amount;
          this.isEditMode = true;
        }
      }
    }

    public async saveModal() {
      this.logger.log(CLASS + ".saveModal");
      try {
        let transactionsJson = await this.storage.getData("transactions");
        let existingTransactions = JSON.parse(transactionsJson);
        let transactions: Array<Transaction> = existingTransactions ?? new Array<Transaction>();

        if(this.isEditMode) {
          let transaction = transactions.find(category => category.ident == this.ident);

          if(transaction) {
            transaction.date = this.date;
            transaction.categoryName = this.categoryName;
            transaction.amount = this.amount;
          }
        } else {
          transactions.push(new Transaction(this.date, this.categoryName, this.amount, this.type));
        }

        this.saveDataToStorage(transactions);
        this.closeModal();
        this.toast.createSuccess("Transaction created successfully");
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
      this.formIsValid = (this.date && this.amount != undefined);
    }
}