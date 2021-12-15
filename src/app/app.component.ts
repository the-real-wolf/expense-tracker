import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { LoggerService } from './services/logger.service';
import { StorageService } from './services/storage.service';

const CLASS = "AppComponent";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private readonly logger: LoggerService,
    private readonly storage: StorageService,
    private readonly router: Router,
    private readonly menu: MenuController
  ) {
    this.sideMenu();
  }

  public navigate: any;

  private sideMenu() {  
    this.navigate =   
    [  
      { 
        title : 'Profile',  
        url   : '/profile',  
        icon  : 'person-circle-outline'  
      },
      { 
        title : 'Overview',
        url   : '/tabs/overview',
        icon  : 'home-outline' 
      },   
      {  
        title : 'Categories',  
        url   : '/categories',  
        icon  : 'folder-open-outline'   
      },   
      {  
        title : 'Bank Accounts',  
        url   : '/tabs/bankaccounts',  
        icon  : 'wallet-outline'   
      }
    ];  
  } 
  
  public async logout() {
    this.logger.log(CLASS + ".logout");
    try {
      let currentUser = await this.storage.getData("currentUser");
      if(currentUser) {
        await this.storage.removeData("currentUser");
      }
      this.router.navigate(["login"]);
      this.menu.close();
    } catch (error) {
      this.logger.logError(error);
    }
  }
}
