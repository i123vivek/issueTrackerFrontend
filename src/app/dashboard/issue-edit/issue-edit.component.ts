import { Component, OnInit, ElementRef,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-issue-edit',
  templateUrl: './issue-edit.component.html',
  styleUrls: ['./issue-edit.component.css'],
  providers: [Location]
})
export class IssueEditComponent implements OnInit,OnDestroy {
  public uploader: FileUploader = new FileUploader({});

  public fullName: string;
  public currentIssueId: any;
  public currentFormData: any;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;

  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueStatus: any;
  public issueTitle: any;
  public issueScreenShotPath: any;
  public issueScreenShot: any;
  public filesToUpload: Array<File> = [];

  public selectedAssignee: any;

  public allUser = [];
  displayToken: boolean;

  constructor(public AppService: AppService, private location: Location, public toastr: ToastrManager, private router: Router, private _route: ActivatedRoute, private el: ElementRef) { }

  ngOnInit() {
    this.currentIssueId = Cookie.get('IssueSelected-Id')
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    console.log('the user Info are', this.userInfo)
    this.fullName = Cookie.get('fullName');
    this.firstChar = this.fullName[0];
    this.issueReporterEmail = this.userInfo.email;
    this.issueReporterName = this.fullName;

    if (this.currentIssueId === undefined || this.currentIssueId === '' || this.currentIssueId === null) {
      this.toastr.errorToastr('select an issue to edit');
      this.router.navigate(['/user-dashboard']);
    }

    this.getAllUserOnSystem();
    this.getAllInfoOfAnIssue(this.currentIssueId);
  }

  public getAllInfoOfAnIssue = (currentIssueId) => {

    console.log('inside getInfoOfAnIssue', currentIssueId)

    this.AppService.getSingleIssueInformation(currentIssueId).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        console.log('inside apiReponse of getInfoOfAnIssue', apiResponse)
        this.currentIssueId = apiResponse.data.issueId;
        this.issueStatus = apiResponse.data.issueStatus;
        this.issueTitle = apiResponse.data.issueTitle;
        this.issueDescription = apiResponse.data.issueDescription
        this.issueReporterName = apiResponse.data.issueReporter
        this.issueReporterEmail = apiResponse.data.issueReporterEmail

        this.issueAssigneeName = apiResponse.data.issueAssignee

        this.issueAssigneeEmail = apiResponse.data.issueAssigneeEmail

        this.issueCreatedOn = new Date(apiResponse.data.issueCreatedOn).toLocaleDateString()


        this.issueScreenShotPath = apiResponse.data.screenshotPath;

        this.issueScreenShot = `http://192.168.1.53:3000/${this.issueScreenShotPath}`
        //this.imageUrl = "http://192.168.1.53:3000/{{issueScreenShotPath}}"
        //this.imageUrl = return this.http.get("http://192.168.1.53:3000/issueScreenShotPath")

        this.displayToken = true;


      }

      else {
        this.toastr.errorToastr("no  issue-Details found for the selected issue")
      }
    })
  }

  public getAllUserOnSystem = () => {
    this.AppService.getAllUser().subscribe(
      data => {
        console.log('all user ', data.data)
        this.allUser = [];
        for (let x in data.data) {
          this.allUser.push(data.data[x])
        }


        console.log('all User Array', this.allUser)

      },
      error => {
        console.log('error to test ', error)
      })
  }

  public selectAssignee = (userInfo) => {

    this.allUser.map((user) => {

      if (user.email == userInfo) {
        this.issueAssigneeName = (`${user.firstName}+${user.lastName}`)
      }

    })

    console.log('assignee selected ', userInfo)

  }

  public editIssue = () => {


    this.selectAssignee(this.issueAssigneeEmail)

    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let file = inputEl.files[0]

    console.log('file here is', file)
    let currentFormData = new FormData();
    currentFormData.append('issueStatus', this.issueStatus);
    currentFormData.append('issueTitle', this.issueTitle);
    currentFormData.append('issueDescription', this.issueDescription);
    currentFormData.append('issueReporter', this.fullName);
    currentFormData.append('issueAssigneeEmail', this.issueAssigneeEmail);
    currentFormData.append('issueAssignee', this.issueAssigneeName);
    currentFormData.append('email', this.issueReporterEmail);
    

    
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        currentFormData.append('image', inputEl.files[i]);

        console.log('formData is', currentFormData)

      }
      this.AppService.editIssue(this.currentIssueId, currentFormData).subscribe(
        data => {
          console.log('edited  data is: ', data)
          this.toastr.successToastr("issue edited")
          // this.router.navigate(['/user-dashboard']);
          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
          }, 1000)

        },
        error => {
          console.log('error to test ', error)
          this.toastr.errorToastr("some error occured");
          setTimeout(() => {
            this.router.navigate(['/user-dashboard']);
          }, 1000)
        }
      )

      //this.toCheckCreateFunTemp(formData)

    } else {
      this.toastr.errorToastr("upload a file to edit issue");
    }



    console.log("assisngee", this.issueAssigneeEmail)
    console.log("reporter", this.issueReporterEmail)
    console.log("status", this.issueStatus)
  }

  public goBack(): any {
    this.location.back();
  }

  ngOnDestroy()
  {

    Cookie.delete("'IssueSelected-Id'")

  }

}
