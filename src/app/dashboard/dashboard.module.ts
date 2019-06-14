import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { IssueDescriptionViewComponent } from './issue-description-view/issue-description-view.component';
import { IssueEditComponent } from './issue-edit/issue-edit.component';
import { IssueCreateComponent } from './issue-create/issue-create.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { UserRouteGaurdService } from './user-route-gaurd.service';
import { IssueRouteGaurdService } from './issue-route-gaurd.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path:'user-dashboard', component: UserDashboardComponent, canActivate:[UserRouteGaurdService]},
      {path:'issue-description-view', component: IssueDescriptionViewComponent, canActivate:[IssueRouteGaurdService]},
      {path:'issue-create', component: IssueCreateComponent, canActivate:[IssueRouteGaurdService]},
      {path:'issue-edit/:issueId', component: IssueEditComponent, canActivate:[IssueRouteGaurdService]},
    ])
  ],
  declarations: [UserDashboardComponent, IssueDescriptionViewComponent, IssueEditComponent, IssueCreateComponent],
  providers: [UserRouteGaurdService,IssueRouteGaurdService]
})
export class DashboardModule { }
