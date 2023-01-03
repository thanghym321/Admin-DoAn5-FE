import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent extends BaseComponent implements OnInit {
public list_item:any;
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
     this._api.post('/api/order/search', {page:1, pageSize:10}).subscribe(res => {
      this.list_item = res.data;
      setTimeout(() => {
        this.loadScripts('assets/js/core/app.js');
      });
    });
  }
}
