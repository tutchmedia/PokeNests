import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';


// Services
import { NestService } from '../../services/NestService';

/*
  Generated class for the Location page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
  providers: [NestService]
})
export class LocationPage {

  locations = [{}];
  select_location = [{}];


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private nestServices: NestService, public storage: Storage) {

    this.nestServices.listLocations().subscribe(
        data => {
            this.locations = data.results;
            console.log(data.results);
            this.storage.get('location').then((val) => {
                if(val == null) {
                  console.log("No location set!");
                } else {
                  //val.checked = true;
                  //this.select_location = val;
                  //this.locations = this.select_location;
                  console.log(val);
                }
             })
        },
        err => {
            console.log(err);
        },
        () => console.log('Locations Search Complete')
    );


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');



  }


  save() {
    this.storage.set('location', this.select_location);
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
