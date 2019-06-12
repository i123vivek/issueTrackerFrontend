import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {BootstrapModalModule} from 'ng6-bootstrap-modal';
import { RouterModule, Routes} from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { AppService } from './app.service';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    UserModule,
    DashboardModule,
    NgbModalModule,
    BootstrapModalModule,

    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full'},
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '*', component: LoginComponent},
      { path: '**', component: LoginComponent},
])

  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
