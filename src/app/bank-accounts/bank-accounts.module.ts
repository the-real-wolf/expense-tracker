import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAccountsPage } from './bank-accounts.page';
import { BankAccountsRoutingModule } from './bank-accounts.routing';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BankAccountsRoutingModule
  ],
  declarations: [
    BankAccountsPage
  ]
})
export class BankAccountsPageModule {}
