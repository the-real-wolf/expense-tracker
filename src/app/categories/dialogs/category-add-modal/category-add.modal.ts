import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { LoggerService } from "../../../services/logger.service";
import { StorageService } from "../../../services/storage.service";
import { ToastService } from "../../../services/toast.service";
import { Category } from "../../categories.dtos";

const CLASS = "CategoryAddModal";

@Component({
    selector: 'category-add-modal',
    templateUrl: 'category-add.modal.html',
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
export class CategoryAddModal implements OnInit{
    constructor(
        private readonly modalController: ModalController,
        private readonly navParams: NavParams,
        private readonly logger: LoggerService,
        private readonly storage: StorageService,
        private readonly toast: ToastService
    ) { }

    public name: string;
    public description: string;
    
    private ident: string;
    private isEditMode: boolean = false;

    public async ngOnInit() {
      this.ident = this.navParams.data.ident;
      if(this.ident) {
        let categoriesJson = await this.storage.getData("categories");
        let categories: Array<Category> = JSON.parse(categoriesJson);
        let category = categories.find(category => category.ident == this.ident);
        
        if(category) {
          this.name = category.name;
          this.description = category.description;
          this.isEditMode = true;
        }
      }
    }

    public async saveModal() {
      this.logger.log(CLASS + ".saveModal");
      try {
        let categoriesJson = await this.storage.getData("categories");
        let existingCategories = JSON.parse(categoriesJson);
        let categories: Array<Category> = existingCategories ?? new Array<Category>();

        if(this.isEditMode) {
          let category = categories.find(category => category.ident == this.ident);

          if(category) {
            category.name = this.name;
            category.description = this.description;
          }
        } else {
          categories.push(new Category(this.name, this.description));
        }

        this.saveDataToStorage(categories);
        this.closeModal();
        this.toast.createSuccess("Category created successfully");
      } catch (error) {
        this.toast.createError(error);
      }
    }

    private saveDataToStorage(categories: Array<Category>) {
      this.storage.setData("categories", JSON.stringify(categories));
    }

    public async closeModal() {
      this.logger.log(CLASS + ".closeModal");
      await this.modalController.dismiss();
    }
}