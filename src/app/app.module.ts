import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {BootstrapModalModule} from 'ng6-bootstrap-modal';
import { RouterModule, Routes} from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';


//import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
//import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { LoginComponent } from './user/login/login.component';
import { AppService } from './app.service';

import { CookieService } from 'ngx-cookie-service';

import { DashboardModule } from './dashboard/dashboard.module';
import { SocketService } from './socket.service';
import { UserDashboardComponent } from './dashboard/user-dashboard/user-dashboard.component';
import { UserRouteGaurdService } from './dashboard/user-route-gaurd.service';
import { SocialloggedInComponent } from './user/sociallogged-in/sociallogged-in.component';
//import { SocialloggedInComponent } from './user/sociallogged-in/sociallogged-in.component';

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
   // NgxEditorModule,

    HttpClientModule,
    AngularFontAwesomeModule,
    //TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([


      { path: 'loggedin/:token' ,component: SocialloggedInComponent,pathMatch: 'full'},
      { path: 'login', component: LoginComponent, pathMatch: 'full'},
     
      
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: '*', component: LoginComponent},
      { path: '**', component: LoginComponent},
      // { path: 'loggedin/:token', component: SocialloggedInComponent},
      
])

  ],
  
  providers: [AppService,SocketService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
