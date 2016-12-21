import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController} from 'ionic-angular';
import { NestService } from '../services/NestService';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [NestService]
})
export class HomePage {

  nests: [{}];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private nestService: NestService) {

  }

  items = [{
    "title":"Bulbasaur",
    "image":"001 - ymJUN7U.png",
    "location":"Highfields"
  },{
    "title":"Pikachu",
    "image":"025 - BnOQ18z.png",
    "location":"Woodthorpe Park"
  }];

  getNests() {
    this.nestService.listNests().subscribe(
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
     setTimeout(() => {
       refresher.complete();
     }, 2000);
   }

   showAlert(item) {
     let alert = this.alertCtrl.create({
       title: 'Woohoo!',
       subTitle: 'You selected the title: '+item.title,
       buttons: ['OK']
     });
     alert.present();
   }

   itemSelected(item) {
     this.showAlert(item);
   }

}
