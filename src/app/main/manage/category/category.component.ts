import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
declare var $: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends BaseComponent implements OnInit,AfterViewInit {

  allCategory: any;
  list_category: any;
  totalCategory: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  frmSearch: FormGroup

  category: any;
  isCreate = false;
  showUpdateModal: any;
  frmCategory: FormGroup;
  doneSetupForm: any;
  file: any=1;

  imagePreview: any;

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
    this.loadCategory();
    this.loadAllCategory();
  }

  public loadAllCategory(){
    this._api.get('/api/Categories/get').subscribe(res => {
      this.allCategory = res;
    });
  }

  public loadCategory(){
    this._api.get('/api/Categories/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&Name=' + this.frmSearch.value['txt_name']
    ).subscribe(res => {
      this.list_category = res.items;
      this.totalCategory=res.totalItem;
    });
  }

  public loadPageIndex(pageIndex: any) {
    this.pageIndex=pageIndex;
    this.loadCategory();
  }

  public loadPageSize(pageSize:any) {
    this.pageIndex=1;
    this.pageSize=pageSize;
    this.loadCategory();
  }

  get name() {
    return this.frmCategory.get('txt_name')!;
  }
  get status() {
    return this.frmCategory.get('txt_status')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmCategory = new FormGroup({
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_status': new FormControl('', [Validators.required]),
        'txt_parentId': new FormControl(''),
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
      this._api.get('/api/Categories/getbyid/' + id).subscribe(res => {
        debugger;
        this.category = res;
        this.doneSetupForm = true;
        this.frmCategory = new FormGroup({
          'txt_name': new FormControl(this.category.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_status': new FormControl(this.category.status, [Validators.required]),
          'txt_parentId': new FormControl(this.category.parentId),
        });
        this.imagePreview=this.category.image;
      });
    });
  }

  public onRemove(id: any) {
    this._api.delete('/api/Categories/delete', id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadCategory();
    });
  }

  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }

  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this._api.uploadFileSingle('/api/upload/upload', 'category', this.file).subscribe((res: any) => {
        this.imagePreview = res.body.filePath;
      });
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmCategory.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    console.log(this.findInvalidControls())
    if (this.frmCategory.invalid) {
      return;
    }
    let category: any;
    category = {
      Name: vl.txt_name,
      Status: Number(vl.txt_status),
      ParentId: Number(vl.txt_parentId),
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'category', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            category.Image = res.body.filePath;
            this._api.post('/api/Categories/create', category).subscribe(res => {
              if (res && res.data) {
                alert('Thêm dữ liệu thành công');
                this.loadCategory();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else{
        this._api.post('/api/Categories/create', category).subscribe(res => {
          if (res && res.data) {
            alert('Thêm dữ liệu thành công');
            this.loadCategory();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    } else {
      category.id = this.category.id;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'category', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            category.Image = res.body.filePath;
            this._api.put('/api/Categories/update', category).subscribe(res => {
              if (res && res.data) {
                alert('Cập nhật dữ liệu thành công');
                this.loadCategory();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.put('/api/Categories/update', category).subscribe(res => {
          if (res && res.data) {
            alert('Cập nhật dữ liệu thành công');
            this.loadCategory();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    }

  }

}
