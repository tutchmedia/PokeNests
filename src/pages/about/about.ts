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

  }

  ionViewDidEnter() {
      let checkLogin = this.auth.getUserInfo();
      if(checkLogin == undefined) {
        console.log("not logged in..");
        //this.nav.push(LoginPage);
        this.nav.setRoot(LoginPage);
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
