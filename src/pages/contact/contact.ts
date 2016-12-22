import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
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

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [NestService]
})
export class ContactPage {

  item = 0;
  nest = [{}];
  pokemon = [{}];

  constructor(public params: NavParams, private nestServices: NestService) {
    this.item = this.params.get('nest_id');

    this.getNests(this.item);
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

}
