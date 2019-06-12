import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://192.168.1.53:3000';

  constructor(public http: HttpClient, public router: Router) { }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public signinFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/login`, params);
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public loginWithFacebook(): Observable<any> {
    return this.http.get(`${this.url}/login/facebook`)
  }

  public logOutWithFacebook(): Observable<any> {
    
    return this.http.get(`${this.url}/api/logout`)
  }

  public getAllIssues() : Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/allIssues?authToken=${Cookie.get('authToken')}`);
  }

  public getLoggedInUserIssues(email): Observable<any>{
    
    return this.http.get(`${this.url}/api/v1/users/${email}/userIssues?authToken=${Cookie.get('authToken')}`);

  }

  public getSingleIssueInformation(issueId): Observable<any>{
    return this.http.get(`${this.url}/api/v1/users/${issueId}/issueDetails?authToken=${Cookie.get('authToken')}`);

  }

  public searchIssue(text): Observable<any>{
    
    return this.http.get(`${this.url}/api/v1/users/issue/${text}/search?authToken=${Cookie.get('authToken')}`);
  
  }




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  }
}
