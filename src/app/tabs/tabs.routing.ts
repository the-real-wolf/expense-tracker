import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../services/authGuard.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'overview',
        loadChildren: () => import('../overview/overview.module').then(m => m.OverviewPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: 'bankaccounts',
        loadChildren: () => import('../bank-accounts/bank-accounts.module').then(m => m.BankAccountsPageModule),
        canActivate: [AuthGuardService]
      },
      {
        path: '',
        redirectTo: '/tabs/overview',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/overview',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class TabsPageRoutingModule {

}
