import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {

  constructor(public appService: AppService,public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router) { }

  public email: string ;
  public issueTitle: string;
  
  ngOnInit() {
  }

}
