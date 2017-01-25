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
  next_spawn = "";

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private nestServices: NestService, public modalCtrl: ModalController,public storage: Storage) {

    // Initial data load


  }


  ionViewWillEnter() {
  }

  ionViewDidLoad() {
    this.getPageData();

    // Get the next spawn
    this.getNextSpawn();
  }

  daysBetween( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms/one_day);
  }

  minutesUntilMidnight() {
      var midnight = new Date();
      midnight.setHours( 24 );
      midnight.setMinutes( 0 );
      midnight.setSeconds( 0 );
      midnight.setMilliseconds( 0 );
      return ( midnight.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  }

  getNextSpawn() {
    this.storage.get('settings').then((val) => {
        if(val == null) {
          this.next_spawn = "TBC";
        } else {
          // Location set, get the data

          var y2k  = new Date(2000, 0, 1);
          var Jan1st2010 = new Date(val.params.nest_change.iso);
          var today= new Date();
          let days_text = "";

          var get_days = this.daysBetween(today, Jan1st2010);
          if(get_days == 1)
          {
            days_text = " day left";
            this.next_spawn = this.daysBetween(today, Jan1st2010)+" "+ days_text;
          } else if(get_days == 0) {
            days_text = " hours left";
            this.next_spawn = Math.round(this.minutesUntilMidnight())+" "+ days_text;
          } else {
            days_text = " days left";
            this.next_spawn = this.daysBetween(today, Jan1st2010)+" "+ days_text;
          }
        }
     })
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
    let loading = this.loadingCtrl.create({
      content: 'Getting nests...'
    });

    loading.present();
    this.nestServices.listNests(this.location).subscribe(
        data => {
            this.nests = data.results;
            this.nests.sort();
        },
        err => {
            console.log(err);
        },
        () => loading.dismiss()
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
