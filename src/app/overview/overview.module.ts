import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverviewPageRoutingModule } from './overview.routing';
import { OverviewPage } from './overview.page';
import { TransactionAddModalModule } from './transaction-add-modal/transaction-add.modal.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OverviewPageRoutingModule
  ],
  declarations: [
    OverviewPage
  ],
  providers: [
    TransactionAddModalModule
  ]
})
export class OverviewPageModule {}
