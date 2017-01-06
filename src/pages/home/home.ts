import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

// Other pages
import { ContactPage } from '../contact/contact';
import { LocationPage } from '../location/location';

// Services
import { NestService } from '../../services/NestService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NestService]
})
export class HomePage {

  nests: [{}];
  location_name = "";
  location = [{}];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private nestServices: NestService, public modalCtrl: ModalController,public storage: Storage) {

    // Initial data load


  }


  ionViewDidEnter() {
    console.log("Did Enter");
  }


  ionViewWillEnter() {
    console.log("Will Enter");
    this.getPageData();
  }


  getPageData() {
    this.storage.get('location').then((val) => {
        if(val == null) {
          console.log("No location set!");
          this.location_name = "No location set.";
        } else {
          // Location set, get the data
          this.location_name = val.city;
          this.location = val;
          this.getNests();
        }
     })
  }


  presentModal() {
    let modal = this.modalCtrl.create(LocationPage);
    modal.present();
  }


  getNests() {
    this.nestServices.listNests(this.location).subscribe(
        data => {
            this.nests = data.results;
            console.log(data.results);
        },
        err => {
            console.log(err);
        },
        () => console.log('Games Search Complete')
    );
  }


  doRefresh(refresher) {
     //console.log('Begin async operation', refresher);
     this.getNests();
     setTimeout(() => {
       refresher.complete();
     }, 2000);
   }

   showAlert(item) {
     let alert = this.alertCtrl.create({
       title: 'Woohoo!',
       subTitle: 'You selected the title: '+item.pokemon.name,
       buttons: ['OK']
     });
     alert.present();
   }

   itemSelected(item) {
     //this.showAlert(item);
     this.navCtrl.push(ContactPage, {
        "nest_id": item.objectId
      });
   }

}
