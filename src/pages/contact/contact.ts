import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';
import {
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapsLatLng,
 CameraPosition,
 GoogleMapsMarkerOptions,
 GoogleMapsMarker
} from 'ionic-native';
// Services
import { NestService } from '../../services/NestService';
// Storage
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [NestService]
})
export class ContactPage {

  item = 0;
  nest = [{}];
  pokemon = [{}];
  checkedIn = 0;

  constructor(public params: NavParams, private nestServices: NestService, private alertController: AlertController, private storage: Storage) {
    this.item = this.params.get('nest_id');

    this.getNests(this.item);
  }

  parseISO(s) {
    s = s.split(/\D/);
    return new Date(Date.UTC(s[0],--s[1],s[2],s[3],s[4],s[5],s[6]));
  }

  ionViewDidEnter() {
    this.getCheckedIn();
  }

  checkIn() {
    // Pre check to see if already init a check in


    var dateToday = new Date();
    dateToday.setMinutes(dateToday.getMinutes() + 30);
    let check_date = dateToday.toISOString();

    let location_id = this.params.get('nest_id');
    let checkIn = [{"location":location_id, "time":check_date}];

    this.storage.get('lastCheckIn').then((val) => {
        if(val == null)
        {
          // Set the location
          this.storage.set('lastCheckIn', checkIn);
        } else {
          // Do a check againt the value for the time and check it wasn't in the last hour

          var dateToday1 = new Date();
          dateToday1.setMinutes(dateToday1.getMinutes() + 30);
          let check_date1 = dateToday1.toISOString();


          let dbdate = new Date(val[0].time).getTime();
          console.log(dateToday1.getTime());

          if(dbdate < dateToday1.getTime()) {
            let alert = this.alertController.create({
              title: 'Unable to check in',
              subTitle: 'It appears you are already checked in here.',
              buttons: ['OK']
            });
            alert.present(prompt);
          } else {
            // Check the user in
            this.storage.get('currentUser').then((val) => {
                if(val == null) {
                  let alert = this.alertController.create({
                    title: 'Not logged in!',
                    subTitle: 'In order to check in to a location, you must be logged in.',
                    buttons: ['OK']
                  });
                  alert.present(prompt);
                } else {
                  let user_id = val.objectId;
                  let location_id = this.params.get('nest_id');
                  this.nestServices.checkInLocation(user_id, location_id).subscribe(
                      data => {

                          this.storage.set('lastCheckIn', checkIn);

                          let alert = this.alertController.create({
                            title: 'Checked In!',
                            subTitle: 'For the next 30 minutes, you will be shown as active in this area.',
                            buttons: ['OK']
                          });
                          alert.present(prompt);
                      },
                      err => {
                          console.log(err);
                      },
                      () => console.log('Games Search Complete')
                  );
                }
             });
          }
        }
    });


  }

  getCheckedIn() {
    let location_id = this.params.get('nest_id');

          // Do a check againt the value for the time and check it wasn't in the last hour
        this.nestServices.getCheckedIn(location_id).subscribe(
            data => {
              this.checkedIn = data.results.length;
              console.log(data);
            },
            err => {
                console.log(err);
            },
            () => console.log('Checked in Search Complete')
        );



  }

  getNests(nest_id) {
    this.nestServices.listNestDetails(nest_id).subscribe(
        data => {
            this.nest = data;
            this.pokemon = data.pokemon;
            console.log(this.pokemon);
        },
        err => {
            console.log(err);
        },
        () => console.log('Games Search Complete')
    );
  }

  /*
  // Load and init the map
  ngAfterViewInit() {
   this.loadMap();
  }

  loadMap() {
     // make sure to create following structure in your view.html file
     // <ion-content>
     //  <div #map id="map"></div>
     // </ion-content>

     // create a new map by passing HTMLElement
     let element: HTMLElement = document.getElementById('map');

     let map = new GoogleMap(element);

     // listen to MAP_READY event
     map.one(GoogleMapsEvent.MAP_READY).then(() => console.log('Map is ready!'));

     // create LatLng object
     let ionic: GoogleMapsLatLng = new GoogleMapsLatLng(43.0741904,-89.3809802);

     // create CameraPosition
     let position: CameraPosition = {
       target: ionic,
       zoom: 18,
       tilt: 30
     };

     // move the map's camera to position
     map.moveCamera(position);

     // create new marker
     let markerOptions: GoogleMapsMarkerOptions = {
       position: ionic,
       title: 'Ionic'
     };

     map.addMarker(markerOptions)
       .then((marker: GoogleMapsMarker) => {
          marker.showInfoWindow();
        });
  }
  */

}
