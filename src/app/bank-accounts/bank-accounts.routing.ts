import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankAccountsPage } from './bank-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountsRoutingModule {}
