import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit,OnDestroy {

  public fullName: String;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public allIssueList: any = [];
  public assigneedIssuesList: any = [];
  public text: String;
  public searchedIssue: any= [];
  public userIssueFlag: boolean=false;

  constructor(public AppService: AppService, public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.fullName = Cookie.get('fullName');
    this.firstChar = this.fullName[0];


    this.checkStatus();
    this.getAssignedIssuesOfUser();
  }
  public checkStatus: any = () => {

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public getAllIssues: any = () =>{
    this.userIssueFlag = false;
    this.AppService.getAllIssues().subscribe((apiResponse) => {
      console.log(apiResponse);
      this.allIssueList = [];
      if(apiResponse.data != null) {
        for(let x of apiResponse.data){
          let temp = {
            title: x.issueTitle,
            issueId: x.issueId,
            status: x.issueStatus,
            reporter: x.issueReporter,
            date: new Date(x.issueCreatedOn).toLocaleDateString()
          }
          this.allIssueList.push(temp);
        }
        console.log("All issues are:--",this.allIssueList);
      }

    })
  }

  public getAssignedIssuesOfUser: any = () =>{
    this.userIssueFlag = true;

    this.AppService.getLoggedInUserIssues(Cookie.get('email')).subscribe((apiResponse) =>{
      console.log(apiResponse);
      
      this.assigneedIssuesList = [];
      if(apiResponse.data != null) {
        for(let x of apiResponse.data){
          let temp = {
            title: x.issueTitle,
            issueId: x.issueId,
            status: x.issueStatus,
            reporter: x.issueReporter,
            date: new Date(x.issueCreatedOn).toLocaleDateString()
          }
          this.assigneedIssuesList.push(temp);
        }
        console.log("All issues assigneed to logged-in-user", this.assigneedIssuesList);
      }

    })
  }

  public searchIssueByText: any =()=>{
    this.AppService.searchIssue(this.text).subscribe((apiResponse) =>{
      console.log("you entered some text for search",this.text);
      console.log(apiResponse);
      this.searchedIssue = [];
      if(apiResponse.status === 200){
        this.searchedIssue = apiResponse.data;
        console.log('the issues related to searched text:', this.searchedIssue);
      } else if(apiResponse.status === 404){
        this.toastr.successToastr(apiResponse.message);
      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    },(error) => {
      console.log(error);
      this.toastr.errorToastr('Some error ocurred');
    })
  }

  public logout: any = () =>{
    this.AppService.logout().subscribe((apiResponse) =>{
      if(apiResponse.status === 200){
        console.log("logout function called");
        Cookie.deleteAll();
        this.router.navigate(['/']);
      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    }, (err) =>{
      this.toastr.errorToastr("some error occured");
    })
  }

  public logOutWithFacebook: any = () =>{
    this.AppService.logOutWithFacebook().subscribe((apiResponse) =>{
      if(apiResponse.status === 200){
        console.log("facebook logout function called");
        Cookie.deleteAll();
        this.router.navigate(['/']);
      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    }, (err) =>{
      this.toastr.errorToastr("some error occured");
    })
  }



  ngOnDestroy(){

  }



}
