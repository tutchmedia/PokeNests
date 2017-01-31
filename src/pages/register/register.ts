import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { NestService } from '../../services/NestService';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = {username: '', password: '', email: '', location: '', firstname: '', lastname: ''};
  locations = [{}];

  constructor(private nav: NavController,  private alertCtrl: AlertController, private auth: NestService, private loadingCtrl: LoadingController, private storage: Storage) {

    this.auth.listLocations().subscribe(
        data => {
            this.locations = data.results;
        },
        err => {
            console.log(err);
        },
        () => console.log('Locations Search Complete')
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    this.auth.registerUser(this.registerCredentials.username, this.registerCredentials.password,  this.registerCredentials.email,  this.registerCredentials.location,  this.registerCredentials.firstname, this.registerCredentials.lastname).subscribe(success => {
      console.log(success);
      if (success) {
        this.createSuccess = true;
          this.showPopup("Success", "Account created.");
      } else if(success.code = 202) {
          this.createSuccess = false;
          this.showPopup("Username Taken", "Sorry, this username is taken.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
    error => {
        let data = error.json();
        if(data.code == 202)
        {
          this.showPopup("Username Taken", "Sorry, this username is taken.");
        } else if(data.code == 203) {
          this.showPopup("Email Used", "Sorry, it appears this email already has an account.");
        }  else {
          this.showPopup("Error", error);
        }

    });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {
           if (this.createSuccess) {
             this.nav.popToRoot();
           }
         }
       }
     ]
    });
    alert.present();
  }

}
