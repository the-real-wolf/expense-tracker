import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { LoggerService } from '../services/logger.service';
import { StorageService } from '../services/storage.service';
import { ToastService } from '../services/toast.service';
import { Category } from './categories.dtos';
import { CategoryAddModal } from './dialogs/category-add-modal/category-add.modal';

const CLASS = "CategoriesPage";

@Component({
  selector: 'categories',
  templateUrl: './categories.page.html'
})
export class CategoriesPage implements OnInit {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly toast: ToastService,
    private readonly modalCtrl: ModalController,
    private readonly alertCtrl: AlertController
  ) { }

  public categories: Array<Category> = new Array<Category>();

  public ngOnInit() {
    this.load();
  }

  private async load() {
    this.logger.log(CLASS + ".load");
    try {
      let categoriesJson = await this.storage.getData("categories");
      this.categories = JSON.parse(categoriesJson);
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async createCategory() {
    this.logger.log(CLASS + ".createCategory");
    try {
      let modal = await this.modalCtrl.create({
        component: CategoryAddModal
      });

      modal.onDidDismiss().then(() => {
        this.load();
      });

      return await modal.present();
    } catch (error) {
      this.toast.createError(error);
    }
  }

  public async editCategory(ident: string) {
    this.logger.log(CLASS + ".editCategory");
    try {
      let modal = await this.modalCtrl.create({
        component: CategoryAddModal,
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
      header: 'Delete Category',
      message: 'Are you sure you want to delete the category?',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary'
        }, 
        {
          text: 'DELETE',
          handler: () => {
            this.deleteCategory(ident);
          }
        }
      ]
    });

    await alert.present();
  }

  private async deleteCategory(ident: string) {
    try {
      let categoryToDelete = this.categories.find(category => category.ident == ident);
      let indexToDelete = this.categories.indexOf(categoryToDelete, 0);
      
      if(indexToDelete > -1) {
        this.categories.splice(indexToDelete, 1);
        this.storage.setData("categories", JSON.stringify(this.categories));
        this.load();
      } else {
        this.toast.createError("Item not found!");
      }
    } catch (error) {
      this.toast.createError(error);
    }
  }
}
