import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAccountsPage } from './bank-accounts.page';
import { BankAccountsRoutingModule } from './bank-accounts.routing';
import { BankAccountsAddModalModule } from './bank-account-add-modal/bank-account-add.modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BankAccountsRoutingModule
  ],
  declarations: [
    BankAccountsPage
  ],
  providers: [
    BankAccountsAddModalModule
  ]
})
export class BankAccountsPageModule {}
