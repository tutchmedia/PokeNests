import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

declare let Parse: any;

export class NestService {
    static get parameters() {
        return [[Http]];
    }

    constructor(private http:Http) {

    }


    createAuthorizationHeader(headers: Headers) {
      headers.append('X-Parse-Application-Id','7iqBN0vAzR7dVUr4SFY4O6kKasPSVmiCNDJVPSSm');
      headers.append('X-Parse-REST-API-Key', 'kRpwLQ1BAd85ow635D7bDQOhSADsViCSmPi5SVzP');
      headers.append('Content-Type', 'application/json');

    }


    listNests() {

        let headers = new Headers();
        this.createAuthorizationHeader(headers);

        var query = 'include=pokemon';
        var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/classes/nests?'+query;
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

    sendPushInstallation(device_id) {

      let headers = new Headers();
      this.createAuthorizationHeader(headers);

      let p_data = {"deviceToken":device_id, "deviceType":"ios", "channels": [""]};
      var url = 'https://pg-app-237jd14w1ijbdxxfdfdhyiea0fy3bh.scalabl.cloud/1/installations/';
      var response = this.http.post(url, p_data, {
        headers: headers
      }).map(res => res.json());
      return response;

    }

    registerUser(email: string, password: string, birthday?: any) {
      console.log('registering ' + email);
      var user = new Parse.User();
      user.set("username", email);
      user.set("email", email);
      user.set("password", password);

      // other fields can be set just like with Parse.Object
      user.set("birthday", birthday);

      user.signUp(null, {
        success: function (user) {
          console.log('success');
        },
        error: function (user, error) {
          // Show the error message somewhere and let the user try again.
          alert("Error: " + error.code + " " + error.message);
        }
      });
    }


}
