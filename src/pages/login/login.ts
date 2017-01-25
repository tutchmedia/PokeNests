import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
//import { AuthService } from '../../providers/auth-service';
import { NestService } from '../../services/NestService';
import { RegisterPage } from '../register/register';
import { AboutPage } from '../about/about';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [NestService]
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {username: '', password: ''};

  constructor(private nav: NavController, private auth: NestService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage) {}

  public createAccount() {
    this.nav.push(RegisterPage);
  }

  public login() {
    this.showLoading()
    this.auth.restLogin(this.registerCredentials.username, this.registerCredentials.password).subscribe(allowed => {

      if (allowed.username) {

        this.storage.set('currentUser', allowed);

        setTimeout(() => {
          this.loading.dismiss();
          this.nav.setRoot(AboutPage)
        });
      } else {
        this.showError(allowed.error);
      }
    },
    error => {
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
