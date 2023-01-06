import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/common/base-component';
import MatchValidation from '../../../core/helpers/must-match.validator';
declare var $: any;
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent extends BaseComponent implements OnInit, AfterViewInit {

  list_user: any;
  totalUser: any;
  pageIndex: any=1;
  pageSize: any=5;
  frmSearch: FormGroup;

  user: any;
  isCreate = false;
  file: any;
  showUpdateModal: any;
  frmUser: FormGroup;
  doneSetupForm: any;
  imagePreview: any;


  constructor(injector: Injector) {
    super(injector);
    // this.ckeditorConfig();
    this.frmSearch = new FormGroup({
      'txt_userName': new FormControl(''),
      'txt_name': new FormControl(''),
      'txt_role': new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.LoadData();
  }

  ngAfterViewInit() {
    this.loadScripts('assets/js/core/app.js','assets/js/pages/dashboard.js');
  }

  public LoadData() {
    this._api.get('/api/Users/getallpaging?'
    +'pageindex=' + this.pageIndex
    +'&pagesize=' + this.pageSize
    +'&UserName=' + this.frmSearch.value['txt_userName']
    +'&Name=' + this.frmSearch.value['txt_name']
    +'&Role=' + this.frmSearch.value['txt_role']
    ).subscribe(res => {
      this.list_user = res.items;
      this.totalUser=res.totalItem;
      console.log(this.list_user);
      console.log(this.totalUser);

    });
  }

  get userName() {
    return this.frmUser.get('txt_userName')!;
  }
  get passWord() {
    return this.frmUser.get('txt_passWord')!;
  }
  get rewrite_Password() {
    return this.frmUser.get('txt_rewrite_Password')!;
  }
  get startDate() {
    return this.frmUser.get('txt_startDate')!;
  }
  get endDate() {
    return this.frmUser.get('txt_endDate')!;
  }
  get status_Account() {
    return this.frmUser.get('txt_status_Account')!;
  }
  get name() {
    return this.frmUser.get('txt_name')!;
  }
  get dateOfBirth() {
    return this.frmUser.get('txt_dateOfBirth')!;
  }
  get email() {
    return this.frmUser.get('txt_email')!;
  }
  get phone() {
    return this.frmUser.get('txt_phone')!;
  }
  get status_User() {
    return this.frmUser.get('txt_status_User')!;
  }

  public createModal() {
    this.showUpdateModal = true;
    this.isCreate = true;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this.doneSetupForm = true;
      this.frmUser = new FormGroup({
        'txt_userName': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
        'txt_passWord': new FormControl('', [this.pwdCheckValidator]),
        'txt_rewrite_Password': new FormControl('', [Validators.required]),
        'txt_startDate': new FormControl('', [Validators.required]),
        'txt_endDate': new FormControl('', [Validators.required]),
        'txt_status_Account': new FormControl('', [Validators.required]),
        'txt_role': new FormControl('', []),
        'txt_name': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
        'txt_dateOfBirth': new FormControl('', [Validators.required]),
        'txt_gioiTinh': new FormControl('', [Validators.required]),
        'txt_address': new FormControl('', []),
        'txt_email': new FormControl('', [Validators.email]),
        'txt_phone': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        'txt_status_User': new FormControl(this.user.role, []),
      }, {
        validators: [MatchValidation.match('txt_passWord', 'txt_rewrite_Password')]
      });
      this.imagePreview="";
    });
  }


  public openUpdateModal(user_Id: any) {
    this.showUpdateModal = true;
    this.doneSetupForm = false;
    this.isCreate = false;
    setTimeout(() => {
      $('#createModal').modal('toggle');
      this._api.get('/api/Users/getbyid/' + user_Id).subscribe(res => {
        this.user = res;
        this.doneSetupForm = true;
        this.frmUser = new FormGroup({

          'txt_userName': new FormControl(this.user.userName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
          'txt_passWord': new FormControl(this.user.passWord, [this.pwdCheckValidator]),
          'txt_rewrite_Password': new FormControl(this.user.passWord, [Validators.required]),
          'txt_startDate': new FormControl(this.user.startDate, [Validators.required]),
          'txt_endDate': new FormControl(this.user.endDate, [Validators.required]),
          'txt_status_Account': new FormControl(this.user.status_Account, [Validators.required]),
          'txt_role': new FormControl(this.user.role, []),
          'txt_name': new FormControl(this.user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
          'txt_dateOfBirth': new FormControl(this.user.dateOfBirth, [Validators.required]),
          'txt_gioiTinh': new FormControl(this.user.gioiTinh, [Validators.required]),
          'txt_address': new FormControl(this.user.address, []),
          'txt_email': new FormControl(this.user.email, [Validators.email]),
          'txt_phone': new FormControl(this.user.phone, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
          'txt_status_User': new FormControl(this.user.status_User, []),
        }, {
          validators: [MatchValidation.match('txt_passWord', 'txt_rewrite_Password')]
        });
        this.frmUser.get('txt_dateOfBirth')?.patchValue(this.formatDate(new Date(this.user.dateOfBirth)));
      });
      this.imagePreview=this.user.image;
    });
  }

  public onRemove(user_Id: any) {
    this._api.delete('/api/Users/delete', user_Id).subscribe(res => {
      alert('Xóa dữ liệu thành công');
      this.LoadData();
    });
  }
  public closeModal() {
    $('#createModal').closest('.modal').modal('hide');
  }
  public pwdCheckValidator(control: any) {
    var filteredStrings = { search: control.value, select: '@#!$%&*' }
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if (control.value.length < 6 || !result) {
      return { passWord: true };
    } else {
      return null;
    }
  }

  public upload(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this._api.uploadFileSingle('/api/upload/upload', 'user', this.file).subscribe((res: any) => {
        this.imagePreview = res.body.filePath;
      });
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.frmUser.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }


  OnSubmit(vl: any) {
    debugger;
    console.log(this.findInvalidControls())
    if (this.frmUser.invalid) {
      return;
    }
    let obj: any = {};
    obj.account = {
      UserName: vl.txt_userName,
      PassWord: vl.txt_passWord,
      StartDate: vl.txt_startDate,
      EndDate: vl.txt_endDate,
      Status_Account: Number(vl.txt_status_Account),
      Role: vl.txt_role,
    }
    obj.user = {
      Name: vl.txt_name,
      DateOfBirth: vl.txt_dateOfBirth,
      GioiTinh: vl.txt_gioiTinh,
      Address: vl.txt_address,
      Email: vl.txt_email,
      Phone: vl.txt_phone,
      Status_User: Number(vl.txt_status_User)
    }
    if (this.isCreate) {
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.user.image = res.body.filePath;
            this._api.post('/api/Users/create', obj).subscribe(res => {
              if (res && res.data) {
                alert('Thêm dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.post('/api/Users/create', obj).subscribe(res => {
          if (res && res.data) {
            alert('Thêm dữ liệu thành công');
            this.LoadData();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    } else {
      obj.user.Id = this.user.user_Id;
      obj.account.User_Id = this.user.user_Id;
      if (this.file) {
        this._api.uploadFileSingle('/api/upload/upload-single', 'user', this.file).subscribe((res: any) => {
          if (res && res.body && res.body.filePath) {
            obj.user.image = res.body.filePath;
            this._api.put('/api/Users/update', obj).subscribe(res => {
              if (res && res.data) {
                alert('Cập nhật dữ liệu thành công');
                this.LoadData();
                this.closeModal();
              } else {
                alert('Có lỗi')
              }
            });
          }
        });
      } else {
        this._api.put('/api/Users/update', obj).subscribe(res => {
          if (res && res.data) {
            alert('Cập nhật dữ liệu thành công');
            this.LoadData();
            this.closeModal();
          } else {
            alert('Có lỗi')
          }
        });
      }
    }

  }
}
