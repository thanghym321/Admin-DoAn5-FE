import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { InfoUserComponent } from './info-user/info-user.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [InfoUserComponent,ManageUserComponent ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'info-user',
        component: InfoUserComponent,
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
      },
  ]),
  ]
})
export class UserModule { }
