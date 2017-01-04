import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ModalController} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private nestServices: NestService, public modalCtrl: ModalController) {

    // Initial data load
    this.getNests();

  }


  presentModal() {
    let modal = this.modalCtrl.create(LocationPage);
    modal.present();
  }


  getNests() {
    this.nestServices.listNests().subscribe(
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
