import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor() {
    this.sideMenu();
  }

  public navigate: any;

  private sideMenu() {  
    this.navigate =   
    [  
        { 
        title : 'Home',
        url   : '/tabs/tab1',
        icon  : 'home' 
        },
      { 
        title : 'Profile',  
        url   : '/tabs/tab3',  
        icon  : 'person-circle-outline'  
      },   
      {  
        title : 'Bank Accounts',  
        url   : '/tabs/tab2',  
        icon  : 'wallet-outline'   
      },  
      {
        title : 'Logout',
        url   : '/login',
        icon  : 'log-out'
      },
    ];  
  }  
}
