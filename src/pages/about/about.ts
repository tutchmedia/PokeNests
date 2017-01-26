import {Component} from '@angular/core';
import {NavController, ModalController} from 'ionic-angular';
import { NestService } from '../../services/NestService';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { LocationPage } from '../location/location';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {

  currentUser = [{}];
  currentLocation = [{}];

  constructor(private nav: NavController, private nestService: NestService, private storage: Storage, public modalCtrl: ModalController) {

  }

  ionViewDidEnter() {

    this.storage.get('currentUser').then((val) => {
        if(val == null) {
          this.nav.setRoot(LoginPage)
          console.log("No user set.");
        } else {
          let checkLogin = this.nestService.getUserInfo(val);

          if(checkLogin == undefined) {
            console.log("not logged in..");
            //this.nav.push(LoginPage);
            this.nav.setRoot(LoginPage);
          } else {
            // Do stuff once logged in
            let info = this.nestService.getUserInfo(val);
            console.log(info);
            this.currentUser = info;
          }


        }

        this.storage.get('location').then((val) => {
          if(val != null)
          {
            this.currentLocation = val;
          }

        });
     });



  }

  presentModal() {
    let modal = this.modalCtrl.create(LocationPage);
    modal.present();
  }


  public logout() {
    this.nestService.logout().subscribe(succ => {
        // Remove the currentUser storage
        this.storage.remove("currentUser");
        this.nav.setRoot(LoginPage)
    });
  }
}
