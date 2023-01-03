import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,ReactiveFormsModule,NgxPaginationModule,
    RouterModule.forChild([
      {
        path: 'product',
        component: ProductComponent,
      },
      // {
      //   path: 'sell',
      //   component: SellComponent,
      // },
  ]),
  ]
})
export class ManageModule { }
