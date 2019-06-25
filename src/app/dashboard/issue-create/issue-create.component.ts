import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import { FileUploader } from 'ng2-file-upload';


@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css'],
  providers: [Location]
})
export class IssueCreateComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});

  public fullName;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public issueDetails: any;
  public issueId: any



  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueStatus: any;
  public issueTitle: any;
  public issueScreenShotPath: any;
  public filesToUpload: Array<File> = [];

  public selectedAssignee: any;

  public allUser = [];

  constructor(public AppService: AppService,  private location: Location, public toastr: ToastrManager,private router: Router, private _route: ActivatedRoute, private el: ElementRef) { }



  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    // this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    console.log('the user Info are', this.userInfo)
    this.fullName = Cookie.get('fullName');
    this.firstChar = this.fullName[0];
    this.issueReporterEmail =  Cookie.get('email')
    this.issueReporterName = this.fullName

    this.getAllUserOnSystem();
  }

  public getAllUserOnSystem = () => {
    this.AppService.getAllUser().subscribe(
      data => {
        console.log('all user ', data.data)
        this.allUser=[];
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
  public createIssue = () => {


    this.selectAssignee(this.issueAssigneeEmail)
    
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let file = inputEl.files[0]

    console.log('file here is', file)
    let formData = new FormData();
    formData.append('issueStatus', this.issueStatus);
    formData.append('issueTitle', this.issueTitle);
    formData.append('issueDescription', this.issueDescription);
    formData.append('issueReporter', this.fullName);
    formData.append('issueAssigneeEmail', this.issueAssigneeEmail);
    formData.append('issueAssignee', this.issueAssigneeName);
    formData.append('email', this.issueReporterEmail);

    // import { FileUploader} from 'ng2-file-upload';

    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('image', inputEl.files[i]);

        console.log('formDatais', formData)

      }
      this.AppService.createIssue(formData).subscribe(
        data => {
          console.log('data to test ', data)
          this.toastr.successToastr("issue created")
          this.router.navigate(['/user-dashboard']);
  
        },
        error => {
          console.log('error to test ', error)
          this.toastr.errorToastr("some error occured");
          this.router.navigate(['/user-dashboard']);
        }
      )

      //this.toCheckCreateFunTemp(formData)

    } else{
      this.toastr.errorToastr("upload a file to create issue");
    }



    console.log("assisngee", this.issueAssigneeEmail)
    console.log("reporter", this.issueReporterEmail)
    console.log("status", this.issueStatus)
  }

  public goBack(): any {
    this.location.back();
  }


}
