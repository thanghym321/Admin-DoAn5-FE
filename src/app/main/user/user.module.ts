import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ManageUserComponent ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'manage-user',
        component: ManageUserComponent,
      },
  ]),
  ]
})
export class UserModule { }
