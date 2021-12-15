import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoriesPageRoutingModule } from './categories.routing';
import { CategoriesPage } from './categories.page';
import { CategoryAddModalModule } from './dialogs/category-add-modal/category-add.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriesPageRoutingModule
  ],
  declarations: [
    CategoriesPage
  ],
  providers: [
    CategoryAddModalModule
  ]
})
export class CategoriesPageModule {}
