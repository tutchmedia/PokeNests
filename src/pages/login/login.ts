import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';
//import { AuthService } from '../../providers/auth-service';
import { NestService } from '../../services/NestService';
import { RegisterPage } from '../register/register';
import { AboutPage } from '../about/about';
import { Storage } from '@ionic/storage';

import { LocationPage } from '../location/location';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [NestService]
})
export class LoginPage {
  loading: Loading;
  registerCredentials = {username: '', password: ''};
  currentLocation = [{}];

  constructor(private nav: NavController, private auth: NestService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, public modalCtrl: ModalController) {}

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
        this.loading.dismiss();
      }
    },
    error => {
      let data = error.json();
      if(data.code == 101)
      {
        this.showPopup("Invalid Credentials", data.error);
        this.loading.dismiss();
      } else {
        this.showPopup("Error", error);
        this.loading.dismiss();
      }
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  presentModal() {
    let modal = this.modalCtrl.create(LocationPage);
    modal.present();
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK'
       }
     ]
    });
    alert.present();
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
