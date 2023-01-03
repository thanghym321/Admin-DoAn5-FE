import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/core/common/base-component';
import MatchValidation from 'src/app/core/helpers/must-match.validator';
declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit,AfterViewInit {

  list_product: any;
  totalProduct: any;
  pageIndex: any = 1;
  pageSize: any = 5;
  list_category: any;
  frmSearch: FormGroup

  loaiQuyen: string = 'Admin';
  user: any;
  isCreate = false;
  showUpdateModal: any;
  frmProduct: FormGroup;
  doneSetupForm: any;
  file: any;


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
  }

  public loadCategory(){
    this._api.get('/api/Categories/get').subscribe(res => {
      this.list_category = res;
      console.log(this.list_category);
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
      console.log(this.list_product);
      console.log(this.totalProduct);
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

  get hoten() {
    return this.frmProduct.get('txt_hoten')!;
  }
  get taikhoan() {
    return this.frmProduct.get('txt_taikhoan')!;
  }

  get email() {
    return this.frmProduct.get('txt_email')!;
  }
  get dienthoai() {
    return this.frmProduct.get('txt_dienthoai')!;
  }
  get ngaysinh() {
    return this.frmProduct.get('txt_ngaysinh')!;
  }

  get matkhau() {
    return this.frmProduct.get('txt_matkhau')!;
  }

  get nhaplaimatkhau() {
    return this.frmProduct.get('txt_nhaplai_matkhau')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createProductModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmProduct = new FormGroup({
        'txt_hoten': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_ngaysinh': new FormControl('', [Validators.required]),
        'txt_gioitinh': new FormControl('Nam', [Validators.required]),
        'txt_diachi': new FormControl('', []),
        'txt_email': new FormControl('', [Validators.email]),
        'txt_dienthoai': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        'txt_taikhoan': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
        'txt_matkhau': new FormControl('', [this.pwdCheckValidator]),
        'txt_nhaplai_matkhau': new FormControl('', [Validators.required]),
        'txt_loaiquyen': new FormControl('', []),
        'txt_anh': new FormControl('', []),
        'txt_thongtinkhac': new FormControl('', []),
      }, {
        validators: [MatchValidation.match('txt_matkhau', 'txt_nhaplai_matkhau')]
      });
    });
  }

  public openUpdateModal(maNguoiDung: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/user/get-by-id/' + maNguoiDung).subscribe(res => {
        this.user = res.user;
        this.doneSetupForm = true;
        this.frmProduct = new FormGroup({
          'txt_hoten': new FormControl(this.user.hoTen, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_ngaysinh': new FormControl('', [Validators.required]),
          'txt_gioitinh': new FormControl(this.user.gioiTinh, [Validators.required]),
          'txt_diachi': new FormControl(this.user.diaChi, []),
          'txt_email': new FormControl(this.user.email, [Validators.email]),
          'txt_dienthoai': new FormControl(this.user.dienThoai, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
          'txt_taikhoan': new FormControl(this.user.taiKhoan, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
          'txt_matkhau': new FormControl(this.user.matKhau, [this.pwdCheckValidator]),
          'txt_nhaplai_matkhau': new FormControl(this.user.matKhau, [Validators.required]),
          'txt_loaiquyen': new FormControl('', []),
          'txt_anh': new FormControl(this.user.anhDaiDien, []),
          'txt_thongtinkhac': new FormControl('', []),
        }, {
          validators: [MatchValidation.match('txt_matkhau', 'txt_nhaplai_matkhau')]
        });
        this.loaiQuyen = this.user.loaiQuyen;
        this.frmProduct.get('txt_ngaysinh')?.patchValue(this.formatDate(new Date(this.user.ngaySinh)));
      });
    });
  }

  public onRemove(MaNguoiDung: any) {
    this._api.delete('/api/user/delete-user', MaNguoiDung).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.loadProduct();
    });
  }

  public closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }

  public pwdCheckValidator(control: any) {
    var filteredStrings = { search: control.value, select: '@#!$%&*' }
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if (control.value.length < 6 || !result) {
      return { matkhau: true };
    } else {
      return null;
    }
  }

  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this._api.uploadFileSingle('/api/upload/upload', 'user', this.file).subscribe((res: any) => {
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
    let obj: any = {};
    obj.nguoidung = {
      HoTen: vl.txt_hoten,
      NgaySinh: vl.txt_ngaysinh,
      GioiTinh: vl.txt_gioitinh,
      DiaChi: vl.txt_diachi,
      Email: vl.txt_email,
      DienThoai: vl.txt_dienthoai,
      TrangThai: true
    }
    obj.taikhoan = {
      TaiKhoan1: vl.txt_taikhoan,
      MatKhau: vl.txt_matkhau,
      Email: vl.txt_email,
      DienThoai: vl.txt_dienthoai,
      LoaiQuyet: this.loaiQuyen,
      TrangThai: true
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.nguoidung.AnhDaiDien = res.body.filePath;
            this._api.post('/api/user/create-user', obj).subscribe(res => {
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
        this._api.post('/api/user/create-user', obj).subscribe(res => {
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
      obj.nguoidung.MaNguoiDung = this.user.maNguoiDung;
      obj.taikhoan.MaNguoiDung = this.user.maNguoiDung;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.nguoidung.AnhDaiDien = res.body.filePath;
            this._api.post('/api/user/update-user', obj).subscribe(res => {
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
        this._api.post('/api/user/update-user', obj).subscribe(res => {
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
