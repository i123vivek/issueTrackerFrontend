import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../app.service';
import {SocketService} from "./../../socket.service"
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { from } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit,OnDestroy {
  
  public userEmail :String;
  public fullName: String;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public allIssueList: any = [];
  public assigneedIssuesList: any = [];
  public text: String;
  public searchedIssue: any= [];
  public userIssueFlag: boolean=false;
  emmissionFunction
  notificationList: any[];

  notificationArraySize;
  

  public socialFlag: boolean = false;

  
  
  // SocketService: any;

  constructor(public AppService: AppService, public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router,public SocketService:SocketService) { }

  ngOnInit() {


console.log('on init called')
    //this.socialAuthToken = Cookie.get("socialauthToken")
    this.authToken = Cookie.get('authToken');
    // this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.fullName = Cookie.get('fullName');
    this.firstChar = this.fullName[0];
    this.userEmail = Cookie.get('email')
    //console.log("social authToken" , this.socialAuthToken);
    console.log("authToken" , this.authToken);

    
   

    this.checkStatus();
    //this.setFlag();


   
    this.getAssignedIssuesOfUser();
     console.log("88888888888888888888888888888888888888888")
    this.SocketService.sendNotificationRequest(this.userEmail)

    // this.emmissionFunction =setInterval(() => { this.getMyNotification(); }, 10000);

    this.getMyNotification();
    
    
    

    // Cookie.set("BackToken","false")

    //for scoket Notification

   
  }
  // public setFlag: any =() =>{
  //   if(Cookie.get('authToken') !== undefined && Cookie.get('authToken') !== null && Cookie.get('authToken') !== ''){
  //     this.socialFlag = false;
  //   } else if(Cookie.get('socialauthToken') !== undefined && Cookie.get('socialauthToken') !== null && Cookie.get('socialauthToken') !== ''){
  //     this.socialFlag = true;
  //   }
  //   console.log("social flag is:",this.socialFlag);
  // }
  
  public checkStatus: any = () => {

    console.log("check status called")

    if (Cookie.get('authToken')=== undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {

      
      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus


  // public verifyUserConfirmation: any = () => {

  //   console.log("verifing user ................ once ag")

  //   this.SocketService.verifyUser()
  //     .subscribe((data) => {

  //       console.log("verifing user ................")
  //       //console.log("data is : ", data);

  //       // this.disconnectedSocket = false;
        
  //       // let data1 = {authToken:this.authToken,userSocketId:this.socketid}
  //       this.SocketService.sendNotificationRequest(this.userEmail)
  //       console.log(",,,,,,,,,,,,,,,,")
       
  //      // this.getOnlineUserList()

  //     });
  // }


  public getMyNotification =() =>{
    

    this.SocketService.getNotification().subscribe((notificationdata)=>{

      this.notificationList =[]


      for(let x in notificationdata)
      {
       
        if (notificationdata[x].notificationPurpose == "create")
        {
          let notificationObj ={
            message:`hey a new issue is created with issueId:-${notificationdata[x].notificationIssueId}`,
            details:notificationdata[x]
          }

          this.notificationList.push(notificationObj)

        } else if (notificationdata[x].notificationPurpose == "edit")
        {
          let notificationObj ={
            message:`hey a  issue is edited with issueId:-${notificationdata[x].notificationIssueId}`,
            details:notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        }else{
          let notificationObj ={
            message:`hey ${notificationdata[x].notificationMessage.commenter} commented on issue with issueId:-${notificationdata[x].notificationIssueId}`,
            details:notificationdata[x]
          }
          this.notificationList.push(notificationObj)
        }
      }

      console.log('your notification is',notificationdata)
      this.notificationArraySize = this.notificationList.length

      console.log('your notification list is',this.notificationList)

    })
  }

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

  public selectIssue = (issueId) =>{
    if(this.userIssueFlag == true){
      this.assigneedIssuesList.map((issue)=>{
        if(issue.issueId == issueId){
          Cookie.set('IssueSelected-Id',issue.issueId);
        }
      })
    } else{
      this.allIssueList.map((issue)=>{
        if(issue.issueId == issueId){
          Cookie.set('IssueSelected-Id',issue.issueId);
        }
      })
    }
    
  }


  public selectIssueFromNotification =(notificationId)=>{
    this.notificationList.map((notification)=>{
    if (notification.details.notificationId == notificationId){
      
      Cookie.set('IssueSelected-Id',notification.details.notificationIssueId);
      this.markNotificationAsSeen(notification.details.notificationId)
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
        Cookie.set("token","false")
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
    this.AppService.logOutWithFacebook().subscribe(() =>{
   
      console.log("facebook logout function called");
      Cookie.deleteAll();
      Cookie.delete("token")
      this.router.navigate(['/']);
    })
  }

  public selectIssueForSearch=(issueId) =>{

    this.searchedIssue.map((issue)=>{
      if(issue.issueId == issueId)
      {
        Cookie.set('IssueSelected-Id',issue.issueId);
      }
    })

  }


  public markNotificationAsSeen =(notificationId) =>{

    this.AppService.markNotificationAsSeen(notificationId).subscribe((result)=>{
      console.log('result in mark function ',result)
    })
  }


  



  ngOnDestroy(){

    // clearInterval(this.emmissionFunction);

    // this.SocketService.exitSocket()

  }



}
