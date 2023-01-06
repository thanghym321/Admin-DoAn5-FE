import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '../../../core/common/base-component';
declare var $: any;


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent extends BaseComponent implements OnInit,AfterViewInit {


  list_export_invoice: any;
  totalProduct: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  export_Invoice: any;
  isCreate = false;
  showUpdateModal: any;
  frmExport_Invoice: FormGroup;
  doneSetupForm: any;
  file: any;

  imagePreview: any;

public list_item:any;

  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_name': new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadExport_Invoice();
  }

  public loadExport_Invoice(){
    this._api.get('/api/Export_Invoices/getallpaging?'
    +'&pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    ).subscribe(res => {
      this.list_export_invoice = res.items;
      this.totalProduct=res.totalItem;
      console.log(this.list_export_invoice)
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadExport_Invoice();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadExport_Invoice();
  }

  // get category_Id() {
  //   return this.export_Invoice.get('txt_category_Id')!;
  // }
  // get name() {
  //   return this.export_Invoice.get('txt_name')!;
  // }
  // get description() {
  //   return this.export_Invoice.get('txt_description')!;
  // }
  // get producer_Id() {
  //   return this.export_Invoice.get('txt_producer_Id')!;
  // }
  // get price() {
  //   return this.export_Invoice.get('txt_price')!;
  // }
  // get unit_Id() {
  //   return this.export_Invoice.get('txt_unit_Id')!;
  // }
  // get status() {
  //   return this.export_Invoice.get('txt_status')!;
  // }


  // public createModal() {
  //   this.showUpdateModal = true;
  //   this.isCreate = true;
  //   setTimeout(() => {
  //     $('#createModal').modal('toggle');
  //     this.doneSetupForm = true;
  //     this.frmExport_Invoice = new FormGroup({
  //       'txt_category_Id': new FormControl('',[Validators.required]),
  //       'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
  //       'txt_description': new FormControl('', [Validators.minLength(3)]),
  //       'txt_producer_Id': new FormControl('',[Validators.required]),
  //       'txt_price': new FormControl('',[Validators.required]),
  //       'txt_unit_Id': new FormControl('',[Validators.required]),
  //       'txt_status': new FormControl('', [Validators.required]),
  //     });
  //     this.imagePreview="";
  //   });
  // }

  public openUpdateModal(id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this._api.get('/api/Export_Invoice_Details/getbyexportinvoiceid/' + id).subscribe(res => {
        this.export_Invoice = res;
        console.log(this.export_Invoice)
        this.doneSetupForm = true;
        // this.frmExport_Invoice = new FormGroup({
        //   'txt_product_Id': new FormControl(this.export_Invoice.product_Id),
        //   'txt_price': new FormControl(this.export_Invoice.price),
        //   'txt_quantity': new FormControl(this.export_Invoice.quantity,),
        // });
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Export_Invoices/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadExport_Invoice();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  // public upload(event: any) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     this.file = event.target.files[0];
  //     this._api.uploadFileSingle('/api/upload/upload', 'product', this.file).subscribe((res: any) => {
  //       this.imagePreview = res.body.filePath;
  //     });
  //   }
  // }
  // public findInvalidControls() {
  //   const invalid = [];
  //   const controls = this.frmProduct.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //       invalid.push(name);
  //     }
  //   }
  //   return invalid;
  // }


  // OnSubmit(vl: any) {
  //   console.log(this.findInvalidControls())
  //   if (this.frmProduct.invalid) {
  //     return;
  //   }
  //   let product: any;
  //   product = {
  //     Category_Id: Number(vl.txt_category_Id),
  //     Name: vl.txt_name,
  //     Description: vl.txt_description,
  //     Producer_Id: Number(vl.txt_producer_Id),
  //     Price: vl.txt_price,
  //     Unit_Id: Number(vl.txt_unit_Id),
  //     Status: Number(vl.txt_status)
  //   }
  //   if (this.isCreate) {
  //     if (this.file) {
  //       this._api.uploadFileSingle('/api/upload/upload-single', 'product', this.file).subscribe((res: any) => {
  //         if (res && res.body && res.body.filePath) {
  //           product.Image = res.body.filePath;
  //           this._api.post('/api/Products/create', product).subscribe(res => {
  //             if (res && res.data) {
  //               alert('Thêm dữ liệu thành công');
  //               this.loadProduct();
  //               this.closeModal();
  //             } else {
  //               alert('Có lỗi')
  //             }
  //           });
  //         }
  //       });
  //     } else {
  //       this._api.post('/api/Products/create', product).subscribe(res => {
  //         if (res && res.data) {
  //           alert('Thêm dữ liệu thành công');
  //           this.loadProduct();
  //           this.closeModal();
  //         } else {
  //           alert('Có lỗi')
  //         }
  //       });
  //     }
  //   } else {
  //     debugger;
  //     product.id = this.product.id;
  //     if (this.file) {
  //       this._api.uploadFileSingle('/api/upload/upload-single', 'product', this.file).subscribe((res: any) => {
  //         if (res && res.body && res.body.filePath) {
  //           product.Image = res.body.filePath;
  //           this._api.put('/api/Products/update', product).subscribe(res => {
  //             if (res && res.data) {
  //               alert('Cập nhật dữ liệu thành công');
  //               this.loadProduct();
  //               this.closeModal();
  //             } else {
  //               alert('Có lỗi')
  //             }
  //           });
  //         }
  //       });
  //     } else {
  //       this._api.put('/api/Products/update', product).subscribe(res => {
  //         if (res && res.data) {
  //           alert('Cập nhật dữ liệu thành công');
  //           this.loadProduct();
  //           this.closeModal();
  //         } else {
  //           alert('Có lỗi')
  //         }
  //       });
  //     }
  //   }

  // }
}
