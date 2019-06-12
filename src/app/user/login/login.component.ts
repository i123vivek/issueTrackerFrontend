import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public password: any;
  public email: any;

  constructor(public router: Router, public appService: AppService, public toastr: ToastrManager) { }

  ngOnInit() {
  }

  public goToSignUp: any = () => {
    this.router.navigate(['/signup']);
  }

  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warningToastr('enter email')
    }
    else if (!this.password) {
      this.toastr.warningToastr('enter password')
    }
    else {
      let data = {
        email: this.email,
        password: this.password,
      }
      console.log("login data :",data);
      this.appService.signinFunction(data).subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log(apiResponse);

          Cookie.set('authToken', apiResponse.data.authToken);

          Cookie.set('userId', apiResponse.data.userDetails.userId);

          Cookie.set('email', apiResponse.data.userDetails.email);

          Cookie.set('fullName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          this.router.navigate(['/user-dashboard']);
        }
        else {
          this.toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.toastr.errorToastr('some error occured')
      });
    }
  }

  public facebookLogin: any = () => {

    this.appService.loginWithFacebook()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log("login with facebook called", apiResponse);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.user)
          Cookie.set('authToken', apiResponse.data.authToken);
          Cookie.set('email', apiResponse.data.userDetails.email);
          Cookie.set('userId', apiResponse.data.user.userId);
          Cookie.set('fullName', apiResponse.data.user.firstName + ' ' + apiResponse.data.user.lastName);
          this.router.navigate(['/user-dashboard'])
        } else {
          this.toastr.errorToastr(apiResponse.message)

        }
      }, (err) => {
        this.toastr.errorToastr('some error occured')


      });
  }


}
