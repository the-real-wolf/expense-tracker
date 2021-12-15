import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile.routing';
import { ProfilePage } from './profile.page';
import { ProfileChangeModalModule } from './profile-change-modal/profile-change.modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [
    ProfilePage
  ],
  providers: [
    ProfileChangeModalModule
  ]
})
export class ProfilePageModule {}
