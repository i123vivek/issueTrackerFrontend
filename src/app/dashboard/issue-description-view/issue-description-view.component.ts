import { Component, ElementRef, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppService } from './../../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import "rxjs/add/operator/do";
//import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-issue-description-view',
  templateUrl: './issue-description-view.component.html',
  styleUrls: ['./issue-description-view.component.css'],
  providers: [Location],

})
export class IssueDescriptionViewComponent implements OnInit, OnDestroy {

  public fullName: String;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public issueDetails: any;
  public issueId: any
  public issueStatus: any;
  public issueTitle: any;
  public uploadedFile: any
  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueScreenShotPath: any;
  public filesToUpload: Array<File> = [];
  public comment: String;
  public commenterEmail: string;
  public commentArray: any = [];
  public commentFlag = false;
  public noCommentFlag = false;
  public watcherList:any=[];
  public watcherFlag = false;
  

  displayToken = false
  newCommentFlag: boolean;
  watcherEmail: any;




  constructor(public AppService: AppService, private location: Location, public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router, private el: ElementRef) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    // this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.fullName = Cookie.get('fullName');
    this.watcherEmail = Cookie.get('email');
    this.commenterEmail = Cookie.get('email');
    this.firstChar = this.fullName[0];
    this.issueId = Cookie.get('IssueSelected-Id')

    this.getAllInfoOfAnIssue(this.issueId);
    this.getWatcherList();
  }

  public getAllInfoOfAnIssue = (issueId) => {

    console.log('inside getInfoOfAnIssue', issueId)

    this.AppService.getSingleIssueInformation(issueId).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        console.log('inside apiReponse of getInfoOfAnIssue', apiResponse)
        this.issueId = apiResponse.data.issueId;
        this.issueStatus = apiResponse.data.issueStatus;
        this.issueTitle = apiResponse.data.issueTitle;
        this.issueDescription = apiResponse.data.issueDescription
        this.issueReporterName = apiResponse.data.issueReporter
        this.issueReporterEmail = apiResponse.data.issueReporterEmail

        this.issueAssigneeName = apiResponse.data.issueAssignee

        this.issueAssigneeEmail = apiResponse.data.issueAssigneeEmail

        this.issueCreatedOn = new Date(apiResponse.data.issueCreatedOn).toLocaleDateString()


        this.issueScreenShotPath = apiResponse.data.screenshotPath;
        

        this.displayToken = true;


      }

      else {
        this.toastr.errorToastr("no  issue-Details found for the selected issue")
      }
    })
  }

  public DeleteIssue(): any {
    if (this.issueId === undefined || this.issueId === '' || this.issueId === null) {
      this.toastr.errorToastr('No issue present with this issueId');
    } else {
      //let issueId = Cookie.get('IssueSelected-Id');
      console.log("issueId to be deleted:", this.issueId);
      this.AppService.DeleteIssue(this.issueId).subscribe(
        data => {
          this.toastr.successToastr('issue deleted.', 'Success!');
          //this.SocketService.toSendRequestToGetNotificationFromServerOnDelete(this.userSelectedUsername);
          Cookie.delete('this.issueId');



          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
          }, 500)
        },
        error => {
          this.toastr.errorToastr('This is error toast.', 'Oops!')
        }


      )
    }
  }

  public logout: any = () => {
    this.AppService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log("logout function called");
        Cookie.deleteAll();
        this.router.navigate(['/']);
      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    }, (err) => {
      this.toastr.errorToastr("some error occured");
    })
  }

  public logOutWithFacebook: any = () => {
    this.AppService.logOutWithFacebook().subscribe(() => {
      
      console.log("facebook logout function called");
      Cookie.deleteAll();
      this.router.navigate(['/']);
    })
  }

  public uploadFile = () => {
    console.log("file to be uploaded", this.uploadedFile)
  }

  public upload = () => {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let formData = new FormData();
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('image', inputEl.files[i]);

        console.log('formData is:', formData)

      }

    }
  }

  public AddWatcher(): any {
    let data = {
      issueId: this.issueId,
      watcherEmail: this.watcherEmail
    }
    this.AppService.AddWatcher(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log(apiResponse);

        Cookie.set('watcheId', apiResponse.data.watcherId);
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, (err) => {
      this.toastr.errorToastr('some error occured')
    });
  }

  public getWatcherList(): any{
    this.AppService.getWatcherList(this.issueId).subscribe((apiResponse) =>{
      console.log(apiResponse);
      this.watcherList=[];
      if(apiResponse.data != null) {
        //this.watcherFlag = true
        for(let x of apiResponse.data){
          let temp = {
            issueId: x.issueId,
            watcherId: x.watcherId,
            watcherEmail: x.watcherEmail,
            
            date: new Date(x.createdOn).toLocaleDateString()
          }
          this.watcherList.push(temp);
        }
        console.log("All watchers are:--",this.watcherList);
        
      }
    })
  }

  public WriteComment(): any {

    if (this.comment == undefined || this.comment == '' || this.comment == null) {
      //alert("enter comment to add")
      this.toastr.errorToastr("no comment entered", 'Oops!')
    }
    else {
      let CommentData = {
        issueId: this.issueId,
        comment: this.comment,
        commenter: this.fullName,
        commenterEmail: this.commenterEmail
      }

      this.AppService.WriteComment(CommentData).subscribe(
        data => {
          
          console.log("write comment");
          console.log("response data of write comment:", data);
          this.toastr.successToastr('comment added.', 'Success!');


        },
        error => {
          console.log("some error occurred while writting comment");
          console.log(error.errorMessage);
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        }
      )
    }
  }

  public ViewComment(): any {
    if (this.issueId === undefined || this.issueId === '' || this.issueId === null) {
      this.toastr.errorToastr('No issueId found');
    }
    else {
      this.AppService.ViewComment(this.issueId).subscribe(
        (apiResponse) => {
          //this.commentArray = apiResponse['data'];
          console.log(apiResponse);
          this.commentArray = [];
          if (apiResponse.data != null) {
            this.commentFlag = true
            for (let x of apiResponse.data) {
              let temp = {
                commentId: x.commentId,
                issueId: x.issueId,
                comment: x.comment,
                commenter: x.commenter,
                commenterEmail: x.commenterEmail,
                createdOn: x.createdOn
              }
              this.commentArray.push(temp);
            }
            console.log("All comments are:--", this.commentArray);
          }
        }
      )
    }

  }

  public goBack(): any {
    this.location.back();
  }


  public setFlag = (event) => {
    if (event) {
      this.newCommentFlag = true;
    }
  }




  ngOnDestroy(): void {
    // Cookie.delete('IssueSelected-Id')
  }

}
