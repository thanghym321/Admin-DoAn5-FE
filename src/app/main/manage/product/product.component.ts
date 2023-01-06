import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit,AfterViewInit {

  //list
  list_category: any;
  list_producer: any;
  list_unit: any;

  list_product: any;
  totalProduct: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  product: any;
  isCreate = false;
  showUpdateModal: any;
  frmProduct: FormGroup;
  doneSetupForm: any;
  file: any;

  imagePreview: any;


  constructor(injector: Injector) {
    super(injector);
    this.frmSearch = new FormGroup({
      'txt_name': new FormControl(''),
      'txt_category_Id': new FormControl(''),
    });
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js', 'assets/js/pages/dashboard.js');
  }

  ngOnInit(): void {
    this.loadProduct();
    this.loadCategory();
    this.loadProducer();
    this.loadUnit();
  }

  public loadUnit(){
    this._api.get('/api/Units/get').subscribe(res => {
      this.list_unit = res;
    });
  }

  public loadProducer(){
    this._api.get('/api/Producers/get').subscribe(res => {
      this.list_producer = res;
    });

  }

  public loadCategory(){
    this._api.get('/api/Categories/get').subscribe(res => {
      this.list_category = res;
    });

  }

  public loadProduct(){
    this._api.get('/api/Products/getallpaging?'
    +'Category_Id=' + this.frmSearch.value['txt_category_Id']
    +'&pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    ).subscribe(res => {
      this.list_product = res.items;
      this.totalProduct=res.totalItem;
      console.log(this.list_product)
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadProduct();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadProduct();
  }

  get category_Id() {
    return this.frmProduct.get('txt_category_Id')!;
  }
  get name() {
    return this.frmProduct.get('txt_name')!;
  }
  get description() {
    return this.frmProduct.get('txt_description')!;
  }
  get producer_Id() {
    return this.frmProduct.get('txt_producer_Id')!;
  }
  get price() {
    return this.frmProduct.get('txt_price')!;
  }
  get unit_Id() {
    return this.frmProduct.get('txt_unit_Id')!;
  }
  get status() {
    return this.frmProduct.get('txt_status')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmProduct = new FormGroup({
        'txt_category_Id': new FormControl('',[Validators.required]),
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_description': new FormControl('', [Validators.minLength(3)]),
        'txt_producer_Id': new FormControl('',[Validators.required]),
        'txt_price': new FormControl('',[Validators.required]),
        'txt_unit_Id': new FormControl('',[Validators.required]),
        'txt_status': new FormControl('', [Validators.required]),
      });
      this.imagePreview="";
    });
  }

  public openUpdateModal(id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this._api.get('/api/Products/getbyid/' + id).subscribe(res => {
        this.product = res;
        this.doneSetupForm = true;
        this.frmProduct = new FormGroup({
          'txt_category_Id': new FormControl(this.product.category_Id,[Validators.required]),
          'txt_name': new FormControl(this.product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_description': new FormControl(this.product.description, [Validators.minLength(3)]),
          'txt_producer_Id': new FormControl(this.product.producer_Id,[Validators.required]),
          'txt_price': new FormControl(this.product.price,[Validators.required]),
          'txt_unit_Id': new FormControl(this.product.unit_Id,[Validators.required]),
          'txt_status': new FormControl(this.product.status, [Validators.required]),
        });
        this.imagePreview=this.product.image;
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Products/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadProduct();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this._api.uploadFileSingle('/api/upload/upload', 'product', this.file).subscribe((res: any) => {
        this.imagePreview = res.body.filePath;
      });
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmProduct.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmProduct.invalid) {
      return;
    }
    let product: any;
    product = {
      Category_Id: Number(vl.txt_category_Id),
      Name: vl.txt_name,
      Description: vl.txt_description,
      Producer_Id: Number(vl.txt_producer_Id),
      Price: vl.txt_price,
      Unit_Id: Number(vl.txt_unit_Id),
      Status: Number(vl.txt_status)
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'product', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            product.Image = res.body.filePath;
            this._api.post('/api/Products/create', product).subscribe(res => {
              if (res && res.data) {
                alert('Thêm dữ liệu thành công');
                this.loadProduct();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.post('/api/Products/create', product).subscribe(res => {
          if (res && res.data) {
            alert('Thêm dữ liệu thành công');
            this.loadProduct();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    } else {
      debugger;
      product.id = this.product.id;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'product', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            product.Image = res.body.filePath;
            this._api.put('/api/Products/update', product).subscribe(res => {
              if (res && res.data) {
                alert('Cập nhật dữ liệu thành công');
                this.loadProduct();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.put('/api/Products/update', product).subscribe(res => {
          if (res && res.data) {
            alert('Cập nhật dữ liệu thành công');
            this.loadProduct();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    }

  }
}
