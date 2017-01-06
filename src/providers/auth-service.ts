import { Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

declare let Parse: any;

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()


export class AuthService {
  static get parameters() {
      return [[Http]];
  }

  currentUser: User;

  constructor(private http:Http) {

  }


  createAuthorizationHeader(headers: Headers) {
    headers.append('X-Parse-Application-Id','7iqBN0vAzR7dVUr4SFY4O6kKasPSVmiCNDJVPSSm');
    headers.append('X-Parse-REST-API-Key', 'kRpwLQ1BAd85ow635D7bDQOhSADsViCSmPi5SVzP');
    headers.append('Content-Type', 'application/json');

  }



  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      var query = 'username=admin&password=jesta123';
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/login'+query;
      var response = this.http.get(url, {
        headers: headers
      }).map(res => res.json());

      console.log(response);




      return Observable.create(observer => {

        // Start login auth
        console.log(credentials);



        // At this point make a request to your backend to make a real check!
        //let access = (credentials.password === "pass" && credentials.email === "email");
        //this.currentUser = new User('Simon', 'saimon@devdactic.com');
        observer.next(true);
        observer.complete();
      });
    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
