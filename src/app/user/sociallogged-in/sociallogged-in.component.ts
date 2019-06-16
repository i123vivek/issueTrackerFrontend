import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sociallogged-in',
  templateUrl: './sociallogged-in.component.html',
  styleUrls: ['./sociallogged-in.component.css']
})
export class SocialloggedInComponent implements OnInit {
  public authToken: String;

  constructor(public router: Router, private activatedRoute: ActivatedRoute, public appService: AppService, public toastr: ToastrManager,private cookieService: CookieService ) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
    });
  }

  ngOnInit() {

    this.cookieService.set( 'Test', 'Hello World' );
    // Cookie.set("just like that2","just like taht")

    Cookie.set('authToken', this.activatedRoute.snapshot.paramMap.get('token'));

    console.log('authToken is',this.activatedRoute.snapshot.paramMap.get('token'))
    this.authToken = this.activatedRoute.snapshot.paramMap.get('token');
    


    this.getInfoOfAUserFromAuthToken (this.authToken);







  }


  public getInfoOfAUserFromAuthToken = (authToken) => {

    this.appService.getUserInfoForToken(authToken).subscribe((data)=>{
      // this.appService.setUserInfoInLocalStorage(data.data.userDetails)

      console.log('data for auth token is ',data.data.data)


      Cookie.set('authToken', authToken,1,"/");


      Cookie.set('userId', data.data.data.userId,1,"/");
         
      Cookie.set('email',data.data.data.email,1,"/");
      
      Cookie.set('fullName', data.data.data.firstName + ' ' + data.data.data.lastName,1,"/");
      this.appService.setUserInfoInLocalStorage(data.data.data)
      this.router.navigate([`/user-dashboard`])
      console.log('data for auth token is ',data.data.data)
    
    })

    
  }
  



  
}
