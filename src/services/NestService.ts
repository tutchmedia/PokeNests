import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Observable';


declare let Parse: any;

export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

export class NestService {
    static get parameters() {
        return [[Http]];
    }

    location_name = [{}];
    currentUser: User;
    all = [];

    constructor(private http:Http, public storage: Storage) {

    }


    createAuthorizationHeader(headers: Headers) {
      headers.append('X-Parse-Application-Id','7iqBN0vAzR7dVUr4SFY4O6kKasPSVmiCNDJVPSSm');
      headers.append('X-Parse-REST-API-Key', 'kRpwLQ1BAd85ow635D7bDQOhSADsViCSmPi5SVzP');
      headers.append('Content-Type', 'application/json');

    }



    getSettings() {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/config';
      var response = this.http.get(url, {
        headers: headers
      }).map(res => res.json());
      return response;
    }


    listNests(loc) {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);



        var query = 'include=pokemon&where={"location_cat":{"__type":"Pointer","className":"locations","objectId":"'+loc.objectId+'"}}&order=pokemon';
        var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/nests?'+query;
        var response = this.http.get(url, {
          headers: headers
        }).map(res => res.json());
		    return response;
    }


    checkInLocation(user, location) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      let p_data = {"user":{ "__type": "Pointer", "className":"_User","objectId": user}, "nest":{ "__type": "Pointer", "className":"nests","objectId": location}};
      //let p_data = {"user":user, "location":location};
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/checked_in/';
      var response = this.http.post(url, p_data, {
        headers: headers
      }).map(res => res.json());
      return response;
    }

    // Do check in
    getCheckedIn(location) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      // Current time + 1

      var dateToday = new Date();
      dateToday.setMinutes(dateToday.getMinutes() - 30);
      let check_date = dateToday.toISOString();
      console.log(check_date);

      var query = 'where={"nest":{"__type":"Pointer","className":"nests", "objectId":"'+location+'"},"createdAt":{"$gt":{"__type":"Date","iso":"'+check_date+'"}}}';
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/checked_in?'+query;
      var response = this.http.get(url, {
        headers: headers
      }).map(res => res.json());
      return response;
    }


    listLocations() {
        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        var query = 'order=city';
        var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/locations?'+query;
        var response = this.http.get(url, {
          headers: headers
        }).map(res => res.json());
        return response;
    }

    listNestDetails(id) {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        var query = 'include=pokemon';
        var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/nests/'+id+'?'+query;
        var response = this.http.get(url, {
          headers: headers
        }).map(res => res.json());
		    return response;
    }


    listNestNotes(id) {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        var query = 'include=user&where={"nest":{"__type":"Pointer","className":"nests","objectId":"'+id+'"}}';
        var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/notes?'+query;
        var response = this.http.get(url, {
          headers: headers
        }).map(res => res.json());
		    return response;
    }

    sendPushInstallation(device_id, device_type) {

      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      if(device_type == "ios") {
        let p_data = {"deviceToken":device_id, "deviceType":device_type, "channels": [""]};
      } else {
        let p_data = {"deviceToken":device_id, "deviceType":device_type, "pushType":"gcm", "GCMSenderId:": "962497846052", "channels": [""]};
      }

      let p_data = {"deviceToken":device_id, "deviceType":device_type, "channels": [""]};
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/installations/';
      var response = this.http.post(url, p_data, {
        headers: headers
      }).map(res => res.json());
      return response;

    }


    restLogin(username: string, password: string) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      var query = 'include=locations&username='+username+'&password='+password;
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/login?'+query;
      var response = this.http.get(url, {
        headers: headers
      }).map(res => res.json());

      return response;


    }

    public getUserInfo(user) {

      if(user == undefined) {
        return undefined;
      } else {
        return user;
      }

    }


    addComment(nest, user, comment) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      let p_data = {"user":{ "__type": "Pointer", "className":"_User","objectId": user}, "nest":{ "__type": "Pointer", "className":"nests","objectId": nest}, "comment":comment};

      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/notes/';
      var response = this.http.post(url, p_data, {
        headers: headers
      }).map(res => res.json());

      return response;
    }



    registerUser(username: string, password: string, email: string, location: string, first_name: string, last_name: string) {
      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      let p_data = {"username":username, "password":password, "email": email, "location": {"__type":"Pointer","className":"locations","objectId":location}, "first_name":first_name, "last_name":last_name};

      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/users';
      var response = this.http.post(url, p_data, {
        headers: headers
      })
      .map((response) => response.json());

      return response;
    }

    public logout() {
      return Observable.create(observer => {
        this.currentUser = null;
        observer.next(true);
        observer.complete();
      });
    }


}
