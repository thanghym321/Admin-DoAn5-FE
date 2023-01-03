import { AuthenticationService } from './../core/authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public frmLogin: FormGroup;
  public submitted = false;
  public loading = false;
  public returnUrl: string;
  public error = '';
  constructor(private authenticationService: AuthenticationService,private router: Router, private route: ActivatedRoute) {
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.frmLogin = new FormGroup({
      'txt_username': new FormControl('', [Validators.required]),
      'txt_password': new FormControl('', [Validators.required]),
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get username() {
    return this.frmLogin.get('txt_username')!;
  }
  get password() {
    return this.frmLogin.get('txt_password')!;
  }
  public Login(vl: any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmLogin.invalid) {
      return;
    }
    this.loading = true;
    this.authenticationService
      .login(vl.txt_username, vl.txt_password)
      .pipe(first()).subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );


  }

}
