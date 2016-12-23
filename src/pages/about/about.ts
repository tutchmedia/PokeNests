import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  username = '';
  email = '';

  constructor(private nav: NavController, private auth: AuthService) {

    // Do the check to forward to pages
    let checkLogin = this.auth.getUserInfo();
    if(checkLogin == undefined) {
      console.log("not logged in..");
      this.nav.push(LoginPage);
    } else {
      // Do stuff once logged in
      let info = this.auth.getUserInfo();
      this.username = info.name;
      this.email = info.email;
    }





  }

  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }
}
