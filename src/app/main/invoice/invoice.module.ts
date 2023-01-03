import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderComponent } from './order/order.component';
import { SellComponent } from './sell/sell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [OrderComponent, SellComponent ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'sell',
        component: SellComponent,
      },
  ]),
  ]
})
export class InvoiceModule { }
