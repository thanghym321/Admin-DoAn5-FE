import { map } from 'rxjs/operators';
import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { BaseComponent } from '../../../core/common/base-component';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent extends BaseComponent implements OnInit {
  public list_item: any;
  public list_order: any = [];
  public tong: number;
  public frmHoaDon: FormGroup;
  constructor(injector: Injector, private authenticationService: AuthenticationService) {
    super(injector);
    this.frmHoaDon = new FormGroup({
      'txt_hoten': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]),
      'txt_dienthoai': new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      'txt_tinkhac': new FormControl('', []),
    });
  }

  get dienthoai() {
    return this.frmHoaDon.get('txt_dienthoai')!;
  }
  get hoten() {
    return this.frmHoaDon.get('txt_hoten')!;
  }

  ngOnInit(): void {
    this._api.post('/api/sell/search', { page: 1, pageSize: 10 }).subscribe(res => {
      this.list_item = res.data;
      setTimeout(() => {
        this.loadScripts('assets/js/core/app.js');
      });
    });

  }

  public ThanhToan(vl: any) {
    if (this.frmHoaDon.invalid) {
      return;
    }
    let user = this.authenticationService.userValue;
    let obj: any = {};
    obj.khachhang = {
      TenKhachHang: vl.txt_hoten,
      SoDienThoai: vl.txt_dienthoai
    }
    obj.hoadon = {
      MaNguoiDung: user.user_Id
    }
    obj.chitiethoadon = [];
    this.list_order.forEach((x: any) => {
      obj.chitiethoadon.push({
        MaSanPham: x.maSanPham,
        SoLuong: x.soLuong,
        GiaBan: x.gia
      });
    });
    this._api.post('/api/sell/create-hoadonxuat', obj).subscribe(res => {
      if (res && res.data) {
        alert('Thêm dữ liệu thành công')
      } else {
        alert('Có lỗi')
      }
    });
  }
  public delete(maSanPham: any) {
    this.list_order = this.list_order.filter((x: any) => x.maSanPham != maSanPham);
    this.tong = this.list_order.reduce((sum: any, x: any) => sum + x.gia * x.soLuong, 0);
  }



  public Add(item: any) {
    if (this.list_order.length == 0) {
      item.soLuong = 1;
      this.list_order = [item];
    } else {
      let ok = true;
      for (let x of this.list_order) {
        if (x.maSanPham == item.maSanPham) {
          x.soLuong += 1;
          ok = false;
          break;
        }
      }
      if (ok) {
        item.soLuong = 1;
        this.list_order.push(item);
      }
    }
    this.tong = this.list_order.reduce((sum: any, x: any) => sum + x.gia * x.soLuong, 0);
  }
  public TinhToan() {
    this.tong = this.list_order.reduce((sum: any, x: any) => sum + x.gia * x.soLuong, 0);
  }

  public printHtml() {
    let html_order = '';
    this.list_order.forEach((x: any) => {
      html_order += `
      <tr>
      <td>1</td>
      <td>${x.tenSanPham}</td>
      <td>${x.gia}</td>
      <td>${x.soLuong}</td>
      <td>${x.gia * x.soLuong}</td>
      </tr>
      `;
    });
    let data = `
    <section style="text-align: center;">
        <h1>HÓA ĐƠN GIÁ TRỊ GIA TĂNG</h1>
        <div class="ban">(Bản thể hiện hóa đơn điện tử)</div>
        <div class="ngay">
            <p id="date"></p>
            <script>
                n = new Date();
                y = n.getFullYear();
                m = n.getMonth() + 1;
                d = n.getDate();
                document.getElementById("date").innerHTML = "Ngày " + d + " tháng " + m + " năm " + y;
            </script>
        </div>
    </section>

    <div class="le dam">Tên đơn vị bán hàng: Nguyễn Chiến Computer</div>
    <div class="le">Mã số thuế: 3269289058</div>
    <div class="le">Địa chỉ: 195 Nguyễn Chế Nghĩa, Gia Lộc, Hải Dương</div>
    <div class="le doi">Điện thoại: 0948.098.195</div>
    <div class="le doi">Số tài khoản: 762618652671614</div>
    <div class="le dam">Người mua hàng: ${this.frmHoaDon.value['txt_hoten']}</div>
    <div class="le">Email: abc@mail.com</div>
    <div class="le">Điện thoại: 0987654321</div>
    <div class="le">Địa chỉ: Hải Dương</div>
    <div class="le doi">Hình thức thanh toán: Tiền mặt / Chuyển khoản</div>
    <div class="le doi">Số tài khoản: 526716147626186</div>
    <div class="le">Ghi chú: </div>
    <table>
        <tr>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
        </tr>
        ${html_order}
    </table>
    <div class="doi dam ky">Người mua hàng</div>
    <div class="doi dam ky">Người bán hàng</div>
    <div class="doi ky1">(Ký, ghi rõ họ tên)</div>
    <div class="doi ky1">(Ký, ghi rõ họ tên)</div>
    `;

    let popupWin: any = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          .print table {
              margin-top: 15px;
              width: 100%;
          }
          print tr {
              line-height: 27px;
          }

          .print table,
          th,
          td {
              border: 1px solid black;
              border-collapse: collapse;
              text-align: center;
          }

          .print .ngay {
              font-style: italic;
              font-size: 15px;
              margin-bottom: 5px;
          }

          .print .ban {
              font-style: italic;
              font-size: 15px;
              margin: 3px 0px;
          }

          .print .dam {
              font-weight: bold;
          }

          .print .le {
              margin-bottom: 4px;
              font-size: 15px;
          }

          .print .doi {
              width: 50%;
              float: left;
          }

          .print .ky {
              text-align: center;
              margin-top: 20px;
          }

          .print .ky1 {
              font-style: italic;
              text-align: center;
              margin-top: 5px;
          }
      </style>
        </head>
      <body class='print' onload="window.print();window.close()">${data}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
