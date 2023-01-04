import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductComponent } from './product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoryComponent } from './category/category.component';



@NgModule({
  declarations: [ProductComponent, CategoryComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,ReactiveFormsModule,NgxPaginationModule,
    RouterModule.forChild([
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'category',
        component: CategoryComponent,
      },
  ]),
  ]
})
export class ManageModule { }
